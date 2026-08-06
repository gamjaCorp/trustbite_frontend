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

- **스타일** — Tailwind CSS v4 + OKLCH. shadcn/ui `src/components/ui/` 수정은 **사전 승인 필요** (아래 `## ui/ 수정 절차`). 작성 규칙 → **`ui-ux-expert` 스킬** 참조.
- **상태/데이터** — **서버 읽기는 native fetch + Next 캐시**. React Query는 검색·낙관적 토글 등 클라 인터랙션 한정. axios 미사용.
- **지도** — Kakao Maps JS SDK (`NEXT_PUBLIC_KAKAO_MAP_APP_KEY`)
- **인증** — NextAuth v5 (`src/auth.ts`, 미들웨어 alias `src/proxy.ts`)
- **번들러** — Turbopack. webpack 설정 추가 금지.
- **테스팅** — vitest 셋업 유지. 테스트 코드 작성 후순위.
- **Path alias** — `@/*` → `./src/*`
- **새 라이브러리 설치 금지** — 기존 deps로 해결 가능한지 먼저 확인.

## ui/ 수정 절차

`src/components/ui/`는 **기본적으로 손대지 않는다.** 다만 금지가 아니라 **승인제**다 — 근거를 제시하고 허락을 받은 뒤 수정한다.

**왜 조심하는가 (실제 사례).** `ui/button.tsx` 커밋 `4dfa74d`에서 다른 컴포넌트를 추가하다가 `cursor-pointer` 커스터마이징이 **조용히 지워졌다.** shadcn CLI가 파일을 통째로 덮어쓰기 때문이다. 컴파일도 통과하고 리뷰에도 안 걸린다. 이후 같은 요구는 `globals.css`의 `@layer base`에서 다시 해결됐다.

**수정을 제안하기 전에 아래 순서로 먼저 검토한다.**

1. **토큰 층에서 되는가** — 색·radius처럼 CSS 변수로 흐르는 값은 `globals.css`에서 바꾼다. 여기서 바꾸면 `ui/` 39개 전체에 함께 적용되는 게 오히려 장점이다.
2. **전역 CSS로 되는가** — `@layer base`의 요소 셀렉터로 풀리는가 (위 `cursor-pointer` 사례).
3. **`core/` 래퍼로 되는가** — 높이·타이포·신규 prop처럼 클래스/구조 층의 변경.
4. 셋 다 안 되면 그때 `ui/` 수정을 제안한다.

**제안할 때 함께 제시할 것.**

- 위 1~3이 왜 안 되는지 (막연히 "불편하다"가 아니라 구체적 이유)
- 덮어쓰기 위험도 — 그 파일을 의존하는 다른 `ui/` 컴포넌트 수, 앞으로 `npx shadcn add`로 받을 가능성
- 되돌리는 비용 — 덮어써졌을 때 알아차릴 방법이 있는가

승인 후 수정하면 변경 지점을 `docs/`나 이슈 로그에 남겨, 다음에 덮어써졌을 때 복원할 수 있게 한다.

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
