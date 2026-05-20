# CLAUDE.md

## 프로젝트 개요

**TrustBite** — 신뢰도 기반 맛집 지도 서비스의 프론트엔드.
"나만의 맛집 지도를 만들고, 믿을 수 있는 사람들과 함께 완성하는 플랫폼"
기획 전문은 `docs/PRD.md`에 있다.

### 핵심 가치 (우선순위 순)

1. **내 맛집 지도 만들기** — 내 기준으로 기록하고 순위를 매기는 경험
2. **신뢰도 기반 평가** — trustScore가 높을수록 리뷰 영향력 증가
3. **함께 만드는 맛집 지도** — 친구·동료와 공유 지도

## Git 커밋 규칙

**사용자의 명시적 요청 없이 커밋하지 않는다.** 코드를 수정하거나 파일을 생성한 뒤에도 커밋은 사용자가 직접 요청할 때만 수행한다.

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

## 스택

- **Framework** — Next.js (App Router) + React + TypeScript (strict)
- **스타일** — Tailwind CSS v4 (토큰: `src/app/globals.css` `@theme inline` + OKLCH CSS 변수). shadcn/ui new-york, `baseColor: neutral` (`src/components/ui/` — 직접 수정 금지). 작성 규칙은 **`ui-ux-expert` 스킬** 참조.
- **상태/데이터** — React Query 5 (+ devtools, react-table), Zustand 5
- **지도** — Kakao Maps JS SDK (`NEXT_PUBLIC_KAKAO_MAP_KEY` env, `next/script` 동적 로드)
- **차트** — Recharts (레이더 차트, 바 차트)
- **폼** — React Hook Form + Zod + `@hookform/resolvers/zod` + shadcn `form.tsx` (`form.tsx`는 신규 폼 시 `pnpm dlx shadcn@latest add form`)
- **UX 유틸** — next-themes(다크모드), sonner(toast), date-fns + react-day-picker, embla-carousel, react-resizable-panels
- **인증** — NextAuth v5 (`src/auth.ts`, 미들웨어 alias `src/proxy.ts`)
- **번들러** — Turbopack (Next 기본, dev/build 모두). webpack 설정 추가 금지
- **테스팅** — vitest 셋업 유지. 테스트 코드 작성은 후순위
- **Path alias** — `@/*` → `./src/*`

## 디렉터리 구조

```
src/app                          Next App Router
src/components/{core,ui}         core는 ui/ 프리미티브를 감싸는 공통 컴포넌트에 한정. 그 외 중복은 features/(가까운 도메인) 또는 common/에 둔다. ui는 shadcn (직접 수정 금지)
src/api/<feature>/<feature>.ts   axios 래퍼 (feature별 하위 폴더)
src/hooks/<feature>/use-*.ts     React Query 훅 (feature별 하위 폴더)
src/stores/<name>-store.tsx      Zustand + Context 스토어
src/lib                          utils.ts(cn), axios.ts, types/<feature>/{request,response,type,schema}.ts
src/stories/{PascalCase}.stories.tsx  모든 스토리가 평탄하게 여기 모임
src/auth.ts + src/proxy.ts       NextAuth v5 (proxy는 middleware alias)
```

**재사용 우선순위**: 무언가 만들기 전에 `core/` → `ui/` → 신규 생성 순서로 탐색한다. 리뷰어 에이전트가 이 순서를 체크한다.

## 네이밍·Import 컨벤션

깨면 frontend-code-reviewer가 지적한다.

- **파일/폴더명 kebab-case**. 컴포넌트 폴더는 `index.tsx` barrel. 배럴에서 import할 때는 `/index` suffix를 명시.
- **훅/함수는 named export**. default export는 React 컴포넌트나 Next.js 규약(`page.tsx`, `layout.tsx`)이 요구할 때만.
- **Import 순서**: React → 3rd-party → `@/*` → 상대경로.
- **주석/스토리 설명/toast 문구는 한국어**.
- **컴포넌트 함수 위에는 한 줄 설명 주석을 단다** — 어떤 컴포넌트인지 한국어로 간단히 적는다 (예: `// 신뢰도 점수를 배지 형태로 표시`).
- **허가되지 않은 새 라이브러리 설치 금지** — 기존 deps로 해결 가능한지 먼저 확인.
- **`any` 지양**. 명시적으로 허용한 경우 외에는 타입을 정의한다.

## 1차 MVP 범위

1차 MVP에 포함되지 않는 코드(기능, 컴포넌트, 로직)는 해당 코드 바로 위에 아래 주석을 달아 표시한다.

```ts
// TODO: 1차 MVP 제외 — <이유 또는 기능명>
```

주석이 달린 코드는 구현은 완료되어 있어도 MVP 릴리스에 노출/활성화하지 않는다.

## 태스크 완료 후 체크리스트 업데이트

태스크를 완료하면 사용자에게 확인 후 `docs/plan/` 내 해당 체크리스트 항목을 체크(`- [x]`)한다.
