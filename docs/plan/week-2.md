# Week 2 — 인프라 + 핵심 화면 데이터 레이어 표준화

## 이번 주 목표

Week 1에서 시각적 1차 MVP가 완성된 상태.  
이번 주는 **컨벤션 정리 + 데이터 레이어 표준 사례 수립**에 집중한다.

`common/` → `core/` 마이그레이션, 타입/인프라 정리, 그리고 Week 1에서 만든 핵심 신규 화면 3개(`/profile`, `/profile/grade`, `/review/new/result`)를 표준 절차로 리팩토링해서 **다른 화면이 따라할 레퍼런스**로 삼는다.

---

## 일별 요약

| Day | 날짜 | 목표                                    | 주요 산출물                                                | 완료 |
| --- | ---- | --------------------------------------- | ---------------------------------------------------------- | ---- |
| Mon | 5/19 | 기반 다지기 (구조 + 인프라)             | `core/` 마이그, `lib/axios` (인증 인터셉터), `lib/types` 구조 | ☐    |
| Tue | 5/20 | `/profile` 데이터 레이어 표준화         | `api/user`, `hooks/user/use-my-profile`, 페이지 리팩토링   | ☐    |
| Wed | 5/21 | `/profile/grade` 데이터 레이어          | `useGradeProgress`, `getGradeProgress` 정식화              | ☐    |
| Thu | 5/22 | `/review/new/result` + submit mutation | `useSubmitReview` mutation, 결과 화면 정합                 | ☐    |
| Fri | 5/23 | 인증 가드 통합 + 에러 페이지            | middleware 가드, `not-found.tsx`, `error.tsx`              | ☐    |

---

## 프로토타입 → 내 코드 표준 절차 (모든 화면 공통)

화면 단위로 이 7단계를 반복. **Day 2의 `/profile`이 첫 레퍼런스**, 이후 주차는 동일 폴더 구조 복제.

1. **백엔드 endpoint 확인** — 스펙/응답 스키마/에러 코드
2. **타입 분할** — `src/lib/types/<feature>/{type,response,request}.ts`로 분할
3. **API 함수 생성** — `src/api/<feature>/<feature>.ts`에 `getX()` (axios 호출)
4. **React Query 훅** — `src/hooks/<feature>/use-<x>.ts`
5. **페이지 전환** — `'use client'` + 훅 사용. Skeleton / Empty / Error 상태
6. **`common/` 의존성 정리** — `core/<kebab>/index.tsx`로 이동
7. **체크** — `pnpm lint`, `npx tsc --noEmit`, 브라우저에서 실 데이터 동작 확인

> **예외 — 백엔드 endpoint 미준비**: 내부에 임시로 `sleep + 하드코딩 데이터`를 두되 응답 타입은 실 스키마와 동일. 준비되는 대로 함수 본체만 axios로 교체.

---

## Day 1 (월) — 기반 다지기 — ≈ 5~6h

목표: 컨벤션 드리프트 + 인프라 공백 한 번에 정리.

**`common/` → `core/` 마이그레이션**

- [ ] `Header.tsx` → `src/components/core/header/index.tsx` (PascalCase 동시 수정)
- [ ] `grade-badge.tsx` → `src/components/core/grade-badge/index.tsx`
- [ ] `intro-card.tsx` → `src/components/core/intro-card/index.tsx`
- [ ] `rank-card-skeleton.tsx` → `src/components/core/rank-card-skeleton/index.tsx`
- [ ] `trust-score-badge.tsx` → `src/components/core/trust-score-badge/index.tsx`
- [ ] `trust-score-sheet.tsx` → `src/components/core/trust-score-sheet/index.tsx`
- [ ] 프로젝트 내 `@/components/common/*` import 일괄 수정
- [ ] 빈 `src/components/common/` 디렉터리 삭제

**타입 이동**

- [ ] `src/types/restaurant.ts` → `src/lib/types/restaurant/type.ts`
- [ ] `src/types/user.ts` → `src/lib/types/user/type.ts`
- [ ] `src/types/review.ts` (Week 1에 추가됨) → `src/lib/types/review/type.ts`
- [ ] 프로젝트 내 `@/types/*` import 일괄 수정

**인프라 신규**

- [ ] `src/lib/axios.ts` — baseURL `process.env.NEXT_PUBLIC_API_BASE_URL`, 요청 인터셉터(NextAuth session → Authorization 헤더), 응답 인터셉터(401 처리 + sonner 에러 토스트)
- [ ] `.env.local` / Vercel Preview / Production env 분리

**마무리**

- [ ] `pnpm lint && npx tsc --noEmit` 그린

> 산출물: 새 CLAUDE.md 규약과 일치한 구조 + 데이터 레이어 그릇

---

## Day 2 (화) — `/profile` 데이터 레이어 첫 표준화 — ≈ 4~5h

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

- [ ] `src/data/mock-my-profile.ts`의 mock 데이터를 `src/api/user/user.ts` 안으로 이동 후 파일 삭제
- [ ] 브라우저 3상태 직접 확인 (로딩 → 정상 → `Promise.reject`로 에러 강제)

> 산출물: `/profile`이 React Query로 동작. 폴더 구조가 다른 화면의 템플릿

---

## Day 3 (수) — `/profile/grade` 데이터 레이어 — ≈ 4h

Week 1 Day 2에서 만든 등급 안내 화면을 표준 절차로 정착.

**타입**

- [ ] `src/lib/types/user/response.ts`에 `GradeProgressResponse` 추가
- [ ] `src/lib/types/user/type.ts`의 `GradeLevel`/`GradeRequirement` 정리 확인

**API**

- [ ] `src/api/user/user.ts`에 `getGradeProgress()` 추가

**훅**

- [ ] `src/hooks/user/use-grade-progress.ts` — `useGradeProgress()`

**페이지**

- [ ] `src/app/profile/grade/page.tsx` client 전환 + 훅 사용
- [ ] 로딩: 스켈레톤 (현재 등급 카드 + 타임라인)
- [ ] 에러: 에러 메시지 + 다시 시도 버튼

**정리**

- [ ] `src/data/mock-grade-progress.ts` (Week 1 추가분) 흡수 후 삭제

> 산출물: `/profile/grade`가 React Query로 동작

---

## Day 4 (목) — `/review/new/result` + submit mutation — ≈ 5~6h

Week 1에서 라우팅으로 연결만 해둔 결과 화면을 데이터 레이어 위에 올리고, 리뷰 제출도 정식 mutation으로 전환.

**타입**

- [ ] `src/lib/types/review/request.ts` — `CreateReviewRequest`
- [ ] `src/lib/types/review/response.ts` — `ReviewSubmitResult`

**API**

- [ ] `src/api/review/review.ts` 신규 — `submitReview(data: CreateReviewRequest): Promise<ReviewSubmitResult>` (axios, multipart 사진 업로드 포함)
- [ ] `src/api/review/review.ts`에 `getReviewResult(reviewId)` 추가 (결과 화면 새로고침 대응)

**훅**

- [ ] `src/hooks/review/use-submit-review.ts` — `useSubmitReview()` mutation
  - 성공: `/review/new/result?reviewId=...` 라우팅
  - 실패: `sonner` toast
- [ ] `src/hooks/review/use-review-result.ts` — `useReviewResult(reviewId)`

**폼 연결**

- [ ] `review-write-form.tsx` submit → `mutate(formData)` 호출로 교체 (Week 1의 직접 navigate 제거)
- [ ] 제출 중 버튼 disabled + 스피너

**결과 페이지**

- [ ] `src/app/review/new/result/page.tsx` client 전환 + `useReviewResult` 사용
- [ ] 로딩: 스켈레톤

**정리**

- [ ] Week 1의 `src/data/mock-review-result.ts` 흡수 후 삭제

> 산출물: 폼 → mutation → 결과 화면 흐름 정식화

---

## Day 5 (금) — 인증 가드 통합 + 에러 페이지 — ≈ 5h

지금까지 페이지별로 분산되어 있던 가드를 middleware로 통합 + 일관된 에러 화면.

**Middleware 통합 가드**

- [ ] `src/proxy.ts`에서 보호 경로 패턴 매칭
  - `/profile`, `/profile/*`, `/my-places`, `/review/*`
- [ ] 비로그인 진입 시 `/login?next=<원래 경로>` 리다이렉트
- [ ] 로그인 후 `next` 쿼리로 원래 경로 복귀
- [ ] 페이지 단위에 흩어진 `auth()` 호출 제거 (middleware로 통합)

**에러 페이지**

- [ ] `src/app/not-found.tsx` — 404 (TrustBite 톤)
- [ ] `src/app/error.tsx` — 전역 에러 + '다시 시도' 버튼
- [ ] `/restaurant/[id]/error.tsx` 추가
- [ ] React Query 글로벌 에러 핸들러 → `sonner` toast 표준화

**점검**

- [ ] 동선: 비로그인 `/profile` 진입 → `/login?next=/profile` → 로그인 → `/profile` 자동 복귀
- [ ] 잘못된 ID로 `/restaurant/abc123` → 404 페이지

> 산출물: 인증/에러가 빈틈없이 일관되게 동작

---

## 다음 주 punch list (→ Week 3)

- 탐색 탭 검색/필터를 실 백엔드 API에 연결 (Week 1 UI에 동작 부착)
- Kakao Maps SDK 지도 시트 통합
- `/restaurant/[id]`, `/review/new`(form 부분), `/my-places`, `/user/[id]` 데이터 레이어 마이그
- Wishlist mutation (낙관적 업데이트)

---

## 재사용 우선 점검

| 필요한 것                      | 사용할 컴포넌트/패키지                              |
| ------------------------------ | --------------------------------------------------- |
| 데이터 페칭                    | `@tanstack/react-query` (이미 Providers 설정됨)     |
| 토스트                         | `sonner` (이미 설치)                                |
| 미들웨어 인증                  | NextAuth `auth()` (`src/auth.ts`)                   |
| 로딩 스켈레톤                  | `src/components/ui/skeleton.tsx`                    |
| 빈 상태                        | `src/components/ui/empty.tsx`                       |
