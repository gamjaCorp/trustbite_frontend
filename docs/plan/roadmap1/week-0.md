# Week 0 — 디자인 파운데이션 (5/8~5/11) [x]

## 이번 주 목표

W1 시작(5/12) 전에 **이미 정의된 디자인 시스템에 코드를 정렬**시킨다.

- `globals.css`의 시맨틱 타이포 유틸이 완비되어 있으나 사용 거의 0%. raw `text-*` 클래스 339회가 시스템을 우회.
- `common/` 컴포넌트들이 CLAUDE.md 컨벤션 미적용. 카드 11개가 8개 도메인에 흩어져 패딩/그림자/라운딩이 제각각.

이 주가 끝나면 **W1 신규 화면 4개가 통일된 토대 위에** 얹힌다.

---

## 일별 요약

| Day | 날짜 | 목표 | 주요 산출물 | 완료 |
|---|---|---|---|---|
| Thu | 5/8 | 라우트 재구조 + 타이포 시맨틱화 + 컬러 토큰 체크 | route rename + 타이포 시맨틱화 + arbitrary hex 0 (Google 로고 예외) | [x] |
| Fri | 5/9 | `core/` 정착 + 카드 패턴 통일 | `core/header.tsx` 등 단일 파일 7개 이전, import 갱신, 카드 패턴 통일 | [x] |
| Sat | 5/10 | 레퍼런스 화면 (홈 `/`) + `pnpm design:check` 자동화 | 홈 표준 적용, 위반 검출 그린 | [x] |
| Sun | 5/11 | 버퍼 — 시각 보정 + W1 진입 준비 | `pnpm lint && npx tsc --noEmit && pnpm build` 그린 | [x] |

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

## Day 1 (목 5/8) — 라우트 재구조 + 타이포 시맨틱 + 컬러 토큰 체크 [x]

W1 신규 화면이 올라설 표준 마련 — 라우트 정리, raw 타이포·hex 위반 일소.

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| 라우트 정리 | - `/me` → `/profile`, `/my` → `/my-places` 라우트 이동 및 헤더·카드 등 참조 경로 전체 갱신 | `src/app/me/` → `profile/`, `src/app/my/` → `my-places/`, `core/header.tsx` 등 | [x] |
| 타이포 토큰 | - raw `text-{xs,sm,...} font-*` 조합을 매핑표 기준 시맨틱 이름으로 전량 교체 | — | [x] |
|  | - 카드 내 `text-xs` 본문을 `text-body-2`(14px)로 승격 | — | [x] |
| 컬러 토큰 | - arbitrary hex를 `globals.css @theme inline` 토큰 클래스로 전량 교체 (Google 로고 예외) | — | [x] |
| 검증 | - `pnpm design:check` 실행 후 위반 0건 그린 달성 | — | [x] |

> **완료 (2026-05-08)** — 라우트 rename + 타이포 시맨틱화 + hex 위반 0건 달성.

> 산출물: 라우트 정돈 + hex 위반 0건 + `pnpm design:check` 그린

---

## Day 2 (금 5/9) — `core/` 정착 + 카드 패턴 통일 [x]

공통 컴포넌트 7개를 `core/` 단일 파일로 이전, 8개 도메인 카드 패딩·라운딩·그림자 통일.

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| core/ 이전 | - header, grade-badge, grade-icon, intro-card, rank-card-skeleton, trust-score-badge, trust-score-sheet `core/` 단일 파일 이전 및 import 7건 갱신 (`restaurant-pin` SVG hex는 Day 3 이월) | `src/components/core/` (7개 이동) | [x] |
| 카드 패턴 | - 공용 카드 베이스 `p-4` / `shadow-card` / `rounded-card` 일관 적용 | — | [x] |
|  | - `features/*` 8개 도메인 카드 컨테이너 패딩·라운딩·그림자 일관성 점검 및 수정 | — | [x] |

> **완료 (2026-05-09)** — `core/` 단일 파일 이전 + import 갱신 + 카드 패턴 통일.

> 산출물: `core/` 단일 파일 이전 완료 + 카드 패턴 통일

---

## Day 3 (토 5/10) — 레퍼런스 화면 (홈 `/`) + `pnpm design:check` [x]

홈 화면을 W1의 표준 레퍼런스로 정렬, 위반 자동 검출 스크립트 완비.

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| 홈 레퍼런스 | - 홈 화면 시맨틱 타이포·컬러 토큰·카드 톤 기준 전체 점검 및 W1 신규 화면 표준 확립 | `src/app/page.tsx` | [x] |
|  | - `restaurant-pin.tsx` SVG hex 처리 완료 (Day 2 이월) | `src/components/core/restaurant-pin.tsx` | [x] |
| design:check | - raw hex/rgb 검출 스크립트 추가 및 그린 달성 | `scripts/design-check.mjs`, `.designcheckrc.json` (신규) | [x] |

> **완료 (2026-05-10)** — 홈 화면 레퍼런스 완성, `pnpm design:check` 그린.

> 산출물: 홈 화면 레퍼런스 완성 + `pnpm design:check` 그린

---

## Day 4 (일 5/11) — 버퍼 + W1 진입 준비 [x]

W0 시각 보정 마무리 및 빌드·타입·lint 최종 확인.

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| 시각 보정 | - W0 시각 보정 마무리 | — | [x] |
| 검증 | - `pnpm lint && npx tsc --noEmit && pnpm build` 그린 확인 | — | [x] |
|  | - W1 Day 1 진입 준비 완료 | — | [x] |

> **완료 (2026-05-11)** — 빌드/타입/lint 그린.

> 산출물: 빌드/타입/lint 그린 + W1 진입 준비
