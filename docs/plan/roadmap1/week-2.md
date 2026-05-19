# Week 2 — 인프라 + 핵심 화면 데이터 레이어 표준화 (5/19~5/23)

## 이번 주 목표

W1에서 시각적 1차 MVP가 완성된 상태. 이번 주는 **로그인 백엔드 통합 + 데이터 레이어 표준 사례 수립**에 집중한다.

타입/인프라 정리 → 로그인 실 연결 → 핵심 화면 3개(`/profile`, `/profile/grade`, 리뷰 결과)를 **표준 절차로 표준화**해서 W3 화면들이 따라올 레퍼런스를 만든다.

---

## 일별 요약

| Day | 날짜 | 목표 | 주요 산출물 | 완료 |
|---|---|---|---|---|
| Mon | 5/19 | 인프라 그릇 다지기 | 타입 이동, `lib/axios.ts` (인증 인터셉터), env 정리 | ☐ |
| Tue | 5/20 | 로그인 백엔드 통합 + RHF/zod 셋업 | `src/auth.ts` 확장, 로그인/온보딩 실 API, `form.tsx` 첫 적용 | ☐ |
| Wed | 5/21 | `/profile` 데이터 레이어 표준화 | `api/user`, `hooks/user/use-my-profile`, 페이지 React Query 전환 | ☐ |
| Thu | 5/22 | `/profile/grade` 데이터 레이어 | `useGradeProgress`, `getGradeProgress` 정식화 | ☐ |
| Fri | 5/23 | 리뷰 결과 + 인증 가드 + 에러 페이지 | `useSubmitReview` mutation, middleware 매처, `not-found/error.tsx` | ☐ |

---

## Day 1 (월 5/19) — 인프라 그릇 다지기 — ≈ 4h

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

- [ ] `.env.local` / Vercel Preview / Production env 분리
  - `NEXT_PUBLIC_API_BASE_URL`
  - `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
  - `NEXT_PUBLIC_KAKAO_MAP_KEY`

**점검**

- [ ] `pnpm lint && npx tsc --noEmit` 그린

> 산출물: 타입 경로 일관 + axios 인프라 그릇 완비

---

## Day 2 (화 5/20) — 로그인 백엔드 통합 + RHF/zod 셋업 — ≈ 6h

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

## Day 3 (수 5/21) — `/profile` 데이터 레이어 표준화 — ≈ 4~5h

표준 7단계를 `/profile`에 적용해 **다른 화면이 따라할 레퍼런스 1개** 완성.

**타입**

- [ ] `src/lib/types/user/response.ts` — `MyProfileResponse`

**API**

- [ ] `src/api/user/user.ts` — `getMyProfile(): Promise<MyProfileResponse>` (axios)

**훅**

- [ ] `src/hooks/user/use-my-profile.ts` — `useMyProfile()` React Query

**페이지**

- [ ] `src/app/profile/page.tsx` — `'use client'` + `useMyProfile()`
- [ ] `MyProfileView`에 loading / error / 정상 분기 (Skeleton, Empty 활용)

**정리**

- [ ] `src/data/mock-my-profile.ts` — mock 데이터를 `src/api/user/user.ts`로 이동 후 파일 삭제
- [ ] 브라우저 3상태 확인: 로딩 → 정상 → `Promise.reject`로 에러 강제

> 산출물: `/profile`이 React Query로 동작. 폴더 구조가 다른 화면의 템플릿

---

## Day 4 (목 5/22) — `/profile/grade` 데이터 레이어 — ≈ 4h

W1 Day 2에서 만든 등급 안내(`GradeGuideCard`)를 표준 절차로 정착.

**타입**

- [ ] `src/lib/types/user/response.ts`에 `GradeProgressResponse` 추가
- [ ] `src/lib/types/user/type.ts`의 `GradeLevel`/`GradeRequirement` 정리 확인

**API**

- [ ] `src/api/user/user.ts`에 `getGradeProgress(): Promise<GradeProgressResponse>` 추가

**훅**

- [ ] `src/hooks/user/use-grade-progress.ts` — `useGradeProgress()`

**페이지**

- [ ] `src/app/profile/page.tsx` 내 `GradeGuideCard` → `useGradeProgress` 훅 사용으로 전환
- [ ] 로딩: 스켈레톤 (현재 등급 카드 + 타임라인)
- [ ] 에러: 에러 메시지 + 다시 시도 버튼

**정리**

- [ ] `src/data/mock-grade-progress.ts` (있다면) 흡수 후 삭제

> 산출물: `/profile`의 등급 안내가 React Query로 동작

---

## Day 5 (금 5/23) — 리뷰 결과 + 인증 가드 + 에러 페이지 — ≈ 6h

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

**정리**

- [ ] `src/data/mock-review-result.ts` (있다면) 흡수 후 삭제

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

**점검**

- [ ] 비로그인 `/profile` 진입 → `/login?next=/profile` → 로그인 → `/profile` 자동 복귀
- [ ] 잘못된 ID `/restaurant/abc123` → 404 페이지
- [ ] `pnpm lint && npx tsc --noEmit` 그린

> 산출물: 폼 → mutation → 결과 흐름 정식화 + 인증 가드 + 에러 페이지

---

## 재사용 점검

| 필요한 것 | 사용 |
|---|---|
| 데이터 페칭 | `@tanstack/react-query` (Providers 설정됨) |
| toast | `sonner` (설치됨) |
| 미들웨어 인증 | NextAuth `auth()` (`src/auth.ts`) |
| 로딩 스켈레톤 | `src/components/ui/skeleton.tsx` |
| 빈 상태 | `src/components/ui/empty.tsx` |
| 폼 | `src/components/ui/form.tsx` (shadcn) |
