# CLAUDE.md

## 프로젝트 개요

**TrustBite** — 신뢰도 기반 맛집 평가 서비스의 프론트엔드. 기획 전문은 `docs/PRD.md`에 있다.

## 개발 커맨드

패키지 매니저는 **pnpm** 고정.

```bash
pnpm dev               # Next 개발 서버 (http://localhost:3000)
pnpm build             # 프로덕션 빌드
pnpm start             # 빌드된 서버 실행
pnpm lint              # ESLint (flat config, eslint.config.mjs)
pnpm lint:fix          # lint --fix
pnpm storybook         # Storybook 개발 (port 6006)
pnpm build-storybook   # Storybook 정적 빌드
npx tsc --noEmit       # 타입 검사 (스크립트 없음 — 수동 실행)
```

### 테스트

Vitest는 **Storybook stories를 browser-mode(Playwright Chromium)로 돌리는 세팅**이다 (`vitest.config.ts`). `pnpm test` 스크립트는 아직 없고, 실행이 필요하면 `pnpm exec vitest`를 직접 호출한다. 애플리케이션 테스트는 아직 작성돼 있지 않으므로 패턴은 처음 추가하는 쪽이 정립한다.

## 스택

- **Framework** — Next.js 16.2.4 App Router + React 19.2.3 + TypeScript 5 (strict)
- **스타일**
  - **Tailwind CSS v4** — `tailwind.config.*` 없음. 모든 토큰은 `src/app/globals.css`의 `@theme inline` 블록 + CSS 변수(OKLCH)로 정의. 색상 추가는 여기에만, 컴포넌트에서는 유틸리티 클래스로만 참조.
  - **shadcn/ui** (new-york, `baseColor: neutral`) — 기본 셋 전량 37개를 `src/components/ui/`에 소스로 가져왔다. shadcn CLI가 `src/app/globals.css`를 토큰 소스로 참조하므로 globals.css 구조를 임의로 뒤섞지 말 것.
- **상태/데이터** — React Query 5 (+ devtools, react-table), Zustand 5
- **UX 유틸** — next-themes(다크모드), sonner(toast), date-fns + react-day-picker, embla-carousel, react-resizable-panels
- **인증** — NextAuth v5 (`src/auth.ts`, 미들웨어 alias `src/proxy.ts`)
- **Path alias** — `@/*` → `./src/*`

## 디렉터리 구조

프로젝트 스킬(`.claude/skills/`)이 강제하는 구조. `# 미생성` 표시가 붙은 경로는 아직 파일이 없고, 해당 기능을 처음 추가하는 쪽이 생성한다.

```
src/
├── app/                          # Next App Router
├── api/<feature>/<feature>.ts    # axios 래퍼                 # 미생성
├── hooks/
│   ├── use-mobile.ts             # shadcn 동봉
│   └── <feature>/use-*.ts        # React Query 훅             # 미생성
├── stores/<name>-store.tsx       # Zustand + Context 스토어   # 미생성
├── components/
│   ├── core/                     # 도메인 컴포넌트 (kebab-case 폴더 + index.tsx)
│   │   └── providers/            # React Query / next-themes / sonner 루트 Provider
│   └── ui/                       # shadcn 컴포넌트 — 원칙적으로 직접 수정 금지
├── lib/
│   ├── utils.ts                  # cn() (clsx + tailwind-merge)
│   ├── axios.ts                  # 첫 API 훅 추가 시 함께 생성  # 미생성
│   └── types/<feature>/{request,response,type}.ts             # 미생성
├── stories/{PascalCase}.stories.tsx  # 모든 스토리가 평탄하게 여기 모임
├── auth.ts                       # NextAuth v5 (providers, handlers, auth, signIn, signOut)
└── proxy.ts                      # `auth`를 `proxy`로 재수출 (middleware용 alias)
```

**재사용 우선순위**: 무언가 만들기 전에 `core/` → `ui/` → 신규 생성 순서로 탐색한다. 리뷰어 에이전트가 이 순서를 체크한다.

## 컨벤션 (깨면 frontend-code-reviewer가 지적함)

- **파일/폴더명 kebab-case**. 컴포넌트 폴더는 `index.tsx` barrel. 배럴에서 import할 때는 `/index` suffix를 명시.
- **훅/함수는 named export**. default export는 React 컴포넌트나 Next.js 규약(`page.tsx`, `layout.tsx`)이 요구할 때만.
- **Import 순서**: React → 3rd-party → `@/*` → 상대경로.
- **Tailwind 클래스만 사용**. 별도 `.css` 파일 생성 금지, `globals.css` 토큰 영역 외 수정 금지 (`@theme inline` 안쪽 추가는 OK).
- **텍스트 최소 크기 12px (`text-xs`) 이상**. `text-[10px]`, `text-[11px]` 같이 12px 미만의 임의값 금지. 가독성 기준선.
- **Tailwind 스케일 토큰 우선, `[px]` 임의값은 최소화**. 간격/크기/폰트는 `gap-3`, `p-4`, `text-sm`, `h-9`, `w-10` 같이 스케일에서 고르고, 스케일에 없는 값이 꼭 필요하면 먼저 `globals.css`의 `@theme inline`에 토큰으로 추가하는 걸 고려한다. `top-[97px]`처럼 특정 값이 불가피할 때만 `[...]` 사용, 그 경우에도 주석으로 의도 남김.
- **`globals.css`는 수정 금지** — 색상/라운딩/그림자 토큰 추가·변경이 필요하면 먼저 사용자에게 질문한 뒤 진행한다. 임의로 토큰을 바꾸면 shadcn 컴포넌트 전체에 영향이 간다.
- **주석/스토리 설명/toast 문구는 한국어**.
- **허가되지 않은 새 라이브러리 설치 금지** — 기존 deps로 해결 가능한지 먼저 확인.
- **`any` 지양**. 명시적으로 허용한 경우 외에는 타입을 정의한다.

## 기능별 패턴

세부 규약은 각 스킬 문서가 **정본**이며, 해당 스킬은 트리거 키워드로 자동 적용된다. 아래는 포인터만.

### API 훅 (`@/api` + `@/hooks`)

백엔드 엔드포인트를 받아 axios 래퍼(`src/api/<feature>/<feature>.ts`)와 React Query 훅(`src/hooks/<feature>/use-*.ts`)을 생성하는 규약이다. 명명 규칙, axios/toast 단일 import 경로, queryKey 계층, useQuery 기본값, mutation 반환 키 매트릭스 등은 `.claude/skills/register-api-hook/SKILL.md` 참조 (트리거: "API/api").

> 첫 API 추가 시 `src/lib/axios.ts`를 함께 만들어야 한다.

### Zustand + Context 스토어 (`src/stores/<name>-store.tsx`)

여러 컴포넌트가 공유하되 **서브트리 스코프로 한정**하고 싶은 상태에만 사용한다. 단일 컴포넌트 UI 상태는 `useState`. State/Action 분리, selector hook export, Provider 바깥 throw 등 패턴 상세는 `.claude/skills/zustand-context-store/SKILL.md` 참조.

## 알려진 rough edges

신규 진입 시 혼란을 줄이기 위한 현황:

- `README.md`는 create-next-app 기본값. 프로젝트 정보는 이 파일(CLAUDE.md)과 `docs/PRD.md`를 우선한다.
- `pnpm lint` 실행 시 `src/components/ui/sidebar.tsx`의 `Math.random()`(shadcn 원본) 에러가 남아 있다. shadcn 유지 정책이 정해지기 전까지는 고치지 않는 쪽이 기본.
