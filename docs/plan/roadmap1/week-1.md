# Week 1 — 프로토타입 완성 (시각적 1차 MVP) (5/12~5/17) [x]

## 이번 주 목표

**1차 MVP 9개 화면 + 핵심 서브 동선이 시각적으로 다 보이게** 만든다.  
데이터 레이어 정착은 W2 이후로 미루고, 기존 `src/data/mock-*` 패턴 그대로 누락 화면을 채운다.

이 주가 끝나면 클릭만으로 PRD 핵심 플로우(첫방문 → 리뷰 → 신뢰도 상승 → 등급 확인)를 끝까지 워크할 수 있다.

> **이번 주 원칙**
> - 새 화면도 `src/data/mock-*.ts`에 mock 데이터 두고 페이지가 직접 import (기존 패턴 유지)
> - `src/api/`, `src/hooks/`, `src/lib/types/` 신규 폴더 생성 금지 (W2에서)
> - 페이지 전용 컴포넌트는 `app/<route>/_components/`, 훅은 `_hooks/`, 도메인 로직은 `_lib/`에 colocate. 다중 라우트 공유는 `src/components/common/`.

---

## 일별 요약

| Day | 날짜 | 목표 | 주요 산출물 | 완료 |
|---|---|---|---|---|
| Mon | 5/12 | 리뷰 제출 결과 화면 | `review-result-dialog` + 게이지/체크리스트/등급바 | [x] |
| Tue | 5/13 | 등급 안내 화면 | `GradeGuideCard` 인라인 + `current-grade-panel` / `all-grades-timeline` | [x] |
| Wed | 5/14 | 홈 탐색 탭 UI | 검색/지역/정렬/카테고리/상황 칩, IntroCard 연결, MapView 선구현 | [x] |
| Thu | 5/15 | `/profile` 보강 + 비로그인 상세 미리보기 | 비로그인 분기, `LoginCtaDialog`, `LoggedOutReviewGate` | [x] |
| Fri | 5/16 | "가고 싶은" 서브탭 + 통합 동선 QA | `/my-places?tab=wishlist`, `WishlistSection`, 동선 5종 완주 | [x] |
| Sat | 5/17 | 카드 디자인 재점검 | `/my-places`·`/restaurant/[id]` 카드 통일, 시맨틱 토큰 위반 청소 | [x] |

---

## Day 1 (월 5/12) — 리뷰 제출 결과 화면 [x]

PRD 핵심 루프의 마지막 조각 — 리뷰 제출 후 신뢰도 변화·기여·등급 진행을 Dialog 오버레이로 노출.

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| Dialog 래퍼 | - 별도 라우트 없이 페이지 이탈 없는 결과 노출을 위한 Dialog 래퍼 구현 | `review-result-dialog.tsx` (신규) | [x] |
| 결과 카드 | - 신뢰도 게이지 변화 카드 구현 (72% → 77%) | `trust-score-change-card.tsx` (신규) | [x] |
|  | - 항목별 기여 카드 구현 (사진 +2.1%, 100자 이상 +1.4% 등) | `contribution-checklist.tsx` (신규) | [x] |
|  | - 등급 진행 카드 구현 ('맛집 헌터까지 리뷰 19개 남음') | `grade-progress-card.tsx` (신규) | [x] |
| 연결 | - 리뷰 폼 submit 시 Dialog 오픈 연결 | `review-write-form.tsx` | [x] |

> **완료 (2026-05-12)**

> 산출물: 리뷰 제출 → 결과 Dialog 흐름 완성

---

## Day 2 (화 5/13) — 등급 안내 화면 [x]

PRD 3.2 — `/profile` 내 등급 시스템 전체를 인라인 컴포넌트로 구현하고 등급 타입을 단일 소스로 표준화.

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| 패널 구현 | - 등급 안내 전체 래퍼 컴포넌트 구현 | `grade-guide-card.tsx` (신규) | [x] |
|  | - 현재 등급 + 리뷰/신뢰도 수치 패널 구현 | `current-grade-panel.tsx` (신규) | [x] |
|  | - 다음 등급 조건 체크리스트 패널 구현 | `next-stage-panel.tsx` (신규) | [x] |
|  | - Lv.1~6 전체 달성 타임라인 + pulse 애니메이션 구현 | `all-grades-timeline.tsx` (신규) | [x] |
|  | - 등급 팁 배너 구현 | `grade-tip-banner.tsx` (신규) | [x] |
| 등급 표준화 | - `GradeLevel`(1~6) 단일 진실 소스 확립 | `src/lib/grade-levels.ts` (신규) | [x] |
|  | - `GradeIcon` 프리미티브 추출 | `src/components/common/grade-icon.tsx` (신규) | [x] |
|  | - legacy `Grade`(S/A/B/C/D) 타입 및 브릿지 헬퍼 전면 제거 | — | [x] |

> **완료 (2026-05-13)**

> 산출물: 등급 안내 화면 완성 + 등급 시스템 단일 소스 표준화

---

## Day 3 (수 5/14) — 홈 탐색 탭 UI [x]

PRD 7.1, 7.2 — 검색·지역·정렬·카테고리·상황 필터 UI 구현 및 Kakao 지도 선구현.

> PRD 7.2의 1~3위 카드 / 4위~ 리스트 시각적 분리는 W2 이관.

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| 필터 UI | - 검색바 컴포넌트 구현 (`SearchInput` 재사용) | `search-bar.tsx` (신규) | [x] |
|  | - 지역/정렬 드롭다운 구현 (`SelectList` 재사용) | — | [x] |
|  | - 카테고리 칩 (전체/한식/일식/중식/양식/카페/술집) 다중 선택 구현 | — | [x] |
|  | - 상황 칩 (혼밥/데이트/회식) 다중 선택 구현 | — | [x] |
|  | - `IntroCard` — `localStorage` 'introSeen' 게이트로 1회만 노출 | — | [x] |
| 지도 | - Kakao Maps SDK 기반 임베드 지도 구현 (`react-kakao-maps-sdk` + `useKakaoLoader`) | `map-view.tsx` (신규) | [x] |
|  | - 영역 재검색 버튼 구현 | `search-this-area.tsx` (신규) | [x] |

> **완료 (2026-05-14)**

> 산출물: 홈 탐색 탭 필터 UI + 지도 선구현 완성

---

## Day 4 (목 5/15) — `/profile` 보강 + 비로그인 상세 미리보기 [x]

비로그인 사용자에게 맛집 상세 2개 리뷰 미리보기 노출 후 로그인 유도.

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| 인증 mock | - Zustand + persist 기반 인증 상태 mock 구현 | `auth-mock-store.tsx` (신규) | [x] |
|  | - dev 토글 플로팅 버튼 구현 | `auth-mock-toggle.tsx` (신규) | [x] |
| 비로그인 분기 | - 리뷰 2개 노출 후 '더 보기' 클릭 시 LoginCtaDialog 연결 | `logged-out-review-gate.tsx` (신규) | [x] |
|  | - 로그인 유도 Dialog 구현 | `login-cta-dialog.tsx` (신규) | [x] |
|  | - 북마크 클릭 → 비로그인 시 LoginCtaDialog 연동 | — | [x] |
|  | - `/signin?callbackUrl=` 라우팅 연결 | — | [x] |

> **완료 (2026-05-15)**

> 산출물: 비로그인 미리보기 분기 + 로그인 유도 Dialog 완성

---

## Day 5 (금 5/16) — "가고 싶은" 서브탭 + 통합 동선 QA [x]

PRD 7.3 — wishlist 서브탭 구현 및 핵심 플로우 5종 워크.

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| wishlist UI | - shadcn `Tabs` + URL 쿼리(`?tab=ranking\|wishlist`) 전환 구현 | `my-places-tabs.tsx` (신규) | [x] |
|  | - 북마크 가게 리스트 + '리뷰 쓰기' CTA + 북마크 해제(mock) + 빈 상태 구현 | `wishlist-section.tsx` (신규) | [x] |
|  | - 썸네일 + 이름 + 카테고리 + 추가 일자 카드 구현 | `wishlist-item-card.tsx` (신규) | [x] |
|  | - wishlist mock 데이터 작성 | `src/data/mock-wishlist.ts` (신규) | [x] |
|  | - 헤더 북마크 클릭 → `useState`로 채워짐/비워짐 토글 | — | [x] |
| 동선 QA | - 비로그인 홈 → 상세 미리보기 → 로그인 CTA 동선 워크 | — | [x] |
|  | - 로그인 → 온보딩 → 홈 복귀 (인트로 카드 사라짐) 동선 워크 | — | [x] |
|  | - 상세 → 북마크 → `/my-places?tab=wishlist` 표시 확인 동선 워크 | — | [x] |
|  | - 상세 → 리뷰 쓰기 → 제출 → 결과 Dialog → 등급 안내 → `/profile` 동선 워크 | — | [x] |
|  | - `/profile` 뱃지/레이더/TOP3 확인 동선 워크 | — | [x] |

> **완료 (2026-05-16)**

> 산출물: wishlist 서브탭 완성 + 핵심 플로우 5종 완주

---

## Day 6 (토 5/17) — 카드 디자인 재점검 [x]

`/my-places`·`/restaurant/[id]` 카드 UX 적합성 5축 점검 및 시맨틱 토큰 위반 청소.

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| 카드 일관성 | - 카드 컨테이너 패딩/라운딩/그림자 통일 | — | [x] |
| 토큰 청소 | - 시맨틱 타이포 위반 청소 | — | [x] |
|  | - 컬러 토큰 위반 청소 | — | [x] |
|  | - 섹션 간 여백 일관성 정리 | — | [x] |
| UX 점검 | - 클릭 영역·정보 계층 UX 적합성 점검 | — | [x] |
|  | - 공통 추출 가능한 카드 패턴 확인 | — | [x] |

> **완료 (2026-05-17)** — 커밋: "카드 디자인 수정", "나의 맛집 화면 카드 디자인 수정"

> 산출물: 9개 화면 카드 디자인 일관성 확보

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
