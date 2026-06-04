# Week 3 이슈 기록

## Day 6 — 공통 컴포넌트 점검 punch list

- `common/trust-score-badge.tsx`: `ui/Badge`가 있는데 inline `<span>`으로 pill 직접 구현 → `ui/Badge` 래핑으로 교체 완료 (재사용 우선순위 위반 수정)
- `common/category-chip-row.tsx`: inline `<button>` pill 사용 중 — 인터랙티브 필터 토글로 대응 `ui/` 프리미티브 없어 현행 유지 결정 → task 2(중복 통합 점검)에서 재검토
- `common/intro-card.tsx`: ranking 단일 feature에서만 사용 → `features/ranking/` 이동 후보 → task 2로 이관
- 함수 위 한 줄 한국어 설명 주석 누락 8건 (`core/select-list`, `common/category-badge`, `common/grade-icon`, `common/trust-score-badge`, `common/trust-score-sheet`, `common/taste-profile-section`, `common/layout/header`, `common/layout/providers`) → Day 6 "접근성·주석" 점검 task에서 일괄 보강 (`trust-score-badge`는 이번에 수정 완료)
- `common/rank-medal.tsx`·`common/category-pin.tsx`: 둘 다 `getRankMedalClasses` 동일 로직 공유, 원형 숫자 렌더 중복 → task 2 중복 통합 후보
- `common/place-list-row.tsx` line 374-382: `<Star>` inline 직접 렌더 — `common/score-stars.tsx`(`ScoreStars`)로 흡수 가능 → task 2 검토
