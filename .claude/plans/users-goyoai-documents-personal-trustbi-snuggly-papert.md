# CLAUDE.md 정리

## Context

현재 `.claude/CLAUDE.md`는 필요한 정보를 대부분 담고 있으나 (1) 섹션 간 정보 밀도가 고르지 않고, (2) 일부 항목이 저장소 현재 상태와 어긋나 있어 정갈하게 다듬을 필요가 있다. 사용자는 "구조 재정렬 + 스테일 정보 갱신" 범위를 골랐고, 미생성 디렉터리는 다이어그램에 남기되 `# 미생성` 주석으로 명시, rough edges는 사실 보정 후 유지하기로 했다.

## 수정 대상 파일

- `/Users/goyoai/Documents/personal/trustbite_frontend/.claude/CLAUDE.md` (단일 파일)

## 스테일 항목 (검증 결과)

1. `src/stories/Page.tsx`의 unescaped quote 에러 — **이미 수정됨**. rough edges에서 제거.
2. `src/hooks/` — `use-mobile.ts`(shadcn 동봉) 존재. 문서에 누락 → 디렉터리 다이어그램에 반영.
3. `src/components/ui/` 37개 — 수치는 정확하지만 "설치돼 있다"는 표현이 오해를 부를 수 있음. "shadcn new-york 기본 셋 전량(37개) 가져옴"으로 명확화.
4. `src/api/`, `src/stores/`, `src/components/core/`, `src/lib/types/`, `src/lib/axios.ts` — 모두 미생성. 다이어그램에 `# 미생성` 주석 부착.

## 재정렬 방향 (섹션 순서와 그룹핑)

현재 구조 유지하되 그룹 경계를 또렷하게:

1. **프로젝트 개요** — 그대로 (한 줄)
2. **개발 커맨드** — `pnpm` 명령어 표 그대로 두되, Vitest 관련 문단은 별도 하위 블록(`### 테스트`)으로 분리해 스캔 가능하게.
3. **스택** — 현재 bullet 4개를 카테고리로 묶어서 재배치:
   - Framework (Next/React/TS)
   - 스타일 (Tailwind v4, shadcn/ui)
   - 상태/데이터 (React Query, Zustand)
   - UX 유틸 (next-themes, sonner, date-fns + react-day-picker, embla, resizable-panels)
   - 기타 (Path alias)
4. **디렉터리 구조** — 다이어그램에 `# 미생성` 주석 명시. 바로 아래 "재사용 우선순위" 한 줄 유지.
5. **컨벤션** — 현재 bullet 그대로 유지 (이미 정돈됨).
6. **기능별 패턴 포인터** — 현재 `### API 훅`, `### Zustand + Context 스토어` 를 이 상위 섹션으로 묶기. "세부는 SKILL.md가 정본" 패턴을 반복 제거하고 한 번만 상단에서 선언.
7. **알려진 rough edges** — Page.tsx 항목 제거, sidebar.tsx Math.random 유지, README 항목 유지.

## 유지해야 할 불변 속성

- 전체 언어는 한국어, 굵게/백틱 스타일 그대로.
- 파일 경로는 백틱으로 감싸기.
- 외부 SKILL.md 포인터 형식(`**.claude/skills/.../SKILL.md가 정본**`) 유지 — 프로젝트의 다른 문서들이 이 관용구에 의존.
- 섹션 헤딩 레벨(`##`, `###`) 유지 — 상위 툴링이 heading 레벨로 파싱할 수 있음.

## 검증

편집 후 다음을 확인:

1. 렌더링: 에디터에서 마크다운 프리뷰로 헤딩/리스트/코드블록 깨짐 없는지 눈으로 확인.
2. 경로 팩트체크: 다이어그램에 언급된 모든 경로가 현재 저장소 상태(존재/미존재)와 일치하는지 재확인.
3. 외부 링크: `.claude/skills/register-api-hook/SKILL.md`, `.claude/skills/zustand-context-store/SKILL.md`, `docs/PRD.md` 세 경로가 실제로 존재하는지 확인(Explore 보고에서 앞 두 개는 확인 완료, `docs/PRD.md`는 추가 확인 필요).
4. 내용 드리프트 방지: 새 항목은 추가하지 않고, 기존 항목만 재배치/삭제/보정.
