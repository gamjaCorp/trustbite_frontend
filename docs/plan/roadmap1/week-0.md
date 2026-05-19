# Week 0 — 디자인 파운데이션 (5/8~5/11) ☑

## 이번 주 목표

W1 시작(5/12) 전에 **이미 정의된 디자인 시스템에 코드를 정렬**시킨다.

- `globals.css`의 시맨틱 타이포 유틸이 완비되어 있으나 사용 거의 0%. raw `text-*` 클래스 339회가 시스템을 우회.
- `common/` 컴포넌트들이 CLAUDE.md 컨벤션 미적용. 카드 11개가 8개 도메인에 흩어져 패딩/그림자/라운딩이 제각각.

이 주가 끝나면 **W1 신규 화면 4개가 통일된 토대 위에** 얹힌다.

---

## 일별 요약

| Day | 날짜 | 목표 | 주요 산출물 | 완료 |
|---|---|---|---|---|
| Thu | 5/8 | 라우트 재구조 + 타이포 시맨틱화 + 컬러 토큰 체크 | route rename + 타이포 시맨틱화 + arbitrary hex 0 (Google 로고 예외) | ☑ |
| Fri | 5/9 | `core/` 정착 + 카드 패턴 통일 + hex/shadow 토큰화 | `core/header.tsx` 등 단일 파일, import 7건, `restaurant-pin` Day 3 이월 | ☑ |
| Sat | 5/10 | 레퍼런스 화면 (홈 `/`) + `pnpm design:check` 자동화 | 표준 적용 페이지 1개, 위반 검출 그린 | ☑ |
| Sun | 5/11 | 버퍼 — 시각 보정 + W1 진입 준비 | `pnpm lint && npx tsc --noEmit && pnpm build` 그린 | ☑ |

---

## 타이포 시맨틱 매핑

| raw 조합 | 시맨틱 이름 | 사이즈 |
|---|---|---|
| `text-2xl font-bold` | `text-headline-1` | 24/32/600 |
| `text-xl font-bold` | `text-headline-2` | 20/28/600 |
| `text-lg font-semibold` | `text-headline-3` | 16/24/600 |
| `text-base font-semibold` | `text-title-1` | 16/24/600 |
| `text-sm font-semibold` | `text-title-2` | 14/20/600 |
| `text-sm font-medium` | `text-body-2` (강조 본문) | 14/20 |
| `text-base` | `text-body-1` | 16/24/400 |
| `text-sm` | `text-body-2` | 14/20/500 |
| `text-xs` 카드 본문/메타 | `text-body-2` (12→14 승격) | 14/20 |
| `text-xs` 타임스탬프/보조 | `text-caption-2` | 12/16/400 |
| `text-sm font-medium` (버튼) | `text-label-2` | 14/20/600 |
| `text-xs font-medium` (작은 라벨) | `text-label-3` | 12/16/500 |

> `text-xs`(12px)는 타임스탬프·인덱스 번호 등 진짜 보조 메타에만 남긴다. 카드 본문이 12px인 곳은 `text-body-2`(14px)로 승격.

---

## Day 1 (목) — 라우트 재구조 + 타이포 시맨틱 + 컬러 토큰 체크 ☑

**라우트 재구조화**

| 변경 전 | 변경 후 |
|---|---|
| `/me` | `/profile` |
| `/me/grade` | `/profile/grade` |
| `/my?tab=ranking\|wishlist` | `/my-places?tab=ranking\|wishlist` |

- `src/app/me/page.tsx` → `src/app/profile/page.tsx`
- `src/app/my/page.tsx` → `src/app/my-places/page.tsx`
- 링크/네비 전체 갱신 (`header.tsx`, `profile-summary-card.tsx` 등)

**타이포 시맨틱화**

- 프로젝트 전체 raw `text-{xs,sm,...} font-*` 조합 → 위 매핑표 기준 시맨틱 이름 치환
- 승격 대상: 카드 내 `text-xs` 본문 → `text-body-2`

**컬러 토큰 체크**

- arbitrary hex 전량 → `globals.css` `@theme inline` 토큰 클래스로 치환 (Google 로고 예외)
- `pnpm design:check` 스크립트 기반 위반 검출 그린

> **완료 (2026-05-08)** — 라우트 rename + 타이포 시맨틱화 + hex 위반 0건 달성.

---

## Day 2 (금) — `core/` 정착 + 카드 패턴 통일 + hex/shadow 토큰화 ☑

**`core/` 단일 파일 이전**

공통 컴포넌트를 `core/` 단일 `.tsx` 파일 형태로 정착:

- `core/header.tsx`
- `core/grade-badge.tsx`
- `core/grade-icon.tsx`
- `core/intro-card.tsx`
- `core/rank-card-skeleton.tsx`
- `core/trust-score-badge.tsx`
- `core/trust-score-sheet.tsx`

import 7건 갱신. `restaurant-pin.tsx` SVG hex는 Day 3(Sat)으로 이월.

**카드 패턴 통일**

- 공용 카드 베이스: `p-4`, `shadow-card`, `rounded-card` 일관 적용
- `features/*` 8개 도메인 카드 컨테이너 정합

> **완료 (2026-05-09)** — `core/` 단일 파일 이전 + import 갱신 + 카드 패턴 통일.

---

## Day 3 (토) — 레퍼런스 화면 (홈 `/`) + `pnpm design:check` ☑

**홈 `/` 레퍼런스 화면 정렬**

- 시맨틱 타이포/컬러 토큰/카드 톤 기준으로 홈 화면 전체 점검
- W1 신규 화면이 따라올 표준 기준 확립
- `restaurant-pin.tsx` SVG hex 처리 완료

**`pnpm design:check` 자동화**

- `.designcheckrc.json` include 영역 raw hex/rgb 검출 스크립트 추가
- `scripts/` 하위 설정 완료, 그린 달성

> **완료 (2026-05-10)** — 홈 화면 레퍼런스 완성, `pnpm design:check` 그린.

---

## Day 4 (일) — 버퍼 + W1 진입 준비 ☑

- 시각 보정 마무리
- `pnpm lint && npx tsc --noEmit && pnpm build` 그린 확인
- W1 Day 1 진입 준비 완료

> **완료 (2026-05-11)** — 빌드/타입/lint 그린.
