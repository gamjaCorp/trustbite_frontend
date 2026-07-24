# CLAUDE.md

## 프로젝트 개요

**TrustBite** — 신뢰도 기반 맛집 지도 서비스의 프론트엔드. 핵심 가치: 내 맛집 지도 > 신뢰도 평가(trustScore) > 공유 지도 — 상세는 `docs/PRD.md`.

- 화면 기획·API 계약: `docs/spec/{페이지}/`

## Git 커밋 규칙

- 사용자 명시 요청 없이 커밋 금지.
- 커밋 author는 항상 Boram Kim — Claude를 author/contributor에 추가 금지.
- 커밋 메시지에 `Day N`·`Week N` 표기 금지. 변경 내용만.

## 개발 커맨드

패키지 매니저는 **pnpm** 고정.

```bash
pnpm dev               # Next 개발 서버 (http://localhost:3000)
pnpm build             # 프로덕션 빌드
pnpm lint / lint:fix   # ESLint (flat config, eslint.config.mjs)
pnpm storybook         # Storybook (port 6006)
pnpm design:check      # 디자인 토큰 일관성 체크
npx tsc --noEmit       # 타입 검사
```

## 스택

- **스타일** — Tailwind CSS v4 + OKLCH. shadcn/ui `src/components/ui/` **직접 수정 금지**. 작성 규칙 → **`ui-ux-expert` 스킬** 참조.
- **상태/데이터** — **서버 읽기는 native fetch + Next 캐시**. React Query는 검색·낙관적 토글 등 클라 인터랙션 한정. axios 미사용.
- **지도** — Kakao Maps JS SDK (`NEXT_PUBLIC_KAKAO_MAP_APP_KEY`)
- **인증** — NextAuth v5 (`src/auth.ts`, 미들웨어 alias `src/proxy.ts`)
- **번들러** — Turbopack. webpack 설정 추가 금지.
- **테스팅** — vitest 셋업 유지. 테스트 코드 작성 후순위.
- **Path alias** — `@/*` → `./src/*`
- **새 라이브러리 설치 금지** — 기존 deps로 해결 가능한지 먼저 확인.

## 아키텍처 (디렉터리 구조·네이밍 컨벤션)

@rules/architecture.md

## 1차 MVP 범위

MVP 미포함 코드 위에 표시:

```ts
// TODO: 1차 MVP 제외 — <이유 또는 기능명>
```

## 로드맵 실행 규칙 (`docs/plan/roadmap1/week-{N}.md`)

task 실행·진행·보고 규칙은 아래 rule 파일로 분리:

@rules/roadmap-task-execution.md
