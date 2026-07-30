---
description: 이번 task에 한해 Learn by Doing 생략(로드맵 task 대상) — now 인자 시 채팅 요청 범위만 즉시 구현
---

`$ARGUMENTS`의 첫 토큰이 `now`이면 아래 `## now 모드`를 따른다. 그 외에는 기본 모드를 따른다.

## 기본 모드

이번 task는 **Learn by Doing 예외**다. 사용자에게 단계별 코드 작성을 요청하지 말고, Claude가 구현 코드를 직접 작성한다.

- `rules/roadmap-task-execution.md`의 `## Learn by Doing` 규칙은 이 task에 한해 적용하지 않는다 (일회성).
- 그 외 규칙은 유지: `## 실행 단위`의 task 1개 단위 + build/lint 확인, 종료 후 `## 2단 ask`.
- 다음 task부터 자동으로 Learn by Doing으로 복귀한다.

## now 모드

로드맵 task가 아니라 **직전 채팅에서 요청한 범위 하나**만 즉시 고친다. `now` 뒤에 이어지는 토큰이 있으면 그것이 수정 요청 본문이다 — 없으면 바로 위 사용자 메시지가 요청 범위다.

- 대상은 사용자가 지목한 파일·함수·증상 하나로 한정한다. `docs/plan/roadmap1/week-{N}.md`는 열거나 매칭하지 않는다.
- `rules/roadmap-task-execution.md`의 `## Learn by Doing`은 적용하지 않는다 — Claude가 직접 구현한다.
- `## 실행 단위`는 "task 1개"가 아니라 "요청 1개" 단위로 대체 적용. build/lint 확인(`pnpm build`·`pnpm lint`)은 그대로 수행한다.
- `## task 완료 보고 형식`(3단 리포트) 대신 변경 파일과 수정 내용을 몇 줄로 짧게 보고한다. `🔜 다음 task`·`week-{N}.md` 체크·`issues.md` 기록은 대상이 없으므로 생략한다.
- `## 2단 ask`는 수행하지 않는다 — 요청한 수정이 끝나면 그대로 멈춘다.
- 요청 범위 밖에서 개선점을 발견해도 고치지 않는다. 한 줄로만 언급한다.
- 일회성 — 다음 요청부터 Learn by Doing 및 기본 모드로 자동 복귀한다.

$ARGUMENTS
