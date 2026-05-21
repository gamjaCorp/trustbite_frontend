# Week 1 — 프로토타입 완성 (시각적 1차 MVP) (5/12~5/17) ☑

## 이번 주 목표

**1차 MVP 9개 화면 + 핵심 서브 동선이 시각적으로 다 보이게** 만든다.  
데이터 레이어 정착은 W2 이후로 미루고, 기존 `src/data/mock-*` 패턴 그대로 누락 화면을 채운다.

이 주가 끝나면 클릭만으로 PRD 핵심 플로우(첫방문 → 리뷰 → 신뢰도 상승 → 등급 확인)를 끝까지 워크할 수 있다.

> **이번 주 원칙**
> - 새 화면도 `src/data/mock-*.ts`에 mock 데이터 두고 페이지가 직접 import (기존 패턴 유지)
> - `src/api/`, `src/hooks/`, `src/lib/types/` 신규 폴더 생성 금지 (W2에서)
> - 컴포넌트 폴더 구조는 `src/components/features/<feature>/`로 통일

---

## 일별 요약

| Day | 날짜 | 목표 | 주요 산출물 | 완료 |
|---|---|---|---|---|
| Mon | 5/12 | 리뷰 제출 결과 화면 | `review-result-dialog` + 게이지/체크리스트/등급바 | ☑ |
| Tue | 5/13 | 등급 안내 화면 | `GradeGuideCard` 인라인 + `current-grade-panel` / `all-grades-timeline` | ☑ |
| Wed | 5/14 | 홈 탐색 탭 UI | 검색/지역/정렬/카테고리/상황 칩, IntroCard 연결, MapView 선구현 | ☑ |
| Thu | 5/15 | `/profile` 보강 + 비로그인 상세 미리보기 | 비로그인 분기, `LoginCtaDialog`, `LoggedOutReviewGate` | ☑ |
| Fri | 5/16 | "가고 싶은" 서브탭 + 통합 동선 QA | `/my-places?tab=wishlist`, `WishlistSection`, 동선 5종 완주 | ☑ |
| Sat | 5/17 | 카드 디자인 재점검 | `/my-places`·`/restaurant/[id]` 카드 통일, 시맨틱 토큰 위반 청소 | ☑ |

---

## Day 1 (월) — 리뷰 제출 결과 화면 ☑

PRD 6.4 / 8.8(#9). TrustBite 핵심 루프의 마지막 조각.

**구현 방식**: 별도 페이지 라우트 대신 **Dialog 오버레이**로 구현 (페이지 이탈 없이 결과 노출).

**컴포넌트 (`src/components/features/review-result/`)**

- `review-result-dialog.tsx` — Dialog 래퍼, 결과 카드 조합
- `trust-score-change-card.tsx` — 신뢰도 게이지 변화 (72% → 77%)
- `contribution-checklist.tsx` — 항목별 기여 (사진 +2.1%, 100자 이상 +1.4% …)
- `grade-progress-card.tsx` — '맛집 헌터까지 리뷰 19개 남음'

> `points-earned-card.tsx`는 3차 MVP 제외 주석 처리.

**`review-write-form.tsx` 연결**: submit 시 Dialog 오픈.

> **완료 (2026-05-12)**

---

## Day 2 (화) — 등급 안내 화면 ☑

PRD 3.2 / 8.8(#8).

**구현 방식**: 별도 `/profile/grade` 라우트 대신 `/profile` 내 `GradeGuideCard`로 **인라인 임베드**.

**컴포넌트 (`src/components/features/grade-guide/`)**

- `grade-guide-card.tsx` — 전체 래퍼
- `current-grade-panel.tsx` — 현재 등급 + 리뷰/신뢰도 수치
- `next-stage-panel.tsx` — 다음 등급 조건 체크리스트
- `all-grades-timeline.tsx` — Lv.1~6 전체 달성 타임라인 + pulse 애니메이션
- `grade-tip-banner.tsx` — 등급 팁 배너

**등급 시스템 표준화**

- `GradeLevel`(1~6) 단일 진실 소스 (`src/lib/grade-levels.ts`)
- `GradeIcon` 프리미티브 추출 (`src/components/common/grade-icon.tsx`)
- legacy `Grade`(S/A/B/C/D) 타입 및 브릿지 헬퍼 전면 제거
- 리뷰 카드/헤더/실시간 리뷰 등 전체 등급 표시처 아이콘으로 통일

> **완료 (2026-05-13)**

---

## Day 3 (수) — 홈 탐색 탭 UI ☑

PRD 7.1, 7.2. 홈은 탐색 전용 단일 콘텐츠.

**구현 방식**: 별도 `explore-home/` 폴더 대신 **기존 `RegionRankList` 안에 통합**.

**검색/필터 UI**

- `search-bar`: `SearchInput` 컴포넌트 재사용
- 지역/정렬 드롭다운: `SelectList` 컴포넌트 재사용
- 카테고리 칩 (전체/한식/일식/중식/양식/카페/술집): `Toggle` 다중 선택
- 상황 칩 (혼밥/데이트/회식): `Toggle` 다중 선택
- `IntroCard`: `localStorage` 'introSeen' 게이트 내장, 1회만 노출

**지도 선구현** (W3 예정이었으나 Day 3에 포함)

- `src/components/features/explore/map-view.tsx`: Kakao Maps SDK 기반 임베드 지도
- `src/components/features/explore/search-this-area.tsx`: 영역 재검색 버튼

> PRD 7.2의 1~3위 카드 / 4위~ 리스트 시각적 분리는 미반영 — W2 이관.

> **완료 (2026-05-14)**

---

## Day 4 (목) — `/profile` 보강 + 비로그인 상세 미리보기 ☑

**`/profile` PRD 8.6 확인**: 미식 성향·TOP3는 도메인 분담 원칙에 따라 `/my-places`에 위치 — 별도 작업 없이 완료.

**비로그인 `/restaurant/[id]` 미리보기**

- `src/stores/auth-mock-store.tsx`: Zustand + persist 기반 인증 상태 mock
- `src/components/features/restaurant-detail/logged-out-review-gate.tsx`: 리뷰 2개 노출 → '더 보기' 클릭 시 LoginCtaDialog
- `src/components/features/auth/login-cta-dialog.tsx`: 로그인 유도 Dialog
- dev 토글 플로팅 버튼 (`src/components/common/auth-mock-toggle.tsx`)
- 북마크 클릭 → 비로그인 시 같은 Dialog 연동
- `/signin?callbackUrl=` 로 라우팅

> **완료 (2026-05-15)**

---

## Day 5 (금) — "가고 싶은" 서브탭 + 통합 동선 QA ☑

PRD 7.3.

**`/my-places?tab=wishlist` 서브탭**

- `src/components/features/my-restaurant/my-places-tabs.tsx`: shadcn `Tabs` URL 쿼리(`?tab=ranking|wishlist`) 전환
- `src/components/features/my-restaurant/wishlist-section.tsx`: 북마크 가게 리스트, '리뷰 쓰기' CTA, 북마크 해제(mock state), 빈 상태
- `src/components/features/my-restaurant/wishlist-item-card.tsx`: 썸네일 + 이름 + 카테고리 + 추가 일자
- `src/data/mock-wishlist.ts`: wishlist mock 데이터

**`/restaurant/[id]` 북마크 토글 mock**

- 헤더 북마크 클릭 → `useState`로 채워짐/비워짐 토글

**통합 동선 워크 (수동 QA 5종)**

- 비로그인 홈 → 상세 미리보기 → 로그인 CTA
- 로그인 → 온보딩 → 홈 복귀 (인트로 카드 사라짐)
- 상세 → 북마크 → `/my-places?tab=wishlist` 표시 확인
- 상세 → 리뷰 쓰기 → 제출 → 결과 Dialog → 등급 안내 → `/profile`
- `/profile` 뱃지/레이더/TOP3 확인

> **완료 (2026-05-16)**

---

## Day 6 (토) — 카드 디자인 재점검 ☑

`/my-places`·`/restaurant/[id]` 카드 UX 적합성 5축 점검:

- 카드 컨테이너 (패딩/라운딩/그림자 통일)
- 시맨틱 타이포 위반 청소
- 컬러 토큰 위반 청소
- 여백 일관성
- UX 적합성 (클릭 영역, 정보 계층)

공통 추출 가능한 카드 패턴 확인.

> **완료 (2026-05-17)** — 커밋: "카드 디자인 수정", "나의 맛집 화면 카드 디자인 수정"

---

## 재사용 컴포넌트 목록

| 필요한 것 | 사용 |
|---|---|
| 탭 | `src/components/ui/tabs.tsx` |
| 드롭다운 | `src/components/ui/select.tsx` |
| 칩 | `src/components/ui/toggle.tsx`, `badge.tsx` |
| 진행바 | `src/components/ui/progress.tsx` |
| 모달 | `src/components/ui/dialog.tsx` |
| 레이더 차트 | `recharts` `RadarChart` |
| 검색 인풋 | `src/components/core/search-input.tsx` |
| 칩 셀렉트 | `src/components/core/select-list.tsx` |
| TrustScore | `src/components/common/trust-score-badge.tsx` |
| 등급 표시 | `src/components/common/grade-badge.tsx`, `grade-icon.tsx` |
