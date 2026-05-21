---
name: project_place_list_row_refactor
description: PlaceListRow 통합 컴포넌트 리팩토링 — regional/my/wishlist 3개 카드를 단일 컴포넌트로 통합한 아키텍처 결정
metadata:
  type: project
---

3개 카드(RegionalRankCard, MyRestaurantCard, WishlistItemCard)를 `src/components/common/place-list-row.tsx` 하나로 통합 완료 (2026-05-21).

**Why:** 동일한 가로행 레이아웃을 중복 구현하던 문제 해소. variant prop으로 좌측 머리(메달/북마크버튼)·중앙 슬롯·우측 평점 컬럼을 분기.

**How to apply:**
- `PlaceListRowData` 인터페이스가 세 variant의 슈퍼셋 — optional 필드로 구성
- `toPlaceListRowData(RegionalRankEntry)` 어댑터: `avgScore → myAvgScore` 매핑 주의
- `toPlaceListRowDataFromDetail(RestaurantDetail, opts)` 어댑터: wishlist 전용, `photos[0]` fallback 포함
- `ScoreStars`, `RankMedal`을 신규 common 컴포넌트로 추출해 중복 제거
- `RankCardSkeleton` / `RankCardSkeletonGrid`도 가로행 레이아웃으로 재작성
- 주요 미해결 이슈: bookmark overlay 버튼 모바일 tap target `w-9 h-9` (36px < 44px), `my` variant에서 세부 점수 숫자에 `font-numeric` 미사용, `wishlist` variant는 rank 슬롯이 없어서 `my` variant에서 `rank`가 undefined인 경우 RankMedal이 `0`을 렌더
