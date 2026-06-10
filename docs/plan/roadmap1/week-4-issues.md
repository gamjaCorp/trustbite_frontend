# Week 4 Issues

- 글로벌 헤더에서 `pathname.startsWith('/restaurant/')·('/user/')` 조건부 숨김 처리 → 정석은 중첩 레이아웃으로 분리 (`app/restaurant/[id]/layout.tsx`, `app/user/[id]/layout.tsx` 에 백 헤더 배치, 루트 layout에서 글로벌 헤더 제거). back-header 관련 작업 시 같이 정리.
