# Week 2 — 디자인 점검 + 리팩토링 + 배포 + 지도 통합 (5/18~5/24)

## 이번 주 목표

W1에서 시각적 1차 MVP가 완성된 상태. 백엔드가 아직 준비되지 않아 데이터 레이어 작업(NextAuth 실 로그인, `/profile` React Query, 리뷰 mutation)은 W3로 미룬다.

본 주는 **3개 핵심 화면 디자인 점검 → 공통 컴포넌트 리팩토링 → Vercel Preview 배포(백엔드 UI 공유) → 지도 통합(mock 위에서)** 순서로 진행한다.

점검·리팩토링이 데이터 레이어보다 앞에 오는 이유: 카드/배지/로딩 컴포넌트 셸이 굳어진 뒤 React Query 분기를 붙여야 셸 재공사로 인한 회귀를 막을 수 있다.

---

## 일별 요약

| Day | 날짜 | 목표 | 주요 산출물 | 완료 |
|---|---|---|---|---|
| Mon | 5/18 | 3개 화면 디자인 점검 | 화면별 이슈 체크리스트 + 리팩토링 후보 목록 | ☐ |
| Tue | 5/19 | 공통 컴포넌트 리팩토링 | 카드 셸·배지·로딩/빈 상태 통합, 리뷰 결과 카드 모듈화 | ☐ |
| Wed | 5/20 | Vercel Preview 배포 — 백엔드 UI 공유 | Preview URL + 9개 화면 동선 QA | ☐ |
| Thu | 5/21 | Kakao Maps SDK 통합 (지도 + 핀) | map-view 재작성, mock 핀 렌더 | ☐ |
| Fri | 5/22 | 지도 시트 드래그·영역 재검색·미니카드 | 30%↔70% 시트, 핀 클릭 미니카드, 영역 재검색 | ☐ |
| Sat | 5/23 | Storybook 보강 + 회귀 점검 | 신규 컴포넌트 story, 다크모드 패스 | ☐ |
| Sun | 5/24 | `frontend-code-reviewer` 1바퀴 + 폴리시 | punch list 반영, 빌드 최종 그린 | ☐ |

---

## Day 1 (월 5/18) — 3개 화면 디자인 점검 — ≈ 3~4h

**점검 전 준비**: `ui-ux-expert` 스킬 호출 후 시작.

**점검 대상**

| 화면 | 주요 컴포넌트 |
|---|---|
| `/my-places` | `my-places-tabs`, `my-restaurant-summary-card`, `restaurant-rank-list`, `my-restaurant-card`, `wishlist-section`, `wishlist-item-card`, `taste-profile-section` |
| `/review/new` | `review-write-form`, `restaurant-picker`, `target-restaurant-card`, `location-verify-banner`, `star-rating-input`, `rating-fields`, `scene-tag-selector`, `review-text-field`, `photo-upload-grid`, `trust-delta-card`, `ranking-preview`, `preview-sidebar` |
| `/restaurant/[id]` 리뷰 섹션 | `review-filter-bar`, `review-card`, `my-review-section`, `logged-out-review-gate`, `review-cta-bar` (헤더/요약/지도 섹션 제외) |

**점검 5축** (W1 Day 6 기준 재사용)

- [ ] 카드 컨테이너 — 패딩/라운딩/그림자/보더 토큰 일관성
- [ ] 시맨틱 타이포 위반 — `text-foreground`/`text-muted-foreground` 외 임의 색
- [ ] 컬러 토큰 위반 — raw hex/oklch, `bg-white` 류 절대색
- [ ] 여백 일관성 — 섹션 간 gap, 카드 내부 spacing
- [ ] UX 적합성 — 클릭 영역, 정보 위계, 빈 상태 메시지

**산출물**

- [ ] 3개 화면 × 5축 이슈 리스트를 Markdown 표로 정리
- [ ] Day 2 리팩토링 후보 명시 — 카드/배지/스코어/로딩/빈 상태 중복 패턴

**종료 조건**

- [ ] 이슈 체크리스트 작성 완료, 리팩토링 필요 패턴이 구체적으로 명시됨

> 산출물: 3개 화면 점검 완료 + Day 2 작업 범위 확정

---

## Day 2 (화 5/19) — 공통 컴포넌트 리팩토링 — ≈ 5~6h

Day 1 점검 결과를 바탕으로 4축 리팩토링.

**(1) 맛집 카드 컨테이너 통합**

- [ ] `my-restaurant-card`, `wishlist-item-card`, `target-restaurant-card`, `review-card` 4종 비교
- [ ] 공통 카드 셸 → `src/components/core/` 단일 `.tsx` 추출 (`ui/card.tsx` 위에 className override로 래핑)
- [ ] 각 카드는 셸 + 도메인 콘텐츠 구조로 분리 (feature 코드는 `features/`에 유지)

**(2) 점수/배지 류 정리**

- [ ] `trust-score-badge`, `grade-badge`, `grade-icon`, `score-panel`, `trust-delta-card`, `trust-score-change-card` 시각·타입 일관화
- [ ] 크기 토큰(sm/md/lg), 색 토큰, 등급→색 매핑이 `src/lib/grade-levels.ts`를 거치는지 확인 + 정리

**(3) 로딩/빈 상태 표준화**

- [ ] 화면별 즉석 skeleton 사용 위치 목록화
- [ ] `ui/skeleton` + `ui/empty` 위 래퍼로 통일 → `src/components/common/` 단일 `.tsx` 파일로 추출

**(4) 리뷰 결과 카드 모듈화**

- [ ] `trust-score-change-card`, `grade-progress-card`, `contribution-checklist`를 공통 카드 셸 위로 정리
- [ ] `points-earned-card` — `// TODO: 1차 MVP 제외` 주석 유지

**종료 조건**

- [ ] `pnpm lint && npx tsc --noEmit` 그린
- [ ] Storybook으로 변경된 셸/배지 시각 확인, 새 컴포넌트 story 생성 (`generate-story` 스킬)
- [ ] 3개 화면 브라우저에서 열어 회귀 없음 확인
- [ ] `frontend-code-reviewer` 에이전트 호출해 리뷰

> 산출물: 카드/배지/로딩/리뷰결과 카드 공통화 완료. W3 데이터 레이어 연결 시 회귀 없이 분기 추가 가능한 상태

---

## Day 3 (수 5/20) — Vercel Preview 배포 — ≈ 3~4h

**Vercel 프로젝트 셋업** (이미 있다면 점검만)

- [ ] Vercel 프로젝트 생성/연결 — 레포 import
- [ ] 빌드 명령 확인: `pnpm build`, output: `.next`
- [ ] Preview 환경 변수 입력
  - `NEXT_PUBLIC_KAKAO_MAP_KEY` (Day 4에 본격 사용)
  - `NEXTAUTH_SECRET` (더미값으로 NextAuth 설정 보호)
  - `NEXTAUTH_URL` (Preview URL 와일드카드 처리)
  - `NEXT_PUBLIC_API_BASE_URL` — **비워둠** (백엔드 미준비)

**빌드 검증**

- [ ] 로컬 `pnpm build` 그린 — `src/data/mock-*` import 경로 정상, Turbopack 통과
- [ ] `pnpm lint && npx tsc --noEmit` 그린

**배포 실행**

- [ ] 현재 브랜치 push → Vercel Preview URL 자동 생성
- [ ] 9개 화면 동선 워크 수동 QA (W1 Day 5의 5종 동선 재사용)

**백엔드 공유**

- [ ] Preview URL을 백엔드 팀에 공유

**종료 조건**

- [ ] Preview URL이 살아있고 9개 화면 모두 클릭 워크 가능
- [ ] 백엔드 팀에 URL 전달 완료

> 산출물: 백엔드가 클릭 가능한 Preview에서 UI를 확인할 수 있는 상태

---

## Day 4 (목 5/21) — Kakao Maps SDK 통합 (지도 + 핀) — ≈ 5h

**env / 스크립트 로드**

- [ ] `NEXT_PUBLIC_KAKAO_MAP_KEY` 로컬·Vercel 입력 (Day 3에서 미리 넣었으면 점검만)
- [ ] `src/app/layout.tsx` 또는 페이지 단위 `next/script` 동적 로드 (`strategy="afterInteractive"`)

**`map-view.tsx` 재작성** (`src/components/features/explore/map-view.tsx` stub → 실 구현)

- [ ] Kakao Maps SDK 기반 지도 인스턴스 생성 (`new kakao.maps.Map`)
- [ ] 초기 중심/줌 레벨 mock으로 설정
- [ ] mock 좌표 배열 → 핀 렌더 (`new kakao.maps.Marker`)
- [ ] 일반 핀 / 내가 방문한 곳 핀 시각 구분 (체크 아이콘 — mock 플래그)

**`restaurant-pin.tsx` 검토**

- [ ] `src/components/features/explore/restaurant-pin.tsx`를 커스텀 마커 오버레이로 활용 가능한지 확인 후 통합

**mock 좌표 데이터**

- [ ] `src/data/mock-restaurant.ts`에 `lat`/`lng` 필드 추가 (없다면)

**종료 조건**

- [ ] 로컬에서 지도 렌더 + 핀 표시
- [ ] `pnpm lint && npx tsc --noEmit` 그린

> 산출물: Kakao 지도가 mock 좌표 위에 핀을 표시. 인터랙션은 Day 5

---

## Day 5 (금 5/22) — 지도 시트 + 영역 재검색 + 미니카드 — ≈ 5~6h

**시트 30%↔70% 드래그**

- [ ] `vaul` (이미 설치) 사용 — 탐색 탭: 상단 지도(기본 30vh) + 하단 시트(70vh)
- [ ] 드래그로 30↔70 전환, 시트 안은 기존 `RegionRankList` 재사용

**핀 클릭 미니 카드**

- [ ] 핀 클릭 시 InfoWindow 또는 커스텀 오버레이로 미니 카드 (가게명 + 평점 + 신뢰도%)
- [ ] Day 2 카드 셸 재사용 가능한지 확인

**영역 재검색**

- [ ] `src/components/features/explore/search-this-area.tsx` 활용
- [ ] 지도 이동/줌 → 버튼 노출 → viewport 좌표로 mock 데이터 필터 재호출

**종료 조건**

- [ ] 시트 드래그·핀 클릭·영역 재검색 mock 위에서 동작
- [ ] `pnpm lint && npx tsc --noEmit` 그린
- [ ] Vercel Preview 재배포 후 백엔드 팀에 업데이트 URL 공유

> 산출물: 탐색 탭이 지도+리스트 결합 형태로 mock 위에서 완전 동작

---

## Day 6 (토 5/23) — Storybook 보강 + 회귀 점검 — ≈ 3~4h

**Storybook 갱신**

- [ ] Day 2 산출물(카드 셸, 배지, 로딩/빈 상태 래퍼) story 신규 생성 — `generate-story` 스킬
- [ ] Day 4·5 산출물 중 Storybook 가능 단위(미니 카드 등) story 추가

**회귀 점검**

- [ ] W1 동선 5종 워크 (홈→상세 미리보기 / 로그인→온보딩 / 북마크→my-places / 리뷰→결과→/profile / /profile 뱃지)
- [ ] Day 2 리팩토링 영향 받는 화면 재확인
- [ ] 다크모드 1회 패스

**종료 조건**

- [ ] `pnpm build-storybook` 그린
- [ ] 9개 화면 다크모드/라이트모드 깨짐 없음

> 산출물: 디자인·리팩토링·지도 변경이 회귀 없이 안착

---

## Day 7 (일 5/24) — 코드 리뷰 1바퀴 + 폴리시 — ≈ 3~4h

**코드 리뷰**

- [ ] `frontend-code-reviewer` 에이전트 호출 — Day 1~6 변경 전체 punch list 수집
- [ ] 즉시 수정 가능한 항목 반영 (큰 수정은 W3 Day 5 코드 리뷰 박스에 합류 메모)

**최종 폴리시**

- [ ] Day 1 점검 표 잔여 체크박스 처리
- [ ] 한국어 카피 톤 일관성 패스 (Empty 메시지, 빈 상태 카피, 버튼 라벨)

**W3 진입 준비**

- [ ] 백엔드 준비 상태 확인 후 W3 첫날 시작 지점 메모 (axios 그릇 / NextAuth 확장 / `/profile` 데이터 레이어)

**종료 조건**

- [ ] `pnpm lint && npx tsc --noEmit && pnpm build && pnpm build-storybook` 모두 그린
- [ ] Vercel Preview 최종 재배포 + 백엔드 팀 최종 URL 공유

> 산출물: W2 종료 시 시각 1차 MVP + 지도 통합 + 배포 완료. W3 데이터 레이어 작업 시작 준비됨

---

> **W3 이관 사항** (백엔드 API 스키마 확정 후 W3에서 진행, 이번 주 시작 안 함)
>
> - 인프라 그릇 다지기 (`src/types/*` → `src/lib/types/*`, `src/lib/axios.ts`)
> - 로그인 백엔드 통합 + RHF/zod 셋업 (`src/auth.ts`, `/onboarding` 실 API)
> - `/profile` 데이터 레이어 표준화 (`useMyProfile`)
> - `/profile/grade` 데이터 레이어 (`useGradeProgress`)
> - 리뷰 결과 mutation + middleware 가드 + 에러 페이지

---

## 재사용 점검

| 필요한 것 | 사용 |
|---|---|
| 지도 | Kakao Maps JS SDK (`next/script` 로드) |
| 시트 드래그 | `vaul` (설치됨) |
| toast | `sonner` (설치됨) |
| 로딩 스켈레톤 | `src/components/ui/skeleton.tsx` |
| 빈 상태 | `src/components/ui/empty.tsx` |
| 카드 셸 | (Day 2 산출물) `src/components/core/place-card.tsx` |
| 로딩/빈 상태 공통 래퍼 | (Day 2 산출물) `src/components/common/list-skeleton.tsx`, `common/empty-list.tsx` |
