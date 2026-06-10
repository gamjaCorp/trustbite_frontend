# Week 4 — 백엔드 연동 + 최종 QA·배포 (백엔드 준비 후)

## 이번 주 목표

백엔드 API가 준비된 시점에 시작. W3에서 인프라 골격(타입 경로, fetch 래퍼, RHF/zod)을 완비한 상태에서 **9개 화면을 mock → 실 API로 마이그레이션**한다.

이 주가 끝나면 `src/data/mock-*` 파일이 모두 사라지고, **1차 MVP 9개 화면이 실 백엔드 위에서 동작**한다.

> 화면 단위 마이그레이션 표준 7단계: 백엔드 endpoint 확인 → 타입 분할 → API 함수(fetch) → React Query 훅(클라 한정) → 페이지 전환 → 의존성 정리 → 체크

---

## 일별 요약

| Day | 날짜 | 목표 | 주요 산출물 | 완료 |
|---|---|---|---|---|
| Day 1 | 백엔드 준비 후 | 실 인증 — 백엔드 연동 | `POST /api/auth/session/google` · accessToken 갱신 · 온보딩 영속화 (BFF — token은 서버 전용) | [x] |
| Day 2 | — | `/profile` + `/profile/grade` 데이터 레이어 | `useMyProfile`, `useGradeProgress`, mock 삭제 | [ ] |
| Day 3 | — | `/restaurant/[id]` 마이그 | `useRestaurantDetail`, 비로그인 분기 정합 | [ ] |
| Day 4 | — | `/review/new` mutation + 인증 가드 + 에러 페이지 | `useSubmitReview`, middleware 매처, `not-found/error.tsx` | [ ] |
| Day 5 | — | `/my-places` + 탐색 탭 검색/필터 | `useMyRanking`, `useSearchRestaurants` (디바운스/URL) | [ ] |
| Day 6 | — | `/user/[id]` + Wishlist mutation + mock 전량 삭제 | `useUserProfile`, `useToggleBookmark`, mock-* 0개 | [ ] |
| Day 7 | — | 통합 QA + 스테이징 배포 + 회고 | PRD 플로우 1-1/1-2/1-3 수동 테스트, Vercel 스테이징 URL | [ ] |

---

## Day 1 — 실 인증 — 백엔드 연동

> 토큰 정책: BFF — accessToken은 클라 비노출, 서버에서만 접근 (`docs/spec/auth/token.md`)

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| 토큰 발급 | - `callbacks.jwt` — Google `account.id_token`으로 `POST /api/auth/session/google` 호출, `accessToken`·`needsOnboarding`·만료시각을 JWT에 저장 | `src/auth.ts` | [x] |
|  | - 백엔드 refreshToken은 body로 수신 (Set-Cookie 미사용) — `token.refreshToken`에 저장, 7일 유효 | `src/auth.ts` | [x] |
|  | - `callbacks.session` — `needsOnboarding`·`error` 노출. **accessToken은 session에 넣지 않음** | `src/auth.ts`, `src/lib/types/next-auth.d.ts` | [x] |
|  | - `authedFetch` — `getToken()`으로 JWT 직접 복호화해 accessToken 획득 (server-only) | `src/network/server.ts` | [x] |
|  | - env 정리 — `BACKEND_API_URL` (서버 전용) + `.env.example` 커밋 | `src/network/base.ts`, `.env.local` | [x] |
| 토큰 갱신 | - `callbacks.jwt` — accessToken 만료(30분) 감지 시 `POST /api/auth/refresh` 호출해 갱신 | `src/auth.ts` | [x] |
|  | - 갱신 실패(refreshToken 만료·401) 시 `token.error = 'RefreshTokenExpired'` → 미들웨어에서 `/signin` 리다이렉트 | `src/auth.ts`, `src/proxy.ts` | [x] |
|  | - 🐞 refresh 버그 수정 — `postRefreshToken` 반환 타입이 `GoogleSessionResponse`라 refreshToken 덮어쓰던 문제 → `TokenRefreshResponse` 분리 | `src/lib/types/auth/response.ts`, `src/api/auth/auth.ts` | [x] |
|  | - 백엔드 userId 정합 — `token.id`를 Google id 대신 accessToken `sub` 클레임으로 설정 (로그인·갱신 모두 일관) | `src/auth.ts` | [x] |
|  | - 세션 `maxAge` 7일 정합 (백엔드 refreshToken 수명과 일치) | `src/auth.ts` | [x] |
| 온보딩 | - `PATCH /api/users/me/onboarding` Server Action — 닉네임 + Google 이미지 URL 전송 (파일 업로드는 2차) | `src/app/onboarding/actions.ts` | [x] |
|  | - 온보딩 폼 submit → Server Action 연결, 성공 시 세션 `needsOnboarding` 갱신 후 `/` 이동 | `src/app/onboarding/_components/index.tsx` | [x] |
|  | - 미들웨어 onboarding gate — `needsOnboarding: true`이면 `/onboarding` 강제, 완료 사용자의 `/onboarding` 접근은 `/`로 리다이렉트 | `src/proxy.ts` | [x] |
| 헤더 연동 | - 설계 확정: `/api/users/me`는 세션 미저장. 프로필은 매 요청 `authedFetch` 조회 (stale 방지 + 쿠키 4KB) | — | [x] |
|  | - `GradeName` 유니온 + `MyProfileResponse` 타입 추가 | `src/lib/types/user.ts` | [x] |
|  | - `gradeNameToLevel()` — enum 이름 → `GradeLevel` 숫자 변환 (API 경계 anti-corruption) | `src/lib/domain/grade-levels.ts` | [x] |
|  | - `getMyProfile()` API 함수 (`authedFetch`, server-only) | `src/api/user/user.ts` | [x] |
|  | - 헤더 서버/클라이언트 3분할: `header/index.tsx`(서버, auth+fetch) · `nav-tabs.tsx`(클라) · `user-auth-button.tsx`(서버) | `src/components/common/layout/header/` | [x] |
| 확인·검증 | - 비로그인 → Google → 신규 `/onboarding` → `/` 흐름 + 재로그인 시 온보딩 skip 확인 | — | [x] |
|  | - `pnpm lint && npx tsc --noEmit` 그린 | — | [x] |

> ⚠️ RSC 렌더 중에는 `cookies().set()` 불가 — refresh의 Set-Cookie forward는 Route Handler 컨텍스트에서만 가능 (`token.md` "set-cookie forward 함의"). 구현 시 갱신 경로 설계에 반영.

> 산출물: BFF 구조로 인증 흐름이 실 백엔드 위에서 동작. accessToken이 클라에 노출되지 않음.

---

## Day 2 — `/profile` + `/profile/grade` 데이터 레이어

두 화면 모두 `src/api/user/` / `src/hooks/user/`에 들어가는 짝이라 같은 날 처리.

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| 타입·API | - `MyProfileResponse`, `GradeProgressResponse` 타입 정의 | `src/lib/types/user/response.ts` | [ ] |
|  | - `getMyProfile()`, `getGradeProgress()` API 함수 작성 (`authedFetch`, `no-store`) | `src/api/user/user.ts` (신규) | [ ] |
| 페이지 전환 | - `/profile` 페이지를 **Server Component**로 전환 — API 함수 직접 호출, Suspense 로딩, 에러('다시 시도' 버튼) | `src/app/profile/page.tsx`, `src/app/profile/loading.tsx` (신규) | [ ] |
|  | - `mock-my-profile.ts` 흡수 후 삭제 | `src/data/mock-my-profile.ts` (삭제) | [ ] |
| 확인 | - 브라우저 3상태 확인: 로딩 → 정상 → 에러 강제 | — | [ ] |

> 산출물: `/profile`이 Server Component + authedFetch로 동작. 이후 화면의 마이그 템플릿

---

## Day 3 — `/restaurant/[id]` 마이그

가장 복잡한 화면. 표준 7단계 적용 + 비로그인 분기 정합.

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| 타입·API | - `RestaurantDetailResponse` 타입 정의 | `src/lib/types/restaurant/response.ts` | [ ] |
|  | - `getRestaurantDetail(id: string)` API 함수 작성 (`publicFetch`, `tags:['restaurant',id]`, revalidate) | `src/api/restaurant/restaurant.ts` (신규) | [ ] |
| 페이지 전환 | - 페이지를 **Server Component**로 전환 — API 함수 직접 호출 + 로딩(Suspense) / 404(`notFound()`) | `src/app/restaurant/[id]/page.tsx`, `loading.tsx` (신규) | [ ] |
|  | - middleware `auth()` 결과로 비로그인 미리보기 분기 일관화 | — | [ ] |
|  | - `mock-restaurant-detail.ts` 흡수 후 삭제 | `src/data/mock-restaurant-detail.ts` (삭제) | [ ] |

> 산출물: `/restaurant/[id]`가 Server Component + publicFetch(Next 캐시)로 동작

---

## Day 4 — `/review/new` mutation + 인증 가드 + 에러 페이지

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| 타입·API | - `CreateReviewRequest`, `ReviewSubmitResult` 타입 정의 | `src/lib/types/review/request.ts`, `response.ts` (신규) | [ ] |
|  | - `submitReview(data)` **Server Action** 작성 (multipart 사진 포함) + 성공 후 `revalidateTag('restaurant')` | `src/app/review/actions.ts` (신규) | [ ] |
|  | - `getReviewResult(reviewId)` API 함수 작성 (`authedFetch`) | `src/api/review/review.ts` (신규) | [ ] |
| 폼 연결 | - 폼 submit → Server Action 호출 + 제출 중 버튼 disabled + Spinner | `src/components/features/review/review-write-form.tsx` | [ ] |
|  | - 결과 Dialog에 서버 fetch(reviewId) 연결 + 로딩 스켈레톤 | `src/components/features/review/review-result-dialog.tsx` | [ ] |
| 인증 가드 | - middleware에 `/profile`, `/my-places`, `/review/*` 인증 가드 추가 | `src/proxy.ts` | [ ] |
|  | - 비로그인 → `/signin?next=<원래 경로>` 리다이렉트 + 로그인 후 `next` 쿼리로 복귀 | `src/proxy.ts`, `src/app/signin/page.tsx` | [ ] |
| 리뷰 fallback | - `/restaurant/[id]/review/new` 페이지에 mock 외 가게 ID fallback 처리 — `synthesizeDetailFromEntry(null, id)` 로 placeholder 진행하거나 `/review/new` redirect. 임시로 카드 링크는 `/review/new`로 우회 중 | `app/restaurant/[id]/review/new/page.tsx`, `common/place-list-row.tsx` | [ ] |
| 에러 페이지 | - 404 페이지 (TrustBite 톤) | `src/app/not-found.tsx` (신규) | [ ] |
|  | - 전역 에러 페이지 + '다시 시도' 버튼 | `src/app/error.tsx` (신규) | [ ] |
|  | - 맛집 상세 전용 에러 페이지 | `src/app/restaurant/[id]/error.tsx` (신규) | [ ] |
| 검증 | - `pnpm lint && npx tsc --noEmit` 그린 | — | [ ] |

> 산출물: 폼 → mutation → 결과 흐름 정식화 + 인증 가드 + 에러 페이지

---

## Day 5 — `/my-places` + 탐색 탭 검색/필터

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| my-places 마이그 | - `MyRestaurantStats`, `MyRestaurantRankResponse` 타입 정의 | `src/lib/types/restaurant/response.ts` | [ ] |
|  | - `getMyRanking()`, `getMyStats()` API 함수 작성 (`authedFetch`, `no-store`) | `src/api/restaurant/my-ranking.ts` (신규) | [ ] |
|  | - `/my-places` 페이지를 **Server Component**로 전환 — API 함수 직접 호출, Suspense 로딩 / 빈 목록 분기 | `src/app/my-places/page.tsx`, `loading.tsx` (신규) | [ ] |
|  | - `mock-my-places.ts` 흡수 후 삭제 | `src/data/mock-my-places.ts` (삭제) | [ ] |
| 검색/필터 | - `SearchParams` 타입 정의 (q, region, category[], context[], sort, page) | `src/lib/types/restaurant/request.ts` (신규) | [ ] |
|  | - `searchRestaurants(params)` API 함수 작성 (`clientFetch`) | `src/api/restaurant/restaurant.ts` | [ ] |
|  | - 300ms 디바운스 + URL 쿼리 동기화 **React Query 검색 훅** 작성 | `src/hooks/restaurant/use-search-restaurants.ts` (신규) | [ ] |
|  | - 검색바·지역/정렬/카테고리/상황 필터 → URL 즉시 반영 + '필터 초기화' 버튼 | `src/components/features/map/search-bar.tsx` 등 | [ ] |
|  | - Kakao Local 임시 어댑터 교체 (자체 백엔드 검색으로) | `src/api/kakao-local.ts` (삭제) | [ ] |

> 산출물: `/my-places` + 탐색 탭 검색/필터가 실 백엔드 위에서 동작

---

## Day 6 — `/user/[id]` + Wishlist mutation + mock 전량 삭제

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| user/[id] 마이그 | - `UserProfileResponse` 타입 정의 | `src/lib/types/user/response.ts` | [ ] |
|  | - `getUserProfile(id: string)` API 함수 작성 (`publicFetch`, `tags:['user',id]`) | `src/api/user/user.ts` | [ ] |
|  | - `/user/[id]` 페이지를 **Server Component**로 전환 — API 함수 직접 호출 | `src/app/user/[id]/page.tsx` | [ ] |
|  | - `mock-other-user.ts` 흡수 후 삭제 | `src/data/mock-other-user.ts` (삭제) | [ ] |
| Wishlist mutation | - `WishlistItem` 타입 정의 | `src/lib/types/wishlist/type.ts` (신규) | [ ] |
|  | - `getWishlist()`, `addBookmark(id)`, `removeBookmark(id)` API 함수 작성 (`clientFetch`) | `src/api/wishlist/wishlist.ts` (신규) | [ ] |
|  | - **React Query** wishlist 조회 훅 + 낙관적 업데이트 toggle 훅 작성 (실패 시 롤백) | `src/hooks/wishlist/use-wishlist.ts`, `use-toggle-bookmark.ts` (신규) | [ ] |
|  | - wishlist-section, restaurant-header 북마크 → `useToggleBookmark` 교체 | `src/components/features/my-places/wishlist-section.tsx`, `restaurant-detail/restaurant-header.tsx` | [ ] |
| mock 전량 삭제 | - `wishlist-mock-store.tsx`, `helpful-mock-store.tsx`, `follow-mock-store.tsx`, `my-profile-mock-store.tsx` 제거 | `src/stores/` (삭제) | [ ] |
|  | - `src/data/mock-*` 파일 0개 확인 (남은 파일 전량 흡수) | `src/data/` (전량 삭제) | [ ] |
| 검증 | - `pnpm lint && npx tsc --noEmit && pnpm build` 그린 | — | [ ] |

> 산출물: 1차 MVP 9개 화면이 실 백엔드 API 위에서 동작. mock 파일 0개

---

## Day 7 — 통합 QA + 스테이징 배포 + 회고

PRD 핵심 루프 3개를 직접 따라가며 버그를 잡고 스테이징 배포 후 내부 테스트.

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| 플로우 1-1 | - 비로그인 홈 접속 → 탐색 탭 랭킹 확인 | — | [ ] |
|  | - 맛집 카드 클릭 → 상세 미리보기 (리뷰 2~3개 + CTA) | — | [ ] |
|  | - '리뷰 더 보기' → 로그인 모달 | — | [ ] |
|  | - 구글 로그인 → 온보딩 (닉네임/지역) → 완료 | — | [ ] |
|  | - 로그인 상태 홈 복귀, 인트로 카드 사라짐 | — | [ ] |
| 플로우 1-2 | - 맛집 상세 → '리뷰 쓰기' CTA | — | [ ] |
|  | - 리뷰 작성 — 가게 검색·평점·텍스트 100자 이상·사진 업로드 | — | [ ] |
|  | - 사진 업로드 시 실시간 신뢰도 게이지 변화 확인 | — | [ ] |
|  | - 제출 → 결과 화면: 게이지 애니메이션·기여·등급 진행바 | — | [ ] |
| 플로우 1-3 | - 리뷰 카드 닉네임 클릭 → `/user/[id]` | — | [ ] |
|  | - 팔로우 버튼 UI 확인 (1차: UI만) | — | [ ] |
|  | - 맛집 랭킹 잠금 메시지 확인 | — | [ ] |
| 배포 | - env 최종 확인: `BACKEND_API_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_KAKAO_MAP_KEY` | — | [ ] |
|  | - `pnpm build` 로컬 최종 확인 | — | [ ] |
|  | - Vercel 스테이징 배포 + 도메인/HTTPS 확인 | — | [ ] |
|  | - 배포된 URL에서 플로우 1-1, 1-2 빠르게 재확인 | — | [ ] |
|  | - 3~5명 테스터에게 URL 공유 + 피드백 수집 | — | [ ] |
|  | - critical 이슈 핫픽스 | — | [ ] |
|  | - 잘된 것 / 부족한 것 정리 + 2차 MVP 인풋 초안 작성 | `docs/plan/week-5.md` (신규) | [ ] |

> 산출물: 외부 접근 가능한 Vercel 스테이징 URL + 내부 피드백 수집 시작

---

## 1차 MVP 완료 기준

| 항목 | 확인 |
|---|---|
| PRD 1차 MVP 9개 화면 모두 동작 | [ ] |
| 핵심 루프 플로우 1-1, 1-2 완주 | [ ] |
| `pnpm build` 에러 없음 | [ ] |
| 모바일 375 기준 레이아웃 정상 | [ ] |
| 비로그인/로그인 분기 일관 동작 | [ ] |
| Vercel 스테이징 URL 접근 가능 | [ ] |

---

## 2차 MVP 시작점 (Week 5~ 인풋)

| 기능 | PRD 위치 |
|---|---|
| 상황 필터 (sceneTag aggregate) | - |
| 위치 인증 (Geolocation API) | 10장 |
| trustScore Decay 적용 | 2.6장 |
| 지도 핀 색상 차등 | 5.2장 |
| 도움됐어요 (커뮤니티 평판) | 2.5장 |
| AI 취향 요약 (Anthropic API) | 12.1장 |
| 뱃지 Lv.3~Lv.6 확장 | 3장 |
