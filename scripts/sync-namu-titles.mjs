// 나무위키 리다이렉트로 애니 한국어 제목 보강 (로컬 실행용)
// 원리: namu.wiki/w/<일본어 원제> 접근 시 한국어 문서로 리다이렉트되는 것을 이용
//
// 사용법 (프로젝트 폴더의 scripts/ 에 넣고):
//   $env:SUPABASE_SERVICE_ROLE_KEY="서비스롤 키"   (대시보드 > Settings > API Keys)
//   node scripts/sync-namu-titles.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

let supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
try {
  const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  supaUrl ??= env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
} catch {
  // .env.local 없으면 환경변수만 사용
}
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supaUrl || !serviceKey) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL(.env.local)과 SUPABASE_SERVICE_ROLE_KEY(환경변수)가 필요합니다.",
  );
  process.exit(1);
}

const supabase = createClient(supaUrl, serviceKey);

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const hasHangul = (s) => /[가-힣]/.test(s);
const cleanDocTitle = (t) =>
  t.replace(/\((만화|애니메이션|애니|라이트 노벨|소설|시리즈)\)$/, "").trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const { data: rows, error } = await supabase
  .from("media")
  .select("id, title, title_original, title_alt")
  .eq("media_type", "anime")
  .not("title_original", "is", null);
if (error) throw error;

const targets = rows.filter((r) => !hasHangul(r.title));
console.log(`대상: ${targets.length}건 (이미 한글 제목인 항목은 제외)`);

let updated = 0;
for (const row of targets) {
  await sleep(1000); // 예의상 천천히 — 나무위키에 부담 주지 않기
  try {
    const res = await fetch(
      `https://namu.wiki/w/${encodeURIComponent(row.title_original)}`,
      { headers: { "User-Agent": UA, "Accept-Language": "ko" } },
    );
    if (!res.ok) {
      console.log(`[${res.status}] ${row.title_original} — 문서 없음/차단`);
      continue;
    }
    const path = new URL(res.url).pathname;
    if (!path.startsWith("/w/")) continue;
    const doc = cleanDocTitle(decodeURIComponent(path.slice(3)));
    if (!hasHangul(doc) || doc === row.title) {
      console.log(`[미발견] ${row.title_original} — 한국어 리다이렉트 없음`);
      continue;
    }

    const alt = [
      ...new Set([...(row.title_alt ?? []), row.title].filter((t) => t && t !== doc)),
    ];
    const { error: upErr } = await supabase
      .from("media")
      .update({ title: doc, title_alt: alt })
      .eq("id", row.id);
    if (upErr) console.log(`[DB오류] ${row.title}: ${upErr.message}`);
    else {
      console.log(`✓ ${row.title} → ${doc}`);
      updated++;
    }
  } catch (e) {
    console.log(`[오류] ${row.title_original}: ${e.message}`);
  }
}
console.log(`\n완료: ${updated}건 갱신 / 대상 ${targets.length}건`);
