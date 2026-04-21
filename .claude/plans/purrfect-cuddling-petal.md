# CLAUDE.md 슬림화 (옵션 A: 확실한 중복만 제거)

## Context
방금 작성한 `/Users/goyoai/Documents/personal/trustbite_frontend/CLAUDE.md`를 다시 보니 `.claude/skills/*/SKILL.md`·에이전트 정의 파일과 중복되는 내용이 있다. 해당 파일들은 스킬/에이전트가 실행될 때 자동 로드되므로 CLAUDE.md에 재서술할 필요가 없다. 중복을 덜어내 문서의 스캔 속도를 높이고 진실의 소재를 단일화하는 게 목표다.

아직 휘발성이 남아있는 항목(스택 리스트, 잘 안 쓰는 커맨드, 일반 컨벤션)은 이번에 손대지 않는다 — 옵션 A 범위.

## 수정 대상: `CLAUDE.md` 단일 파일

### 제거 1) "### API 훅 (`@/api` + `@/hooks`)" 섹션 블록 축소
- 현재: 스킬 안내 2줄 + 세부 규칙 10줄(함수명 verb-first, axios/toast 단일 import, queryKey 계층, useQuery 기본값, 리스트 가공, mutation 반환 키 등)
- 변경 후: 스킬 안내 2~3줄만 남김. 세부 규칙은 `.claude/skills/register-api-hook/SKILL.md`가 정본임을 명시.
- 근거: 해당 규칙은 SKILL.md에 그대로 존재. 스킬이 트리거되면 Claude가 자동으로 로드.

### 제거 2) "### Zustand + Context 스토어 (`src/stores/<name>-store.tsx`)" 섹션 블록 축소
- 현재: 스킬 안내 + 4개 bullet(State/Action 분리, action 네임스페이스, selector hook export, Provider 바깥 throw)
- 변경 후: 스킬 안내 + "서브트리 스코프 상태에만 사용" 1줄(적용 판단 기준)만 남김.
- 근거: 상세 패턴은 `zustand-context-store/SKILL.md`에 있음. "언제 쓰는가"만 CLAUDE.md에 남겨서 스킬 로드 전 판단을 돕는 용도로 제한.

### 제거 3) "스킬 트리거 키워드" 리스트 제거 (Claude Code 설정 섹션 내부)
- 현재:
  ```
  - 스킬 트리거 키워드:
    - "API / api" 포함 → register-api-hook
    - "스토리 만들어줘 / 스토리북 생성" → generate-story
    - "store / zustand / Provider / 뷰 스코프 상태" → zustand-context-store
  ```
- 변경 후: 블록 전체 삭제. 대신 "프로젝트 전용 스킬이 3개 있다(`register-api-hook`, `generate-story`, `zustand-context-store`) — 각 SKILL.md의 `description`이 트리거 규칙의 정본" 1줄로 대체.
- 근거: 트리거 키워드는 각 SKILL.md 프론트매터에 있고 스킬 로더가 자동 매칭함. 여기 옮겨 적으면 두 곳을 동기화해야 함.

### 제거 4) 에이전트 메모리 경로 언급 제거
- 현재: "에이전트 메모리: `.claude/agent-memory/frontend-code-reviewer/`."
- 변경 후: 줄 삭제.
- 근거: `frontend-code-reviewer.md` 정의 파일 하단에 이미 명시돼 있음. 에이전트가 호출되면 그 파일이 로드됨.

### 제거 5) "알려진 rough edges"의 layout.tsx metadata 항목 제거
- 현재: "- `src/app/layout.tsx`의 `metadata`가 `"Create Next App"` 그대로다. 프로젝트명 세팅 작업 시 같이 고친다."
- 변경 후: 해당 bullet만 삭제. 나머지 rough edges 항목(README 기본값, lint 에러)은 유지.
- 근거: 파일 열면 바로 보이는 placeholder고 쉽게 수정됨. 문서 수명이 짧은 항목.

## 건드리지 않는 것 (옵션 B로 넘김)
- "스택 핵심"의 라이브러리 나열 — toast/state/data-fetching 선택은 컨벤션에 영향을 줘서 유지가 안전
- `pnpm start`, `pnpm build-storybook` 커맨드 — 자주 안 써도 레퍼런스로 유지
- 컨벤션의 Import 순서, `any` 지양 — 리뷰어 에이전트가 체크하는 항목이라 명시 유지
- 인증/Storybook/rough edges의 나머지 — 모두 비중복이며 실질 정보

## Verification
1. `CLAUDE.md`를 다시 읽어서 위 5개 항목이 사라졌는지 확인
2. 남은 내용에 "SKILL.md 참조" 포인터가 각 스킬 도메인마다 정확히 하나씩 있는지 확인 (API / Zustand / Storybook-generate-story)
3. 문서 전체 길이가 눈에 띄게 줄었는지 확인 (대략 20~30% 축소가 예상치)
4. `.claude/skills/*/SKILL.md`, `.claude/agents/frontend-code-reviewer.md` 파일은 **수정하지 않음** — 진실의 소재를 그쪽에 몰아두는 게 이번 작업의 핵심
