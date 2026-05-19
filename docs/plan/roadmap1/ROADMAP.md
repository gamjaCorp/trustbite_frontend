# TrustBite 1차 MVP — 4주 로드맵

> **원칙: 디자인 토대 → 보이는 것 채우기 → 실 API 정착 → 품질·배포**  
> W0(5/8~5/11)에 디자인 시스템을 코드에 정렬. W1에서 누락 화면을 채워 시각적 MVP 완성.  
> 데이터 레이어 표준화는 W2 이후.

---

## 4주 후 도달 상태

| 영역 | 목표 상태 |
|---|---|
| PRD 1차 MVP 9개 화면 | 모두 실 백엔드 위에서 동작 |
| 핵심 루프 | 탐색 → 상세 → 리뷰 → 신뢰도 결과 → 등급 안내 → `/profile` 완주 |
| 탐색 탭 | 검색·지역·정렬·카테고리·상황 필터 + 카카오 지도 시트 드래그 |
| 데이터 레이어 | 모든 화면이 `api/` + `hooks/` + `lib/types/` 위에서 동작 |
| 인증/가드 | middleware 통합 리다이렉트, `not-found.tsx` / `error.tsx` |
| 배포 | Vercel 스테이징 URL, 내부 테스터 3~5명 피드백 |

---

## 1차 MVP 9개 화면 (2026-05-19 기준)

| # | 화면 | 라우트 | 현재 상태 | 주차 |
|---|---|---|---|---|
| 1 | 홈(탐색) | `/` | UI ☑, 검색·필터·지도 미동작 | W3 |
| 2 | 맛집 상세 — 미리보기 | `/restaurant/[id]` (비로그인) | 비로그인 분기 ☑ (mock) | W3 |
| 3 | 맛집 상세 — 전체 | `/restaurant/[id]` (로그인) | 컴포넌트 ☑ (mock) | W3 |
| 4 | 로그인 + 온보딩 | `/login`, `/onboarding` | 있음 (mock) | W2 |
| 5 | 새 맛집 추가 | `/review/new` | 컴포넌트 ☑ (mock) | W3 |
| 6 | 내 프로필 | `/profile` | 있음 (mock) | W2 |
| 7 | 타 유저 프로필 | `/user/[id]` | 있음 (mock) | W3 |
| 8 | 등급 안내 | `/profile` 내 `GradeGuideCard` | 인라인 ☑ (mock) | W2 |
| 9 | 리뷰 제출 결과 | `review-result-dialog` (Dialog) | Dialog ☑ (mock) | W2 |

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
| `/login?next=<원래 경로>` | 로그인 진입점 (구글 OAuth) |
| `/signin` | NextAuth 콜백/대체 로그인 |
| `/onboarding` | 닉네임/지역 입력 (최초 로그인 후) |

### 보호 (middleware 가드 — 비로그인 → `/login?next=` 리다이렉트)

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

`src/proxy.ts`에서 비로그인 진입 시 `/login?next=<원래 경로>` 리다이렉트:

```
/profile  /profile/*  /my-places  /review/*
```

---

## 프로토타입 → 표준 절차 7단계 (W2~)

화면 단위로 반복. **W2 Day 3 `/profile`이 첫 레퍼런스**.

1. **백엔드 endpoint 확인** — 스펙·응답 스키마·에러 코드
2. **타입 분할** — `src/lib/types/<feature>/{type,response,request}.ts`
3. **API 함수** — `src/api/<feature>/<feature>.ts` (axios)
4. **React Query 훅** — `src/hooks/<feature>/use-<x>.ts`
5. **페이지 전환** — `'use client'` + 훅. Skeleton / Empty / Error 상태
6. **의존성 정리** — common/core 경로 정합 확인
7. **체크** — `pnpm lint && npx tsc --noEmit`, 브라우저 3상태 확인

> **백엔드 미준비 시**: `sleep + 하드코딩` 임시 처리, 응답 타입은 실 스키마와 동일.

---

## 주차별 요약

| 주차 | 날짜 | 목표 | 완료 |
|---|---|---|---|
| [W0](./week-0.md) | 5/8~5/11 | 디자인 파운데이션 (라우트 재구조, 타이포 시맨틱화, hex 토큰화) | ☑ |
| [W1](./week-1.md) | 5/12~5/17 | 프로토타입 시각적 1차 MVP (누락 화면 4개 + wishlist + 카드 재점검) | ☑ |
| [W2](./week-2.md) | 5/19~5/23 | 인프라 + 핵심 화면 데이터 레이어 (axios, RHF/zod, `/profile`·등급·리뷰결과 React Query화, 가드·에러) | ☐ |
| [W3](./week-3.md) | 5/26~5/30 | 나머지 마이그 + 탐색 탭 + Kakao 지도 (화면 4개 마이그, mock-* 전량 삭제) | ☐ |
| [W4](./week-4.md) | 6/2~6/6 | 품질 + 스테이징 배포 (디자인 cross-check, 반응형, 통합 QA, Vercel) | ☐ |

---

## 검증 게이트

| 시점 | 항목 |
|---|---|
| Day 끝마다 | `pnpm lint && npx tsc --noEmit` |
| 주 끝마다 | `pnpm build` 그린 + 핵심 동선 5분 워크 |
| W3 Day 5 | `src/data/mock-*` 0개 확인 |
| W4 Day 4 | PRD 16 플로우 1-1·1-2·1-3 통합 QA (최종 게이트) |
| W4 Day 5 | Vercel 스테이징 URL 외부 접근 가능 |
