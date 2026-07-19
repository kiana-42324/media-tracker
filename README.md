# Media Tracker

애니메이션 · 스팀 게임 · J-POP 기록/평점 공유 서비스. Next.js 15 + Supabase.

## 시작하기

```bash
npm install
npm run dev
```

http://localhost:3000 접속. `.env.local`에 Supabase 접속 정보가 이미 설정되어 있습니다 (프로젝트: media-tracker, 서울 리전).

## 구조

```
src/
├── app/
│   ├── page.tsx              # 홈 — 평점 랭킹 (서버 컴포넌트 예시)
│   ├── login/page.tsx        # 매직 링크 로그인
│   └── auth/
│       ├── callback/route.ts # OAuth/PKCE 코드 교환
│       └── confirm/route.ts  # 매직 링크 token_hash 검증
├── lib/supabase/
│   ├── client.ts             # 브라우저용 클라이언트
│   ├── server.ts             # 서버 컴포넌트/Route Handler용
│   └── middleware.ts         # 세션 갱신 로직
├── middleware.ts             # 매 요청 세션 갱신
└── types/database.ts         # DB 스키마에서 자동 생성된 타입
```

## 데이터 접근 규칙

- 단순 CRUD는 클라이언트/서버에서 `supabase-js` 직접 호출 — 인가는 DB의 RLS 정책이 담당
- `media`/`genres` 등 카탈로그 테이블은 읽기 전용 — 쓰기는 service_role 키를 쓰는 수집 함수만 가능
- DB 스키마 변경 후에는 타입 재생성: `npx supabase gen types typescript --project-id abcdkblroyfvgqvrckum > src/types/database.ts`

## 배포 (Vercel)

1. GitHub 저장소 연결
2. 환경 변수 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 등록
3. Supabase 대시보드 > Authentication > URL Configuration에 배포 도메인 추가

## 다음 단계

- [ ] 미디어 상세 페이지 (`/media/[id]`)
- [ ] 기록 upsert UI (상태/평점/리뷰)
- [ ] AniList/Steam 메타데이터 수집 Edge Function
- [ ] 검색 (pg_trgm `similarity()` 쿼리)
- [ ] 프로필/피드
