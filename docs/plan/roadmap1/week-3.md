# Week 3 — 백엔드 연동 + 9개 화면 데이터 레이어 일괄 적용 (5/25~5/31)

## 이번 주 목표

W2에서 시각 1차 MVP + 지도 통합 + Vercel Preview 배포가 완성된 상태. 이번 주는 **백엔드 API가 준비된 시점을 전제로, 인프라 그릇 → 인증 → 9개 화면 데이터 레이어**를 일괄 표준화한다.

W2에서 지도 통합(Kakao SDK + 시트 + 핀 + 영역 재검색)이 mock 위에서 완료됐으므로, 탐색 탭의 검색/필터 동작은 이번 주 Day 6에 real API 위에서 바로 연결한다.

이 주가 끝나면 `src/data/mock-*` 파일이 모두 사라지고, **1차 MVP 9개 화면이 실 백엔드 위에서 동작**한다.

---

## 일별 요약

| Day | 날짜 | 목표 | 주요 산출물 | 완료 |
|---|---|---|---|---|
| Mon | 5/25 | 인프라 그릇 다지기 | 타입 이동, `lib/axios.ts`, env 정리 | ☐ |
| Tue | 5/26 | 로그인 백엔드 통합 + RHF/zod 셋업 | `src/auth.ts` 확장, 온보딩 실 API, `form.tsx` 첫 적용 | ☐ |
| Wed | 5/27 | `/profile` + `/profile/grade` 데이터 레이어 | `useMyProfile`, `useGradeProgress`, mock 파일 삭제 | ☐ |
| Thu | 5/28 | `/restaurant/[id]` 마이그 | `useRestaurantDetail`, 비로그인 분기 정합 | ☐ |
| Fri | 5/29 | `/review/new` mutation + 인증 가드 + 에러 페이지 | `useSubmitReview`, middleware 매처, `not-found/error.tsx` | ☐ |
| Sat | 5/30 | `/my-places` 마이그 + 탐색 탭 검색/필터 동작 | `useMyRanking`, `useSearchRestaurants` (디바운스/URL) | ☐ |
| Sun | 5/31 | `/user/[id]` + Wishlist mutation + 코드 리뷰 | `useUserProfile`, `useToggleBookmark` (낙관적 업데이트) | ☐ |

---

## Day 1 (월 5/25) — 인프라 그릇 다지기 — ≈ 4h

**타입 이동**

- [ ] `src/types/restaurant.ts` → `src/lib/types/restaurant/type.ts`
- [ ] `src/types/user.ts` → `src/lib/types/user/type.ts`
- [ ] `src/types/review.ts` → `src/lib/types/review/type.ts`
- [ ] 프로젝트 내 `@/types/*` import 전체 수정

**axios 인프라**

- [ ] `src/lib/axios.ts` 신규
  - `baseURL`: `process.env.NEXT_PUBLIC_API_BASE_URL`
  - 요청 인터셉터: NextAuth session → `Authorization: Bearer` 헤더
  - 응답 인터셉터: 401 처리 + `sonner` 에러 toast

**env 정리**

- [ ] `.env.local` / Vercel Preview / Production env 확인
  - `NEXT_PUBLIC_API_BASE_URL` (이제 실제 값 입력)
  - `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
  - `NEXT_PUBLIC_KAKAO_MAP_KEY` (W2에서 이미 입력됐으면 점검만)

**점검**

- [ ] `pnpm lint && npx tsc --noEmit` 그린

> 산출물: 타입 경로 일관 + axios 인프라 그릇 완비

---

## Day 2 (화 5/26) — 로그인 백엔드 통합 + RHF/zod 셋업 — ≈ 6h

**RHF + zod 셋업 (≈ 1h)**

- [ ] `pnpm add react-hook-form zod @hookform/resolvers`
- [ ] `npx shadcn@latest add form` → `src/components/ui/form.tsx` 생성
- [ ] `src/lib/types/auth/schema.ts` — `onboardingSchema` (닉네임 2~16자, 지역 1개 이상, 한국어 에러 메시지)
- [ ] `/onboarding`에 첫 적용: `useForm({ resolver: zodResolver(onboardingSchema) })` + shadcn `<Form>`/`<FormField>`/`<FormMessage>`

**`src/auth.ts` 확장**

- [ ] `callbacks.signIn`: 백엔드 `POST /auth/login` 호출, 신규 사용자 → `needsOnboarding: true`
- [ ] `callbacks.jwt`: `userId`, `accessToken`, `needsOnboarding` 플래그 토큰에 저장
- [ ] `callbacks.session`: 토큰 → session에 `userId`, `accessToken`, `needsOnboarding` 노출

**로그인 진입점 통합**

- [ ] `src/app/login/page.tsx` — "Google로 계속하기" → `signIn('google', { callbackUrl: '/onboarding' })`
- [ ] `/signin/page.tsx` 로직 중복 정리

**`/onboarding` 백엔드 연결**

- [ ] `src/lib/types/auth/{request,response,type}.ts` — `OnboardingRequest`, `LoginResponse`
- [ ] `src/api/auth/auth.ts` — `loginWithProvider()`, `submitOnboarding()`
- [ ] `src/hooks/auth/use-onboarding.ts` — React Query mutation
- [ ] `handleSubmit(onValid)` → `POST /users/onboarding` → `/` 이동
- [ ] 이미 온보딩 완료 사용자 → `session.needsOnboarding` 체크 → `/` 리다이렉트
- [ ] 에러: `sonner` toast

**점검**

- [ ] 비로그인 → `/login` → Google → 신규 사용자 → `/onboarding` → 닉네임/지역 → `/`
- [ ] 기존 사용자 → `/login` → Google → 곧장 `/`
- [ ] `pnpm lint && npx tsc --noEmit` 그린

> 산출물: 인증 흐름이 실 백엔드 위에서 동작 + RHF/zod 첫 적용

---

## Day 3 (수 5/27) — `/profile` + `/profile/grade` 데이터 레이어 — ≈ 5h

두 화면 모두 `src/api/user/user.ts`/`src/hooks/user/`에 들어가는 짝이라 같은 날 처리한다.

**타입**

- [ ] `src/lib/types/user/response.ts` — `MyProfileResponse`, `GradeProgressResponse` 추가
- [ ] `src/lib/types/user/type.ts`의 `GradeLevel`/`GradeRequirement` 정리 확인

**API**

- [ ] `src/api/user/user.ts` — `getMyProfile()`, `getGradeProgress()` (axios)

**훅**

- [ ] `src/hooks/user/use-my-profile.ts` — `useMyProfile()` React Query
- [ ] `src/hooks/user/use-grade-progress.ts` — `useGradeProgress()`

**페이지**

- [ ] `src/app/profile/page.tsx` — `'use client'` + `useMyProfile()` + `useGradeProgress()`
- [ ] loading / error / 정상 분기 (Skeleton, Empty 활용)
- [ ] 로딩: 스켈레톤 (현재 등급 카드 + 타임라인)
- [ ] 에러: 에러 메시지 + 다시 시도 버튼

**정리**

- [ ] `src/data/mock-my-profile.ts` 흡수 후 삭제
- [ ] `src/data/mock-grade-progress.ts` (있다면) 흡수 후 삭제
- [ ] 브라우저 3상태 확인: 로딩 → 정상 → 에러 강제

> 산출물: `/profile`이 React Query로 동작. 폴더 구조가 다른 화면의 템플릿

---

## Day 4 (목 5/28) — `/restaurant/[id]` 마이그 — ≈ 5h

가장 복잡한 화면. 표준 7단계 적용.

**타입**

- [ ] `src/lib/types/restaurant/response.ts`에 `RestaurantDetailResponse` 추가

**API**

- [ ] `src/api/restaurant/restaurant.ts`에 `getRestaurantDetail(id: string)` 추가

**훅**

- [ ] `src/hooks/restaurant/use-restaurant-detail.ts`

**페이지**

- [ ] `src/app/restaurant/[id]/page.tsx` — `'use client'` + `useRestaurantDetail`
- [ ] 로딩: `PhotoGallery` + `ScorePanel` 스켈레톤
- [ ] 404: `notFound()` 호출

**비로그인 분기 정합**

- [ ] middleware/`auth()` 결과로 분기 일관화
- [ ] 미리보기 vs 전체 분기를 컴포넌트 prop으로 명시 (`isPreview: boolean`)

**정리**

- [ ] `src/data/mock-restaurant-detail.ts` 흡수 후 삭제

> 산출물: `/restaurant/[id]`가 React Query로 동작

---

## Day 5 (금 5/29) — `/review/new` mutation + 인증 가드 + 에러 페이지 — ≈ 6h

**타입**

- [ ] `src/lib/types/review/request.ts` — `CreateReviewRequest`
- [ ] `src/lib/types/review/response.ts` — `ReviewSubmitResult`

**API**

- [ ] `src/api/review/review.ts` 신규
  - `submitReview(data: CreateReviewRequest): Promise<ReviewSubmitResult>` (multipart 사진 포함)
  - `getReviewResult(reviewId: string): Promise<ReviewSubmitResult>`

**훅**

- [ ] `src/hooks/review/use-submit-review.ts` — mutation, 성공 시 `sonner` toast
- [ ] `src/hooks/review/use-review-result.ts` — `useReviewResult(reviewId)`

**폼 연결**

- [ ] `review-write-form.tsx` submit → `mutate(formData)` 호출 (W1의 직접 Dialog 오픈 교체)
- [ ] 제출 중 버튼 disabled + Spinner

**결과 Dialog 전환**

- [ ] `review-result-dialog.tsx` → `useReviewResult` 훅 사용으로 전환
- [ ] 로딩: 스켈레톤

**RHF + zod (review 폼)**

- [ ] `src/lib/types/review/schema.ts` — `reviewWriteSchema` (가게 선택 필수, 평점 1~5, 텍스트 100자 이상, 사진 0~5장, 한국어 에러 메시지)
- [ ] `RatingFields`, `ReviewTextField`, `PhotoUploadGrid`를 `Controller`로 RHF에 등록

**Middleware 통합 가드**

- [ ] `src/proxy.ts` 보호 경로 매처 추가
  - `/profile`, `/profile/*`, `/my-places`, `/review/*`
- [ ] 비로그인 진입 → `/login?next=<원래 경로>` 리다이렉트
- [ ] 로그인 후 `next` 쿼리로 원래 경로 복귀

**에러 페이지**

- [ ] `src/app/not-found.tsx` — 404 (TrustBite 톤)
- [ ] `src/app/error.tsx` — 전역 에러 + '다시 시도' 버튼
- [ ] `src/app/restaurant/[id]/error.tsx` — 맛집 상세 전용 에러
- [ ] React Query 글로벌 에러 핸들러 → `sonner` toast 표준화

**정리**

- [ ] `src/data/mock-review-result.ts` (있다면) 흡수 후 삭제

**점검**

- [ ] 비로그인 `/profile` 진입 → `/login?next=/profile` → 로그인 → `/profile` 자동 복귀
- [ ] 잘못된 ID `/restaurant/abc123` → 404 페이지
- [ ] `pnpm lint && npx tsc --noEmit` 그린

> 산출물: 폼 → mutation → 결과 흐름 정식화 + 인증 가드 + 에러 페이지

---

## Day 6 (토 5/30) — `/my-places` 마이그 + 탐색 탭 검색/필터 동작 — ≈ 6h

**`/my-places` 마이그**

- [ ] `src/lib/types/restaurant/response.ts`에 `MyRestaurantStats`, `MyRestaurantRankResponse` 추가
- [ ] `src/api/restaurant/my-ranking.ts` 신규 — `getMyRanking()`, `getMyStats()`
- [ ] `src/hooks/restaurant/use-my-ranking.ts`, `use-my-stats.ts`
- [ ] `src/app/my-places/page.tsx` — `'use client'` + 훅
- [ ] 로딩: 스탯 카드 + 리스트 스켈레톤 (W2 Day 2 `list-skeleton` 재사용)
- [ ] 빈 목록: '아직 리뷰한 맛집이 없어요'
- [ ] `src/data/mock-restaurant.ts`의 `mockStats5`, `mockRankList` → api로 흡수 후 삭제 확인

**탐색 탭 검색/필터 동작** (W2 Day 4·5에서 지도 UI 완성, 이제 real API 연결)

- [ ] `src/lib/types/restaurant/request.ts` — `SearchParams` (q, region, category[], context[], sort, page)
- [ ] `src/lib/types/restaurant/response.ts` — `RestaurantListResponse`
- [ ] `src/api/restaurant/restaurant.ts`에 `searchRestaurants(params: SearchParams)` 추가
- [ ] `src/hooks/restaurant/use-search-restaurants.ts`
  - 검색어 300ms 디바운스
  - URL 쿼리 동기화 (`?q=...&category=...&sort=...`)
  - 쿼리 변경 시 자동 재호출
- [ ] `search-bar` → 디바운스 → URL → 훅
- [ ] `region-filter`, `sort-filter`, `category-chips`, `context-chips` → URL 즉시 반영
- [ ] 결과 0개: `<Empty>`, 로딩: W2 Day 2 산출물 (`list-skeleton`) 또는 `<RankCardSkeleton>`
- [ ] "필터 초기화" 버튼

> 산출물: `/my-places` + 탐색 탭 검색/필터가 실 백엔드 위에서 동작

---

## Day 7 (일 5/31) — `/user/[id]` + Wishlist mutation + 코드 리뷰 — ≈ 4~5h

**`/user/[id]` 마이그**

- [ ] `src/lib/types/user/response.ts`에 `UserProfileResponse` 추가
- [ ] `src/api/user/user.ts`에 `getUserProfile(id: string)` 추가
- [ ] `src/hooks/user/use-user-profile.ts`
- [ ] `src/app/user/[id]/page.tsx` — `'use client'` 전환
- [ ] `src/data/mock-other-user.ts` 흡수 후 삭제

**Wishlist mutation 낙관적 업데이트**

- [ ] `src/lib/types/wishlist/type.ts` — `WishlistItem`
- [ ] `src/api/wishlist/wishlist.ts` — `getWishlist()`, `addBookmark(id)`, `removeBookmark(id)`
- [ ] `src/hooks/wishlist/use-wishlist.ts`
- [ ] `src/hooks/wishlist/use-toggle-bookmark.ts` — `useMutation` + `onMutate` 낙관적 업데이트 + 실패 시 롤백
- [ ] `wishlist-section.tsx`의 mock 토글 → `useToggleBookmark` 호출
- [ ] `/restaurant/[id]` 헤더 북마크 → `useToggleBookmark` 호출

**최종 mock-* 정리**

- [ ] `src/data/mock-*` 파일 0개 확인 (남은 파일 전량 흡수)
- [ ] `src/stores/auth-mock-store.tsx`, `wishlist-mock-store.tsx` 정리 여부 검토
- [ ] `pnpm lint && npx tsc --noEmit && pnpm build` 그린

**코드 리뷰 punch list 수집**

- [ ] `frontend-code-reviewer` 에이전트 1바퀴 — 컨벤션 위반 punch list 수집 (fix는 W4 Day 1)

> 산출물: 1차 MVP 9개 화면이 실 백엔드 API 위에서 동작. W4 진입 준비.

---

> **참고**: 지도 시트 통합(Kakao SDK + vaul + 핀 + 영역 재검색)은 W2 Day 4·5에서 완료됨. 이번 주 별도 지도 작업 없음.

---

## 재사용 점검

| 필요한 것 | 사용 |
|---|---|
| 데이터 페칭 | `@tanstack/react-query` (Providers 설정됨) |
| toast | `sonner` (설치됨) |
| 미들웨어 인증 | NextAuth `auth()` (`src/auth.ts`) |
| 로딩 스켈레톤 | W2 Day 2 산출물 (`common/list-skeleton.tsx`) + `ui/skeleton.tsx` |
| 빈 상태 | W2 Day 2 산출물 (`common/empty-list.tsx`) + `ui/empty.tsx` |
| 폼 | `src/components/ui/form.tsx` (shadcn, Day 2에서 설치) |
| 카드 셸 | W2 Day 2 산출물 `src/components/core/place-card.tsx` |
| URL 쿼리 동기화 | `next/navigation` `useSearchParams`, `useRouter` |
| 디바운스 | `useDeferredValue` (React 19) 또는 직접 구현 |
| 낙관적 업데이트 | `@tanstack/react-query` `useMutation` `onMutate` |
