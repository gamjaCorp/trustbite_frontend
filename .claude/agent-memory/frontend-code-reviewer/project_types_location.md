---
name: project-types-location
description: 타입 파일 실제 위치 — src/lib/types/<domain>/type.ts (commit 459d862에서 재배치)
metadata:
  type: project
---

commit 459d862 "Refactor: 타입 파일 src/types/ → src/lib/types/<도메인>/type.ts 재배치"로 이동 완료.

현재 위치: `src/lib/types/follow.ts`, `src/lib/types/restaurant.ts`, `src/lib/types/user.ts`, `src/lib/types/next-auth.d.ts`

CLAUDE.md에는 `src/types/`로 명시되어 있지만 실제 코드베이스는 `src/lib/types/`를 사용. 리뷰 시 CLAUDE.md 기준이 아닌 실제 경로로 판단.

**Why:** 타입과 도메인 로직을 lib 하위에 함께 관리해 응집도를 높이기 위한 결정.
**How to apply:** 타입 import 경로 지적 시 `src/lib/types/`를 정상으로 간주.
