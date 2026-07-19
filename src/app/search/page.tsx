import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const TYPE_LABEL: Record<string, string> = {
  anime: "애니",
  game: "게임",
  music: "음악",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const supabase = await createClient();
  const { data: results, error } = query
    ? await supabase.rpc("search_media", { q: query, max_results: 30 })
    : { data: null, error: null };

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        ← 홈
      </Link>

      <form action="/search" className="mt-4 flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="애니 · 게임 · 음악 검색"
          autoFocus
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
        <button
          type="submit"
          className="shrink-0 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          검색
        </button>
      </form>

      {error && (
        <p className="mt-4 text-sm text-red-600">검색 오류: {error.message}</p>
      )}

      {query && results && (
        <p className="mt-4 text-sm text-neutral-500">
          &ldquo;{query}&rdquo; 검색 결과 {results.length}건
        </p>
      )}

      {query && results?.length === 0 && (
        <p className="mt-2 text-sm text-neutral-500">
          결과가 없어요. 다른 표기(원제, 로마자)로 검색해 보세요.
        </p>
      )}

      <ul className="mt-3 flex flex-col gap-2">
        {results?.map((m) => (
          <li key={m.id}>
            <Link
              href={`/media/${m.id}`}
              className="flex items-center justify-between rounded-md border border-neutral-200 px-4 py-3 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
            >
              <span className="min-w-0">
                <span className="mr-2 rounded bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-800">
                  {TYPE_LABEL[m.media_type] ?? m.media_type}
                </span>
                {m.title}
                {m.title_original && m.title_original !== m.title && (
                  <span className="ml-2 text-xs text-neutral-500">
                    {m.title_original}
                  </span>
                )}
              </span>
              <span className="shrink-0 text-sm text-neutral-500">
                ★ {m.avg_rating ?? "-"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
