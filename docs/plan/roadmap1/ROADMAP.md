# TrustBite 1차 MVP — 로드맵

> **원칙: 디자인 토대 → 보이는 것 채우기 → 백엔드 없이 완성 가능한 것 → 실 API 정착 → 배포**  
> W0(5/8~5/11)에 디자인 시스템 정렬. W1에서 시각적 MVP 완성.  
> W2에서 리팩토링·지도·배포. W3에서 백엔드 없이 할 수 있는 것 마무리.  
> W4는 백엔드 준비 후 mock→실 API 전환 + 최종 QA·배포.

---

## 완료 기준

| 영역 | 목표 상태 |
|---|---|
| PRD 1차 MVP 9개 화면 | 모두 실 백엔드 위에서 동작 |
| 핵심 루프 | 탐색 → 상세 → 리뷰 → 신뢰도 결과 → 등급 안내 → `/profile` 완주 |
| 탐색 탭 | 검색·지역·정렬·카테고리·상황 필터 + Kakao 지도 시트 드래그 |
| 데이터 레이어 | 모든 화면이 `api/` + `hooks/` + `lib/types/` 위에서 동작 |
| 인증/가드 | middleware 통합 리다이렉트, `not-found.tsx` / `error.tsx` |
| 배포 | Vercel 스테이징 URL, 내부 테스터 3~5명 피드백 |

---

## 1차 MVP 9개 화면 현재 상태 (2026-05-27 기준)

| # | 화면 | 라우트 | 현재 상태 | 마이그 예정 |
|---|---|---|---|---|
| 1 | 홈(탐색) | `/` | UI [x], 지도 [x] (react-kakao-maps-sdk), 검색 임시 어댑터, 필터 UI만 | W4 |
| 2 | 맛집 상세 — 미리보기 | `/restaurant/[id]` (비로그인) | 비로그인 분기 [x] (mock) | W4 |
| 3 | 맛집 상세 — 전체 | `/restaurant/[id]` (로그인) | 컴포넌트 [x] (mock) | W4 |
| 4 | 로그인 + 온보딩 | `/signin`, `/onboarding` | UI [x] (auth-mock-store) | W3(세션 연결) / W4(백엔드) |
| 5 | 리뷰 작성 | `/review/new` | 컴포넌트 [x] (mock, RHF/zod 미적용) | W3 폼 검증, W4 mutation |
| 6 | 내 프로필 | `/profile` | UI [x] (mock) | W4 |
| 7 | 타 유저 프로필 | `/user/[id]` | UI [x] (mock) | W4 |
| 8 | 등급 안내 | `/profile` 내 `GradeGuideCard` | 인라인 [x] (mock) | W4 |
| 9 | 리뷰 제출 결과 | `review-result-dialog` (Dialog) | Dialog [x] (mock) | W4 |

---

## 라우트 맵

### 공개 (비로그인 접근 가능)

| 라우트 | 설명 |
|---|---|
| `/` | 홈 — 탐색(검색/지도/랭킹) |
| `/restaurant/[id]` | 맛집 상세 — 비로그인은 미리보기(리뷰 2~3개 + 로그인 CTA) |
| `/user/[id]` | 타 유저 프로필 — 잠금 화면 |

### 인증

| 라우트 | 설명 |
|---|---|
| `/signin?next=<원래 경로>` | 로그인 진입점 (구글 OAuth, NextAuth) |
| `/signin` | NextAuth 콜백/대체 로그인 |
| `/onboarding` | 닉네임/지역 입력 (최초 로그인 후) |

### 보호 (middleware 가드 — 비로그인 → `/signin?next=` 리다이렉트)

| 라우트 | 설명 |
|---|---|
| `/profile` | 내 프로필 |
| `/my-places?tab=ranking\|wishlist` | 내 맛집 지도 |
| `/review/new` | 리뷰 작성 폼 |
| `/review/new/result` | 리뷰 제출 결과 |
| `/restaurant/[id]/review/new` | 상세 진입 리뷰 작성 |

### 에러

| 라우트 | 설명 |
|---|---|
| `src/app/not-found.tsx` | 404 전역 |
| `src/app/error.tsx` | 런타임 에러 전역 |
| `src/app/restaurant/[id]/error.tsx` | 맛집 상세 전용 에러 |

---

## 미들웨어 가드

`src/proxy.ts`에서 비로그인 진입 시 `/signin?next=<원래 경로>` 리다이렉트:

```
/profile  /profile/*  /my-places  /review/*
```

---

## 화면 마이그레이션 표준 7단계 (W4에서 적용)

화면 단위로 반복. **W4 Day 2 `/profile`이 첫 레퍼런스**.

1. **백엔드 endpoint 확인** — 스펙·응답 스키마·에러 코드
2. **타입 분할** — `src/lib/types/<feature>/{type,response,request}.ts`
3. **API 함수** — 공개 읽기=`publicFetch`(`next:{tags,revalidate}`), 개인 읽기=`authedFetch`(`no-store`), 뮤테이션=Server Action(`revalidateTag`), 클라 인터랙션=`clientFetch`
4. **페이지 전환** — 읽기 페이지는 **Server Component** + Suspense(loading.tsx) / `notFound()` / `error.tsx`. 클라 인터랙션만 React Query 훅
5. **뮤테이션** — Server Action + 성공 후 `revalidateTag`. 클라 낙관적 토글(wishlist·follow)은 React Query `useMutation` + clientFetch
6. **의존성 정리** — mock 파일 삭제, common/core 경로 정합 확인
7. **체크** — `pnpm lint && npx tsc --noEmit`, 브라우저 3상태 확인

---

## 주차별 요약

| 주차 | 날짜 | 목표 | 완료 |
|---|---|---|---|
| [W0](./week-0.md) | 5/8~5/11 | 디자인 파운데이션 (라우트 재구조, 타이포 시맨틱화, hex 토큰화) | [x] |
| [W1](./week-1.md) | 5/12~5/17 | 프로토타입 시각적 1차 MVP (누락 화면 4개 + wishlist + 카드 재점검) | [x] |
| [W2](./week-2.md) | 5/18~5/24 | 디자인 점검 + 공통 컴포넌트 리팩토링 + Vercel 배포 + Kakao 지도 통합 | [x] |
| [W3](./week-3.md) | 5/25~ | 백엔드 없이 할 수 있는 일 (지도 UX, 인프라 스캐폴딩, 폼 검증, 반응형, 품질 정리) | [ ] |
| [W4](./week-4.md) | 백엔드 준비 후 | 백엔드 연동 + 최종 QA + 스테이징 배포 | [ ] |

---

## 검증 게이트

| 시점 | 항목 |
|---|---|
| Day 끝마다 | `pnpm lint && npx tsc --noEmit` |
| 주 끝마다 | `pnpm build` 그린 + 핵심 동선 5분 워크 |
| W3 Day 7 | `any`/`console.log` 0건, `pnpm build` 그린, 반응형 375/768/1280 정상 |
| W4 Day 6 | `src/data/mock-*` 0개 확인 (최종 게이트) |
| W4 Day 7 | PRD 16 플로우 1-1·1-2·1-3 통합 QA + Vercel 스테이징 URL 외부 접근 가능 |
