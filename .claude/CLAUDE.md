# CLAUDE.md

## 프로젝트 개요

**TrustBite** — 신뢰도 기반 맛집 지도 서비스의 프론트엔드.
"나만의 맛집 지도를 만들고, 믿을 수 있는 사람들과 함께 완성하는 플랫폼"
기획 전문은 `docs/PRD.md`에 있다.

### 핵심 가치 (우선순위 순)

1. **내 맛집 지도 만들기** — 내 기준으로 기록하고 순위를 매기는 경험
2. **신뢰도 기반 평가** — trustScore가 높을수록 리뷰 영향력 증가
3. **함께 만드는 맛집 지도** — 친구·동료와 공유 지도

### 디자인 톤

토스·당근마켓 스타일 — 둥글고 친근하게. 컬러·타이포는 **스타일 규칙** 섹션의 토큰을 따른다.

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

- **Framework** — Next.js 16.2.4 App Router + React 19.2.3 + TypeScript 5 (strict)
- **스타일**
  - **Tailwind CSS v4** — 모든 토큰은 `src/app/globals.css`의 `@theme inline` 블록 + CSS 변수(OKLCH)로 정의.
  - **shadcn/ui** (new-york, `baseColor: neutral`) — 기본 셋 전량 37개를 `src/components/ui/`에 소스로 가져왔다. shadcn CLI가 `src/app/globals.css`를 토큰 소스로 참조한다.
  - 작성 규칙은 **스타일 규칙** 섹션 참조.
- **상태/데이터** — React Query 5 (+ devtools, react-table), Zustand 5
- **지도** — Kakao Maps JS SDK (`NEXT_PUBLIC_KAKAO_MAP_KEY` env, `next/script` 동적 로드)
- **차트** — Recharts (레이더 차트, 바 차트)
- **폼** — React Hook Form + Zod + `@hookform/resolvers/zod` + shadcn `form.tsx` (W2 Day 2 도입)
- **UX 유틸** — next-themes(다크모드), sonner(toast), date-fns + react-day-picker, embla-carousel, react-resizable-panels
- **인증** — NextAuth v5 (`src/auth.ts`, 미들웨어 alias `src/proxy.ts`)
- **번들러** — Turbopack (Next 16 기본, dev/build 모두). webpack 설정 추가 금지
- **테스팅 인프라** — vitest 4 + Storybook addon-vitest + browser-playwright (`vitest.config.ts` 셋업만 유지). 테스트 코드 작성은 2차 MVP 이후
- **PWA** — 2차 MVP (W5+) 스코프. 1차 MVP에서 manifest, service worker 미포함
- **Path alias** — `@/*` → `./src/*`

## 디렉터리 구조

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

## 폼 작성 규칙 (W2 Day 2부터 적용)

- 입력 폼은 **`react-hook-form` + `zod` + `@hookform/resolvers/zod` (`zodResolver`) + shadcn `Form`** 조합으로 구현한다.
- zod 스키마는 `src/lib/types/<feature>/schema.ts`에 정의한다.
- 에러 메시지는 한국어로 zod 스키마 안에 직접 명시한다.
- **단순 폼** (`/onboarding` 등): 전체 RHF로 구현 (`useForm` + `handleSubmit`).
- **다단계·복합 폼** (`/review/new`): **hybrid** — 단계 전이·선택 상태는 Zustand store가, 필드 검증은 RHF `Controller`가 담당. `handleSubmit(onValid)` → mutation 호출.
- `any` 제거 금지. 검증 실패 메시지는 shadcn `<FormMessage>`로 표시한다.

## 스타일 규칙

Tailwind 클래스와 `src/app/globals.css`의 토큰만으로 스타일링한다. frontend-code-reviewer가 아래 규칙을 검사한다.

### Tailwind 사용 원칙

- **Tailwind 클래스만 사용한다.** 별도 `.css`/`.module.css` 파일 생성 금지. `style={{ ... }}` 인라인 스타일은 동적 계산값이 아닌 이상 지양한다.
- 조건부 클래스는 `cn()` (`src/lib/utils.ts` — `clsx` + `tailwind-merge`)로 합친다.

### `globals.css` 편집 정책

`src/app/globals.css`는 **토큰 추가 외에는 변경하지 않는다.**

### 크기·간격

- **Tailwind 단위 우선** (`p-4`, `gap-2`, `w-full`등).
- 임의 픽셀 값(`p-[13px]`, `w-[247px]` 같은 arbitrary value)은 **Tailwind 단위로 대체할 수 없을 때만** 허용한다.

### 컬러

`src/app/globals.css`의 토큰을 유틸리티 클래스로 참조한다. hex/oklch 값을 클래스 안에 직접 쓰지 않는다.

- 브랜드: `bg-primary`, `text-primary-foreground`, `bg-primary-subtle`
- 시맨틱: `text-success`, `bg-warning`, `border-error`, `text-info`
- Palette: `bg-palette-red`, `text-palette-amber`, `bg-palette-blue-subtle` 등 6 hue (brand/green/amber/blue/red/gray)
- 중립: `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`

### 디자인 토큰 사용 규약

- **palette**(`bg-palette-red` 등)는 색 자체. UI 의미가 있으면 시맨틱 토큰(`bg-primary`, `text-success`/`error` 등) 우선.
- **도메인 매핑**(카테고리·등급 → 색)은 `src/lib/category.ts`·`src/lib/trust-score.ts`에서만. 컴포넌트 className에 `text-grade-s` 같은 도메인 의미를 직접 박지 말 것.
- `pnpm design:check`로 `.designcheckrc.json` include 영역의 raw hex/rgb를 자동 검출. PR 머지 전 그린이어야 함.

### 타이포그래피

- **본문**: `font-sans` (Pretendard Variable) — body에 기본 적용되므로 명시 불필요.
- **숫자**: `font-numeric` 유틸리티 — 점수·좌표·거리처럼 자릿수 정렬이 필요한 곳.
- **제목/본문 바리에이션**: 임의로 `text-[18px] font-bold tracking-tight`처럼 조합하지 않는다. 반복되는 타이포 조합은 `globals.css`의 `@utility` 블록으로 **시맨틱 이름**(예: `text-title-h5`, `text-body-md`)으로 승격시키고, 컴포넌트는 이름만 참조한다. 새 타이포 유틸리티가 필요하면 거기에 추가한다.

## 네이밍·Import 컨벤션

깨면 frontend-code-reviewer가 지적한다.

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
