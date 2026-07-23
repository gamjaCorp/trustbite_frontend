# Week 2 — 디자인 점검 + 리팩토링 + 배포 + 지도 통합 (5/18~5/24) [x]

## 이번 주 목표

W1에서 시각적 1차 MVP가 완성된 상태. 백엔드가 아직 준비되지 않아 데이터 레이어 작업은 W4로 미룬다.

본 주는 **3개 핵심 화면 디자인 점검 → 공통 컴포넌트 리팩토링 → Vercel Preview 배포 → 지도 통합(mock 위에서)** 순서로 진행한다.

---

## 일별 요약

| Day | 날짜 | 목표 | 주요 산출물 | 완료 |
|---|---|---|---|---|
| Mon | 5/18 | 3개 화면 디자인 점검 | 화면별 이슈 체크리스트 + 리팩토링 후보 목록 | [x] |
| Tue | 5/19 | 공통 컴포넌트 리팩토링 | 카드 셸·배지·로딩·빈 상태 통합, 리뷰 결과 카드 모듈화 | [x] |
| Wed | 5/20 | Vercel Preview 배포 | Preview URL + 9개 화면 동선 QA | [x] |
| Thu | 5/21 | Kakao Maps SDK 통합 (지도 + 핀) | `react-kakao-maps-sdk` + `useKakaoLoader`로 지도 임베드, mock 핀 렌더 | [x] |
| Fri | 5/22 | 영역 재검색 구현 | `search-this-area` [x] | [x] |
| Sat | 5/23 | Storybook 보강 + 회귀 점검 | 신규 컴포넌트 story 23개, 다크모드 패스 | [x] |
| Sun | 5/24 | `frontend-code-reviewer` 1바퀴 + 폴리시 | punch list 반영, 빌드 최종 그린 | [x] |

---

## Day 1 (월 5/18) — 3개 화면 디자인 점검 [x]

점검 전 `ui-ux-expert` 스킬 호출 후 시작. 리팩토링 후보 패턴을 목록화해 Day 2 범위를 확정한다.

**점검 대상**

| 화면 | 주요 컴포넌트 |
|---|---|
| `/my-places` | `my-places-tabs`, `my-restaurant-summary-card`, `restaurant-rank-list`, `my-restaurant-card`, `wishlist-section`, `wishlist-item-card`, `taste-profile-section` |
| `/review/new` | `review-write-form`, `restaurant-picker`, `target-restaurant-card`, `location-verify-banner`, `star-rating-input`, `rating-fields`, `scene-tag-selector`, `review-text-field`, `photo-upload-grid`, `trust-delta-card`, `ranking-preview`, `preview-sidebar` |
| `/restaurant/[id]` 리뷰 섹션 | `review-filter-bar`, `review-card`, `my-review-section`, `logged-out-review-gate`, `review-cta-bar` (헤더/요약/지도 섹션 제외) |

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| 5축 점검 | - 카드 컨테이너 패딩/라운딩/그림자/보더 토큰 일관성 점검 | — | [x] |
|  | - 시맨틱 타이포 위반 확인 (`text-foreground`/`text-muted-foreground` 외 임의 색) | — | [x] |
|  | - 컬러 토큰 위반 확인 (raw hex/oklch, `bg-white` 류 절대색) | — | [x] |
|  | - 섹션 간 gap, 카드 내부 spacing 여백 일관성 점검 | — | [x] |
|  | - 클릭 영역·정보 위계·빈 상태 메시지 UX 적합성 점검 | — | [x] |
| 산출물 | - 3개 화면 × 5축 이슈 리스트 작성 | `docs/week-2-day1-audit.md` (신규) | [x] |
|  | - Day 2 리팩토링 후보 명시 (카드/배지/스코어/로딩/빈 상태 중복 패턴) | — | [x] |

> 산출물: 3개 화면 점검 완료 + Day 2 작업 범위 확정

---

## Day 2 (화 5/19) — 공통 컴포넌트 리팩토링 [x]

Day 1 점검 결과를 바탕으로 중복 패턴을 공통 컴포넌트로 추출. dead code 삭제.

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| 토큰 정리 | - `text-ink/70` → `text-muted-foreground` 전체 통일 | — | [x] |
|  | - 리뷰 본문 `text-body-2 text-foreground/85` → `text-body-1 text-foreground` | — | [x] |
|  | - CTA 버튼 `h-12` 교체 (MobileSubmitBar, trust-delta-card 데스크톱 CTA) | — | [x] |
| common/ 추출 | - `ScoreStars` → `common/` 추출 (4곳 표준화, `fill-warning` 토큰) | `src/components/common/score-stars.tsx` (신규) | [x] |
|  | - `RankMedal` → `common/` 추출 (2곳 표준화) | `src/components/common/rank-medal.tsx` (신규) | [x] |
|  | - `DimensionScoreRow` → `features/restaurant-detail/` 추출 (2곳) | `src/components/features/restaurant-detail/dimension-score-row.tsx` (신규) | [x] |
|  | - `SectionHeader` 신규 — `title/subtitle/rightAction/size` (8곳 적용) | `src/components/common/section-header.tsx` (신규) | [x] |
|  | - `Surface` 신규 — CVA variant: card/elevated/subtle/bordered (7곳 통일) | `src/components/common/surface.tsx` (신규) | [x] |
|  | - `DividedList` 신규 — `<ul border-y>` + `<li border-t>` 패턴 (5곳 통일) | `src/components/common/divided-list.tsx` (신규) | [x] |
|  | - `ConfirmDialog` 신규 — icon/title/description/actions (3곳 통일) | `src/components/common/confirm-dialog.tsx` (신규) | [x] |
| 리뷰 추출 | - `VisitOrdinalChip` 추출 — `review-card`, `my-review-section` 2곳 | `src/components/features/review/visit-ordinal-chip.tsx` (신규) | [x] |
|  | - `ReviewBodyClamp` 추출 — `CLAMP_THRESHOLD=120` + 더보기 토글 | `src/components/features/review/review-body-clamp.tsx` (신규) | [x] |
|  | - `ReviewPhotoGrid` 추출 — 3-grid + `+N` 오버레이 | `src/components/features/review/review-photo-grid.tsx` (신규) | [x] |
|  | - `SceneTagsRow` 추출 — `rounded-chip bg-muted` 칩 묶음 | `src/components/features/review/scene-tags-row.tsx` (신규) | [x] |
| 단일화/정리 | - `SCORE_LABELS` 4중 선언 → 단일화 | `src/lib/score-labels.ts` (신규) | [x] |
|  | - `my-restaurant-card`, `wishlist-item-card`, `regional-rank-card` dead code 삭제 (import 0회) | `my-restaurant-card.tsx`, `wishlist-item-card.tsx`, `regional-rank-card.tsx` (삭제) | [x] |
|  | - `contribution-checklist` → `PlaceCard p-4`로 감싸기 | `contribution-checklist.tsx` | [x] |
| 미완료 | - 공통 카드 셸 추출 | `src/components/core/place-card.tsx` (신규) | [ ] |
|  | - 로딩 상태 공통 래퍼 추출 | `src/components/common/list-skeleton.tsx` (신규) | [ ] |
|  | - 빈 상태 공통 래퍼 추출 | `src/components/common/empty-list.tsx` (신규) | [ ] |
|  | - `common/user-identity-row.tsx` — 아바타+이름+등급+신뢰도 4곳 통합 | `src/components/common/user-identity-row.tsx` (신규) | [ ] |
|  | - `useTabRoute` 훅 추출 — follow-list-view/my-places-tabs 라우팅 통합 | `src/hooks/use-tab-route.ts` (신규) | [ ] |
|  | - `common/taste-radar-chart.tsx` 분리 — recharts 의존성 1파일 격리 | `src/components/common/taste-radar-chart.tsx` (신규) | [ ] |
| 검증 | - `pnpm lint && npx tsc --noEmit` 그린 | — | [x] |

> 산출물: 카드/배지/리뷰결과 카드 공통화 완료. place-card/list-skeleton/empty-list는 W3으로 이관

---

## Day 3 (수 5/20) — Vercel Preview 배포 [x]

백엔드 팀이 클릭 가능한 Preview에서 UI를 확인할 수 있는 상태 확보.

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| Vercel 세팅 | - Vercel 프로젝트 생성/연결 및 빌드 명령 확인 (`pnpm build`, output: `.next`) | — | [x] |
|  | - env 입력: `NEXT_PUBLIC_KAKAO_MAP_KEY`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_API_BASE_URL`(비워둠) | — | [x] |
|  | - 로컬 `pnpm build` 그린 확인 (Turbopack 통과) | — | [x] |
|  | - 현재 브랜치 push → Vercel Preview URL 생성 | — | [x] |
| QA·공유 | - 9개 화면 동선 워크 수동 QA | — | [x] |
|  | - Preview URL을 백엔드 팀에 공유 | — | [x] |

> 산출물: 외부 접근 가능한 Vercel Preview URL 확보

---

## Day 4 (목 5/21) — Kakao Maps SDK 통합 [x]

`react-kakao-maps-sdk` + `useKakaoLoader` 방식으로 지도 임베드 및 mock 핀 렌더.  
(계획 당시 `next/script` 방식이었으나 실제 구현은 `react-kakao-maps-sdk` 사용)

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| 지도 통합 | - `NEXT_PUBLIC_KAKAO_MAP_KEY` 로컬·Vercel env 설정 | `.env.local` | [x] |
|  | - `react-kakao-maps-sdk` + `useKakaoLoader` 기반 지도 인스턴스 구현 | `src/components/features/map/map-view.tsx` | [x] |
|  | - 초기 중심/줌 레벨 mock으로 설정 | `src/components/features/map/map-view.tsx` | [x] |
|  | - mock 좌표 배열 → 핀 렌더 | `src/components/features/map/map-view.tsx` | [x] |
|  | - `restaurant-pin.tsx` 커스텀 마커 오버레이 통합 | `src/components/core/restaurant-pin.tsx` | [x] |
|  | - mock-restaurant에 `lat`/`lng` 필드 추가 | `src/data/mock-restaurant.ts` | [x] |
| 검증 | - `pnpm lint && npx tsc --noEmit` 그린 | — | [x] |

> 산출물: Kakao 지도가 mock 좌표 위에 핀을 표시

---

## Day 5 (금 5/22) — 영역 재검색 구현 [x]

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| 영역 재검색 | - 지도 이동/줌 → 버튼 노출 → viewport 좌표로 mock 필터 재호출 (영역 재검색) | `src/components/features/map/search-this-area.tsx` | [x] |
| 미완료 | - vaul 드래그 시트 구현 — 상단 지도(30vh) + 하단 시트(70vh) 30↔70 전환 | `src/components/features/map/map-sheet.tsx` (신규) | [ ] |
|  | - 핀 클릭 → 미니카드 오버레이 (가게명 + 평점 + 신뢰도%) | `src/components/features/map/map-mini-card.tsx` (신규) | [ ] |

> 산출물: 영역 재검색 완료

---

## Day 6 (토 5/23) — Storybook 보강 + 회귀 점검 [x]

Day 2 산출물 기반 story 추가 및 W1 동선 회귀 확인.

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| Storybook | - Day 2 산출물(카드 셸·배지·로딩·빈 상태 래퍼) story 신규 생성 | `src/stories/` (신규 다수) | [x] |
|  | - `pnpm build-storybook` 그린 | — | [x] |
| 회귀 점검 | - W1 동선 5종 워크 (회귀 확인) | — | [x] |
|  | - Day 2 리팩토링 영향 받는 화면 재확인 | — | [x] |
|  | - 다크모드 1회 패스 | — | [x] |

> 산출물: 23개 story 완비 + 회귀 없음 확인

---

## Day 7 (일 5/24) — `frontend-code-reviewer` 1바퀴 + 폴리시 [x]

W2 전체 변경 사항 코드 리뷰 및 빌드 최종 확인.

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| 코드 리뷰 | - `frontend-code-reviewer` 에이전트 — Day 1~6 변경 punch list 수집 및 즉시 수정 반영 | — | [x] |
|  | - 한국어 카피 톤 일관성 패스 (Empty 메시지, 빈 상태 카피, 버튼 라벨) | — | [x] |
| 검증·배포 | - `pnpm lint && npx tsc --noEmit && pnpm build && pnpm build-storybook` 모두 그린 | — | [x] |
|  | - Vercel Preview 최종 재배포 + 백엔드 팀 최종 URL 공유 | — | [x] |

> 산출물: W2 종료 — 시각 1차 MVP + 지도 통합 + Vercel 배포 완료

---

## 재사용 점검

| 필요한 것 | 사용 |
|---|---|
| 지도 | `react-kakao-maps-sdk` + `useKakaoLoader` |
| 시트 드래그 | vaul (W3 Day 1에서 설치 예정) |
| toast | `sonner` (설치됨) |
| 로딩 스켈레톤 | `src/components/ui/skeleton.tsx` |
| 빈 상태 | `src/components/ui/empty.tsx` |
