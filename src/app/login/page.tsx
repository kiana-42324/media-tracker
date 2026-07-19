"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "password" | "magic";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        throw new Error(
          ".env.local이 없거나 비어 있습니다. 프로젝트 루트에 .env.local을 만들고 dev 서버를 재시작하세요.",
        );
      }
      const supabase = createClient();

      if (mode === "password") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) setError(error.message);
        else {
          router.push("/");
          router.refresh();
        }
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${location.origin}/auth/callback` },
        });
        if (error) setError(error.message);
        else setSent(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 p-6">
      <h1 className="text-2xl font-bold">로그인</h1>

      <div className="flex gap-1 rounded-md bg-neutral-100 p-1 text-sm dark:bg-neutral-800">
        {(
          [
            ["password", "비밀번호"],
            ["magic", "매직 링크"],
          ] as [Mode, string][]
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
              setSent(false);
            }}
            className={`flex-1 rounded px-3 py-1.5 ${
              mode === m
                ? "bg-white font-medium shadow-sm dark:bg-neutral-900"
                : "text-neutral-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {sent ? (
        <p className="text-sm">
          <strong>{email}</strong>로 로그인 링크를 보냈어요. 메일함을 확인해
          주세요.
        </p>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
          {mode === "password" && (
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
          )}
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
          >
            {busy
              ? "처리 중..."
              : mode === "password"
                ? "로그인"
                : "매직 링크 받기"}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      )}

      {mode === "magic" && !sent && (
        <p className="text-xs text-neutral-500">
          참고: 기본 메일 발송은 시간당 2통 제한이 있어요. 개발 중에는 비밀번호
          로그인을 권장합니다.
        </p>
      )}
    </main>
  );
}
