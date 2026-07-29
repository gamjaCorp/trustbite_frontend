# Week 4 Issues

- 글로벌 헤더에서 `pathname.startsWith('/restaurant/')·('/user/')` 조건부 숨김 처리 → 정석은 중첩 레이아웃으로 분리 (`app/restaurant/[id]/layout.tsx`, `app/user/[id]/layout.tsx` 에 백 헤더 배치, 루트 layout에서 글로벌 헤더 제거). back-header 관련 작업 시 같이 정리.
- `trustScore` 스케일 경계: 백엔드 `MyProfileResponse.trustScore`는 `0.0~1.0`, 화면(`GRADE_LEVELS.trustMin`, `CurrentGradePanel`/`NextStagePanel` prop)은 `0~100`. 소비하는 컴포넌트에서 `Math.round(trustScore * 100)`로 변환 필수 — 안 하면 0.55가 100%로 읽혀 최고 톤/조건 충족으로 잘못 표시됨. 나머지 화면(Day 3~6)에서도 동일하게 적용할 것.
- `/profile`은 세션 없이 접근해도 미들웨어(`src/proxy.ts`)가 리다이렉트하지 않음 — 페이지 자체가 `getMyProfile()` 실패를 캐치해 에러 상태를 렌더하는 식으로 방어함. 로그인 필요 페이지에 대한 정식 auth-gate 리다이렉트 패턴은 아직 없음 (필요 시 별도 정리).
