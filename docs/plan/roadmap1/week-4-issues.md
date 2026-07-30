# Week 4 Issues

- 글로벌 헤더에서 `pathname.startsWith('/restaurant/')·('/user/')` 조건부 숨김 처리 → 정석은 중첩 레이아웃으로 분리 (`app/restaurant/[id]/layout.tsx`, `app/user/[id]/layout.tsx` 에 백 헤더 배치, 루트 layout에서 글로벌 헤더 제거). back-header 관련 작업 시 같이 정리.
- `trustScore` 스케일 경계: 백엔드 `MyProfileResponse.trustScore`는 `0.0~1.0`, 화면(`GRADE_LEVELS.trustMin`, `CurrentGradePanel`/`NextStagePanel` prop)은 `0~100`. 소비하는 컴포넌트에서 `Math.round(trustScore * 100)`로 변환 필수 — 안 하면 0.55가 100%로 읽혀 최고 톤/조건 충족으로 잘못 표시됨. 나머지 화면(Day 3~6)에서도 동일하게 적용할 것.
- `/profile`은 세션 없이 접근해도 미들웨어(`src/proxy.ts`)가 리다이렉트하지 않음 — 페이지 자체가 `getMyProfile()` 실패를 캐치해 에러 상태를 렌더하는 식으로 방어함. 로그인 필요 페이지에 대한 정식 auth-gate 리다이렉트 패턴은 아직 없음 (필요 시 별도 정리).
- 등급 사다리(`GET /api/grades`) 연동은 `GradeGuideCard`·`CurrentGradePanel`·`NextStagePanel`·`AllGradesTimeline`이 모두 같은 `mergeGradeLadder` 결과를 공유하도록 배선 완료. 단 `page.tsx`의 `if (!profile || !grades)`는 아직 분리 안 됨 — 지금은 `/api/grades` 실패 시 폴백(등급 카드만 "정보를 불러올 수 없어요") 대신 프로필 전체가 에러 화면으로 빠짐.
- `GRADE_LEVELS`가 로컬 표현(라벨·아이콘·색·condition) 전용으로 축소되면서 `rank`/`reviewMin`/`trustMin`이 로컬에 없어졌다 — 서버 `grade`(이름 문자열)를 그 자리에서 얻을 수 없는 호출부(`review-card.tsx`·`user-profile-header.tsx`·`back-header.tsx`·`follow-user-row.tsx`·`grade-progress-card.tsx`)는 등급 이름을 `'COLLECTOR'` 고정값으로 임시 처리(`// Fix: 등급 이름 필요` 주석). 해당 화면(Day 3·5·6)에서 실 등급 이름을 조회할 수 있게 되면 정리 필요.
