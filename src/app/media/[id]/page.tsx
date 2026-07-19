import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogEditor } from "@/components/log-editor";

const TYPE_LABEL: Record<string, string> = {
  anime: "애니",
  game: "게임",
  music: "음악",
};

export default async function MediaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mediaId = Number(id);
  if (!Number.isFinite(mediaId)) notFound();

  const supabase = await createClient();

  const { data: media } = await supabase
    .from("media")
    .select(
      "*, anime_details(*), game_details(*), music_details(*), media_genres(genres(name))",
    )
    .eq("id", mediaId)
    .single();
  if (!media) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: myLog } = user
    ? await supabase
        .from("logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("media_id", mediaId)
        .maybeSingle()
    : { data: null };

  const { data: reviews } = await supabase
    .from("logs")
    .select(
      "id, rating, review, has_spoiler, created_at, profiles!logs_user_id_fkey(username)",
    )
    .eq("media_id", mediaId)
    .not("review", "is", null)
    .order("created_at", { ascending: false })
    .limit(20);

  const genres = media.media_genres
    .map((mg) => mg.genres?.name)
    .filter(Boolean) as string[];

  const anime = media.anime_details;
  const game = media.game_details;
  const music = media.music_details;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        ← 홈
      </Link>

      <div className="mt-4 flex gap-6">
        {media.cover_url && (
          <Image
            src={media.cover_url}
            alt={media.title}
            width={160}
            height={220}
            unoptimized
            className="h-[220px] w-[160px] shrink-0 rounded-md object-cover"
          />
        )}
        <div className="min-w-0">
          <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-800">
            {TYPE_LABEL[media.media_type] ?? media.media_type}
          </span>
          <h1 className="mt-2 text-2xl font-bold">{media.title}</h1>
          {media.title_original && media.title_original !== media.title && (
            <p className="text-sm text-neutral-500">{media.title_original}</p>
          )}
          <p className="mt-2 text-sm">
            ★ {media.avg_rating ?? "-"}{" "}
            <span className="text-neutral-500">
              ({media.ratings_count}명 평가)
            </span>
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            {media.release_date ?? "출시일 미상"}
            {anime?.episodes ? ` · ${anime.episodes}화` : ""}
            {anime?.studio ? ` · ${anime.studio}` : ""}
            {game?.developer ? ` · ${game.developer}` : ""}
            {game?.price_krw != null
              ? ` · ₩${game.price_krw.toLocaleString()}`
              : ""}
            {music?.artist ? ` · ${music.artist}` : ""}
          </p>
          {genres.length > 0 && (
            <p className="mt-2 flex flex-wrap gap-1">
              {genres.map((g) => (
                <span
                  key={g}
                  className="rounded-full border border-neutral-200 px-2 py-0.5 text-xs dark:border-neutral-700"
                >
                  {g}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>

      {media.description && (
        <p className="mt-6 whitespace-pre-line text-sm leading-6 text-neutral-700 dark:text-neutral-300">
          {media.description}
        </p>
      )}

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">내 기록</h2>
        {user ? (
          <LogEditor mediaId={mediaId} userId={user.id} initial={myLog} />
        ) : (
          <p className="text-sm text-neutral-500">
            기록을 남기려면{" "}
            <Link href="/login" className="underline">
              로그인
            </Link>
            하세요.
          </p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">
          리뷰 {reviews?.length ?? 0}
        </h2>
        {(!reviews || reviews.length === 0) && (
          <p className="text-sm text-neutral-500">아직 리뷰가 없어요.</p>
        )}
        <ul className="flex flex-col gap-3">
          {reviews?.map((r) => (
            <li
              key={r.id}
              className="rounded-md border border-neutral-200 p-4 dark:border-neutral-800"
            >
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">{r.profiles?.username}</span>
                <span className="text-neutral-500">
                  {r.rating != null ? `★ ${r.rating / 2}` : ""}
                </span>
              </div>
              {r.has_spoiler ? (
                <details>
                  <summary className="cursor-pointer text-sm text-neutral-500">
                    스포일러 포함 — 펼쳐서 보기
                  </summary>
                  <p className="mt-2 whitespace-pre-line text-sm">{r.review}</p>
                </details>
              ) : (
                <p className="whitespace-pre-line text-sm">{r.review}</p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
