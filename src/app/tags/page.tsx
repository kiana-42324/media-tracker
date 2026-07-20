import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { genreLabel, HIDDEN_GENRES } from "@/lib/genre-labels";

const GROUP_LABEL: Record<string, string> = {
  anime: "애니 장르",
  game: "게임 장르",
  music: "음악 장르",
  common: "공통",
};

export default async function TagsPage() {
  const supabase = await createClient();
  const { data: genres } = await supabase
    .from("genres")
    .select("id, name, media_type")
    .order("name");

  const groups = new Map<string, { id: number; name: string }[]>();
  for (const g of genres ?? []) {
    if (HIDDEN_GENRES.has(g.name)) continue;
    const key = g.media_type ?? "common";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(g);
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        ← 홈
      </Link>
      <h1 className="mt-4 text-2xl font-bold">태그로 찾아보기</h1>

      {["anime", "game", "music", "common"].map((key) => {
        const list = groups.get(key);
        if (!list || list.length === 0) return null;
        return (
          <section key={key} className="mt-8">
            <h2 className="mb-3 text-lg font-semibold">{GROUP_LABEL[key]}</h2>
            <div className="flex flex-wrap gap-2">
              {list.map((g) => (
                <Link
                  key={g.id}
                  href={`/search?genre=${g.id}`}
                  className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
                >
                  {genreLabel(g.name)}
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
