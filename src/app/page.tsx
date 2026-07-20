import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const PER_PAGE = 50;

const TYPE_LABEL: Record<string, string> = {
  anime: "애니",
  game: "게임",
  music: "음악",
};

const TABS = [
  { key: "", label: "전체" },
  { key: "anime", label: "애니" },
  { key: "game", label: "게임" },
  { key: "music", label: "음악" },
];

function pageHref(type: string, page: number) {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; type?: string }>;
}) {
  const { page: pageParam, type: typeParam } = await searchParams;
  const type = ["anime", "game", "music"].includes(typeParam ?? "")
    ? (typeParam as "anime" | "game" | "music")
    : "";
  const page = Math.max(1, Number(pageParam) || 1);
  const from = (page - 1) * PER_PAGE;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from("media")
    .select("id, title, media_type, avg_rating, ratings_count", {
      count: "exact",
    })
    .order("popularity", { ascending: false, nullsFirst: false })
    .order("id")
    .range(from, from + PER_PAGE - 1);
  if (type) query = query.eq("media_type", type);

  const { data: media, count, error } = await query;
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PER_PAGE));

  // 현재 페이지 주변 번호 (앞뒤 2개)
  const pageNums: number[] = [];
  for (
    let n = Math.max(1, page - 2);
    n <= Math.min(totalPages, page + 2);
    n++
  ) {
    pageNums.push(n);
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Media Tracker</h1>
        {user ? (
          <form
            action="/auth/signout"
            method="post"
            className="flex items-center gap-3"
          >
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

      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-1 rounded-md bg-neutral-100 p-1 text-sm dark:bg-neutral-800">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={pageHref(t.key, 1)}
              className={`rounded px-3 py-1 ${
                type === t.key
                  ? "bg-white font-medium shadow-sm dark:bg-neutral-900"
                  : "text-neutral-500"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
        <span className="text-sm text-neutral-500">
          인기순 · 총 {(count ?? 0).toLocaleString()}개
        </span>
      </div>

      {error && (
        <p className="text-sm text-red-600">목록 오류: {error.message}</p>
      )}

      <ul className="flex flex-col gap-2">
        {media?.map((m, i) => (
          <li key={m.id}>
            <Link
              href={`/media/${m.id}`}
              className="flex items-center justify-between rounded-md border border-neutral-200 px-4 py-3 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
            >
              <span className="min-w-0">
                <span className="mr-2 text-xs text-neutral-400">
                  {from + i + 1}
                </span>
                <span className="mr-2 rounded bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-800">
                  {TYPE_LABEL[m.media_type] ?? m.media_type}
                </span>
                {m.title}
              </span>
              <span className="shrink-0 text-sm text-neutral-500">
                ★ {m.avg_rating != null ? (m.avg_rating / 2).toFixed(1) : "-"}{" "}
                ({m.ratings_count})
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <nav className="mt-6 flex items-center justify-center gap-1 text-sm">
        {page > 1 && (
          <Link
            href={pageHref(type, page - 1)}
            className="rounded-md border border-neutral-200 px-3 py-1.5 dark:border-neutral-700"
          >
            이전
          </Link>
        )}
        {pageNums[0] > 1 && (
          <>
            <Link
              href={pageHref(type, 1)}
              className="rounded-md px-3 py-1.5 text-neutral-500"
            >
              1
            </Link>
            {pageNums[0] > 2 && <span className="px-1 text-neutral-400">…</span>}
          </>
        )}
        {pageNums.map((n) => (
          <Link
            key={n}
            href={pageHref(type, n)}
            className={`rounded-md px-3 py-1.5 ${
              n === page
                ? "bg-neutral-900 font-medium text-white dark:bg-white dark:text-neutral-900"
                : "text-neutral-500"
            }`}
          >
            {n}
          </Link>
        ))}
        {pageNums[pageNums.length - 1] < totalPages && (
          <>
            {pageNums[pageNums.length - 1] < totalPages - 1 && (
              <span className="px-1 text-neutral-400">…</span>
            )}
            <Link
              href={pageHref(type, totalPages)}
              className="rounded-md px-3 py-1.5 text-neutral-500"
            >
              {totalPages}
            </Link>
          </>
        )}
        {page < totalPages && (
          <Link
            href={pageHref(type, page + 1)}
            className="rounded-md border border-neutral-200 px-3 py-1.5 dark:border-neutral-700"
          >
            다음
          </Link>
        )}
      </nav>
    </main>
  );
}
