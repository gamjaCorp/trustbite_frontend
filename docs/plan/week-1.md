# Week 1 — 프로토타입 완성 (시각적 1차 MVP)

## 이번 주 목표

**1차 MVP 9개 화면 + 핵심 서브 동선이 시각적으로 다 보이게** 만든다.  
데이터 레이어 정착은 Week 2 이후로 미루고, **이번 주는 기존 프로토타입 패턴 그대로**(컴포넌트 + `src/data/mock-`*) 누락 화면을 채운다.

이 주가 끝나면 클릭만으로 PRD 16 핵심 플로우(첫방문 → 리뷰 → 신뢰도 상승 → 등급 확인)를 끝까지 워크할 수 있다.

> **이번 주 작업 원칙**
>
> - 새 화면도 `src/data/mock-*.ts`에 mock 데이터 두고 페이지가 직접 import (기존 패턴 유지)
> - `src/api/`, `src/hooks/`, `src/lib/types/` 신규 폴더는 **만들지 않는다** (Week 2)
> - 컴포넌트 폴더 구조는 `src/components/features/<feature>/`로 통일

---

## 일별 요약


| Day | 날짜   | 목표                           | 주요 산출물                                        | 완료  |
| --- | ---- | ---------------------------- | --------------------------------------------- | --- |
| Mon | 5/12 | 리뷰 제출 결과 화면                  | `/review/new/result` + 게이지/체크리스트/등급바          | ☑   |
| Tue | 5/13 | 등급 안내 화면                     | `/profile/grade` + 현재등급/체크리스트/타임라인            | ☑   |
| Wed | 5/14 | 홈 탐색 탭 UI                    | `/` 검색/지역/정렬/카테고리/상황 칩, IntroCard 연결          | ☑   |
| Thu | 5/15 | `/profile` 보강 + 비로그인 상세 미리보기 | 뱃지 컬렉션 + 레이더 + TOP3 + 비로그인 분기                 | ☑   |
| Fri | 5/16 | "가고 싶은" 서브탭 + 통합 동선 QA       | `/my-places?tab=wishlist` + 폴리싱 + 핵심 루프 완주 확인 | ☐   |


---

## Day 1 (월) — 리뷰 제출 결과 화면 — ≈ 5~6h

PRD 6.4 / 8.8(#9). TrustBite 핵심 루프의 마지막 조각.

**라우트**

- `src/app/review/new/result/page.tsx` 신규 (페이지 라우트로 — 새로고침 손실 방지)

**컴포넌트 (`src/components/features/review-result/`)**

- `trust-score-delta-gauge.tsx` — 게이지가 차오르는 애니메이션 (예: 72% → 77%)
- `contribution-checklist.tsx` — 항목별 기여 (사진 +2.1%, 100자 이상 +1.4% …)
- `grade-progress-bar.tsx` — '맛집 헌터까지 리뷰 19개 남음'
- `result-actions.tsx` — '내 랭킹 보기' / '계속 둘러보기' CTA

**Mock 데이터 + 타입**

- `src/types/review.ts`에 `ReviewSubmitResult` 인터페이스 추가
- `src/data/mock-review-result.ts` 신규 — `getReviewSubmitResult(reviewId)` 함수

**기존 폼 연결**

- `review-write-form.tsx`의 submit → `router.push('/review/new/result?reviewId=...')`
- 결과 페이지에서 `searchParams.reviewId`로 mock 결과 읽기

> 산출물: 리뷰 작성 → 결과 화면이 자연스럽게 이어짐
>
> **완료 (2026-05-12)** — 별도 페이지 라우트 대신 Dialog 오버레이로 구현 (UX상 페이지 이탈 없이 결과 노출). 컴포넌트: `review-result-dialog`, `trust-score-change-card`, `contribution-checklist`, `grade-progress-card`. 포인트 적립(`PointsEarnedCard`)은 3차 MVP 제외 주석 처리.

---

## Day 2 (화) — 등급 안내 화면 — ≈ 4~5h

PRD 3.2 / 8.8(#8). Day 1 결과 화면에서 진입할 다음 화면.

**라우트**

- `src/app/profile/grade/page.tsx` 신규

**컴포넌트 (`src/components/features/grade/`)**

- `current-grade-summary.tsx` — 현재 등급 + 다음 등급까지 진행바
- `promotion-checklist.tsx` — '리뷰 X개 더', '신뢰도 Y%' 체크 리스트
- `grade-timeline.tsx` — Lv.1~Lv.6 전체 타임라인 (달성 ✓ / 현재 → / 미달성 회색)

**Mock 데이터 + 타입**

- `src/types/user.ts`에 `GradeLevel`, `GradeRequirement` 추가 (PRD 3장 표 기준)
- `src/data/mock-grade-progress.ts` 신규 — `getGradeProgress()` 함수

**진입 경로 연결**

- `src/components/features/my-profile/grade-progress-card.tsx` → 클릭 시 `/profile/grade`
- Day 1의 `grade-progress-bar.tsx` → `/profile/grade` 링크
- (선택) `/profile`의 `MyProfileView`에서 등급 부분 클릭 시 진입

> 산출물: 등급/뱃지 동기 부여 동선 완성
>
> **완료 (2026-05-13)** — 별도 `/profile/grade` 라우트 대신 `/profile` 내 `GradeGuideCard`로 인라인 임베드. 컴포넌트: `current-grade-panel`(현재 등급 + 리뷰/신뢰도 수치), `next-stage-panel`(다음 등급 조건 체크리스트), `all-grades-timeline`(Lv.1~6 전체 달성 타임라인 + 요건 텍스트 + pulse 애니메이션), `grade-tip-banner`. 등급 시스템 표준화 추가 완료: `GradeLevel`(1~6) 단일 진실 소스 + `GradeIcon` 프리미티브 추출 → legacy `Grade`(S/A/B/C/D) 타입 및 브릿지 헬퍼 전면 제거. 리뷰 카드/헤더/실시간 리뷰 등 전체 등급 표시처 아이콘으로 통일.

---

## Day 3 (수) — 홈 탐색 탭 UI — ≈ 5~6h

PRD 7.1, 7.2. 홈은 탐색 전용 단일 콘텐츠. 탐색 탭에 PRD가 명시한 검색/필터 UI를 모두 붙인다. **동작은 mock**, 실제 API/지도 연결은 Week 3. "나의 맛집" 진입은 헤더/하단 nav → `/my-places`.

**홈 구조 (`src/app/page.tsx`)**

- 탐색 전용 단일 콘텐츠 (탭 제거 또는 탐색 탭만 유지)

**탐색 탭 UI (`src/components/features/explore-home/`)**

- `search-bar.tsx` — `Input` + 돋보기 + 클리어 버튼 (입력은 받되 동작 X)
- `region-filter.tsx` — 지역 드롭다운 (`Select`, mock 옵션)
- `sort-filter.tsx` — 랭킹순/신뢰도순/최신순 드롭다운
- `category-chips.tsx` — 전체/한식/일식/중식/양식 (`Toggle` 다중)
- `context-chips.tsx` — 혼밥/데이트/회식 (`Toggle` 다중)
- `IntroCard` 연결 — `localStorage` 'introSeen' 체크해서 1회만 노출

**리스트 영역**

- 기존 `RegionRankList`를 탐색 탭 안으로 그대로 이동 (mock 데이터 그대로)
- 1~~3위 카드와 4위~~ 리스트 분리 표시 (PRD 7.2)

> 산출물: 홈에 들어오면 PRD 탐색 탭 UI가 다 보임 (지도/검색 동작은 mock)
>
> **완료 (2026-05-14)** — 별도 `explore-home/` 폴더 대신 기존 `RegionRankList` 안에 검색/지역/정렬/카테고리/상황 칩을 모두 통합. `SearchInput` + `ChipSelect` 공통 컴포넌트 재사용. IntroCard(`localStorage` 'introSeen' 게이트 내장). 계획보다 앞서 임베드 `MapView` + `SearchThisArea`(영역 재검색) 선구현 (Week 3 예정이었으나 Day 3에 포함). PRD 7.2의 1~3위 카드 / 4위~ 리스트 시각적 분리는 미반영 — Day 5 폴리싱 또는 Week 2로 이관.

---

## Day 4 (목) — `/profile` 보강 + 비로그인 상세 미리보기 — ≈ 5~6h

목표: `/profile`을 PRD 8.6 사양에 맞게 채우고, 비로그인 상세 미리보기 분기 추가.

`**/profile` 뱃지 컬렉션**

- `src/components/features/my-profile/badge-collection.tsx`
  - 획득 뱃지 (컬러) + 미달성 (그레이) 그리드
  - 각 뱃지 클릭/hover 시 달성 조건 텍스트
- mock 데이터에 `badges[]` 필드 추가 (`src/data/mock-my-profile.ts`)

`**/profile` 레이더 차트**

- `src/components/features/my-profile/taste-radar-chart.tsx`
  - Recharts `RadarChart` — 맛 / 가성비 / 분위기 3축
- mock 데이터에 `tasteAxes` 필드 추가

`**/profile` 인생 맛집 TOP 3**

- `src/components/features/my-profile/top3-restaurants.tsx`
  - `RestaurantTop3Card` (이미 있음) 재사용 검토
- `MyProfileView`에 세 섹션 통합 (`/profile` 페이지)

**비로그인 상세 미리보기 (`/restaurant/[id]`)**

- `auth()` 결과로 분기 (mock 토글로도 OK)
- 비로그인:
  - 리뷰 2~3개만 노출
  - '리뷰 더 보기' 버튼 → 로그인 CTA `Dialog`
  - 헤더 북마크 → 클릭 시 로그인 모달
- 로그인: 기존 전체 리뷰 표시

> 산출물: `/profile`이 PRD 8.6 충족 + 비로그인 유입 → 로그인 유도 흐름 완성
>
> **완료 (2026-05-15)** — `/profile` 부분은 PRD 8.6 사양 대부분이 이미 구현되어 있어 별도 작업 없이 마무리 (미식 성향·TOP3는 도메인 분담 원칙에 따라 `/my-places`에 위치). 비로그인 상세 미리보기만 추가: `auth-mock-store`(zustand+persist) + `LoggedOutReviewGate`(리뷰 2개 노출 → '더 보기' 클릭 시 CTA Dialog) + `LoginCtaDialog` + dev 토글 플로팅 버튼. 북마크 클릭 시도 같은 Dialog 연동. `/signin?callbackUrl` 로 라우팅.

---

## Day 5 (금) — "가고 싶은" 서브탭 + 통합 동선 QA — ≈ 5~6h

PRD 7.3 탭 2 "가고 싶은" 서브탭 + 한 주 결과 검수.

**"가고 싶은" 서브탭 (`/my-places`)**

- `/my-places?tab=ranking|wishlist` URL 쿼리로 서브탭 전환 (shadcn `Tabs`)
- `src/components/features/my-restaurant/wishlist-section.tsx`
  - 북마크 가게 리스트 (썸네일 + 이름 + 카테고리 + 추가 일자)
  - '리뷰 쓰기' CTA → `/review/new?restaurantId=...`
  - 각 항목에 북마크 해제 버튼 (mock state)
  - 비어 있을 때: '가고 싶은 맛집을 저장해보세요'
- mock: `src/data/mock-wishlist.ts` 신규

`**/restaurant/[id]` 북마크 토글 mock**

- 헤더 북마크 아이콘 클릭 시 채워짐/비워짐 토글 (`useState` mock)

**통합 동선 워크 (수동 QA)**

- 비로그인 홈(탐색 탭) → 상세 미리보기 → 로그인 CTA
- 로그인 → 온보딩 → 홈 복귀 (인트로 카드 사라짐)
- 상세 → 북마크 → `/my-places?tab=wishlist`에서 표시 확인
- 상세 → 리뷰 쓰기 → 제출 → 결과 화면 → 등급 안내 → `/profile`
- `/profile` 뱃지/레이더/TOP3 다 보이는지 확인

**폴리싱**

- `pnpm lint && npx tsc --noEmit && pnpm build` 그린
- `text-xs` 미만 텍스트 / 토큰 외 hex 컬러 / `[px]` 임의값 빠르게 스캔

> 산출물: **클릭만으로 1차 MVP 전체를 워크 가능한 프로토타입**

---

## 다음 주 punch list (→ Week 2)

- 인프라: `src/lib/axios.ts`
- `/profile` 데이터 레이어 표준 사례 수립 (api/user, hooks/user)
- `/profile/grade`, `/review/new/result` 표준화
- 인증 가드 middleware 통합 + 에러 페이지

---

## 재사용 우선 점검


| 필요한 것         | 사용할 컴포넌트                                                                              |
| ------------- | ------------------------------------------------------------------------------------- |
| 탭             | `src/components/ui/tabs.tsx`                                                          |
| 드롭다운          | `src/components/ui/select.tsx`                                                        |
| 칩             | `src/components/ui/toggle.tsx`, `badge.tsx`                                           |
| 진행바           | `src/components/ui/progress.tsx`                                                      |
| 모달            | `src/components/ui/dialog.tsx`                                                        |
| 레이더 차트        | `recharts` `RadarChart` (이미 설치)                                                       |
| 인트로 카드        | `src/components/core/intro-card/index.tsx`                                            |
| TrustScore 표시 | `src/components/core/trust-score-badge/index.tsx`, `core/trust-score-sheet/index.tsx` |
| 등급 표시         | `src/components/core/grade-badge.tsx`, `src/components/core/grade-icon.tsx`           |
| TOP 3 카드      | `src/components/features/my-restaurant/restaurant-top3-card.tsx`                      |


