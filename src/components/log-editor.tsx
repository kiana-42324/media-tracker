"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Tables, Enums } from "@/types/database";

const STATUS_OPTIONS: { value: Enums<"log_status">; label: string }[] = [
  { value: "planning", label: "볼 예정" },
  { value: "in_progress", label: "진행 중" },
  { value: "completed", label: "완료" },
  { value: "paused", label: "보류" },
  { value: "dropped", label: "중단" },
];

// rating은 DB에 1~10 정수(0.5점 단위 ×2)로 저장
const RATING_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

export function LogEditor({
  mediaId,
  userId,
  initial,
}: {
  mediaId: number;
  userId: string;
  initial: Tables<"logs"> | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Enums<"log_status">>(
    initial?.status ?? "planning",
  );
  const [rating, setRating] = useState<number | null>(initial?.rating ?? null);
  const [review, setReview] = useState(initial?.review ?? "");
  const [hasSpoiler, setHasSpoiler] = useState(initial?.has_spoiler ?? false);
  const [isPrivate, setIsPrivate] = useState(initial?.is_private ?? false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.from("logs").upsert(
      {
        user_id: userId,
        media_id: mediaId,
        status,
        rating,
        review: review.trim() || null,
        has_spoiler: hasSpoiler,
        is_private: isPrivate,
      },
      { onConflict: "user_id,media_id" },
    );
    setSaving(false);
    if (error) setMessage(`저장 실패: ${error.message}`);
    else {
      setMessage("저장됐어요.");
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-md border border-neutral-200 p-4 dark:border-neutral-800">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Enums<"log_status">)}
          className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          value={rating ?? ""}
          onChange={(e) =>
            setRating(e.target.value ? Number(e.target.value) : null)
          }
          className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        >
          <option value="">평점 없음</option>
          {RATING_OPTIONS.map((v) => (
            <option key={v} value={v}>
              ★ {v / 2}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-1.5 text-sm">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
          비공개
        </label>
      </div>

      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="리뷰를 남겨보세요 (선택)"
        rows={4}
        className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
      />

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1.5 text-sm">
          <input
            type="checkbox"
            checked={hasSpoiler}
            onChange={(e) => setHasSpoiler(e.target.checked)}
          />
          스포일러 포함
        </label>
        <button
          onClick={save}
          disabled={saving}
          className="ml-auto rounded-md bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
        >
          {saving ? "저장 중..." : "저장"}
        </button>
      </div>

      {message && <p className="text-sm text-neutral-500">{message}</p>}
    </div>
  );
}
