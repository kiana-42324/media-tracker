import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const TYPE_LABEL: Record<string, string> = {
  anime: "애니",
  game: "게임",
  music: "음악",
};

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: media, error } = await supabase
    .from("media")
    .select("id, title, media_type, avg_rating, ratings_count, cover_url")
    .order("avg_rating", { ascending: false, nullsFirst: false })
    .limit(20);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Media Tracker</h1>
        {user ? (
          <form action="/auth/signout" method="post" className="flex items-center gap-3">
            <span className="text-sm text-neutral-500">{user.email}</span>
            <button type="submit" className="text-sm underline">
              로그아웃
            </button>
          </form>
        ) : (
          <span className="flex gap-3 text-sm">
            <Link href="/login" className="underline">
              로그인
            </Link>
            <Link href="/signup" className="underline">
              회원가입
            </Link>
          </span>
        )}
      </header>

      <form action="/search" className="mb-6 flex gap-2">
        <input
          type="search"
          name="q"
          placeholder="애니 · 게임 · 음악 검색"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
        <button
          type="submit"
          className="shrink-0 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          검색
        </button>
        <Link
          href="/tags"
          className="flex shrink-0 items-center rounded-md border border-neutral-300 px-3 text-sm dark:border-neutral-700"
        >
          태그
        </Link>
      </form>

      <h2 className="mb-4 text-lg font-semibold">평점 랭킹</h2>

      {error && (
        <p className="text-sm text-red-600">DB 연결 오류: {error.message}</p>
      )}

      {media && media.length === 0 && (
        <p className="text-sm text-neutral-500">
          아직 등록된 미디어가 없어요. 메타데이터 수집 함수를 실행하면 여기에
          카탈로그가 표시됩니다.
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {media?.map((m) => (
          <li key={m.id}>
            <Link
              href={`/media/${m.id}`}
              className="flex items-center justify-between rounded-md border border-neutral-200 px-4 py-3 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
            >
              <span>
                <span className="mr-2 rounded bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-800">
                  {TYPE_LABEL[m.media_type] ?? m.media_type}
                </span>
                {m.title}
              </span>
              <span className="text-sm text-neutral-500">
                ★ {m.avg_rating != null ? (m.avg_rating / 2).toFixed(1) : "-"}{" "}
                ({m.ratings_count})
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
