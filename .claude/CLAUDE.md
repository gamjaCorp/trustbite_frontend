# CLAUDE.md

## 프로젝트 개요

**TrustBite** — 신뢰도 기반 맛집 지도 서비스의 프론트엔드.
"나만의 맛집 지도를 만들고, 믿을 수 있는 사람들과 함께 완성하는 플랫폼"

- 서비스 전체 기획: `docs/PRD.md`
- 페이지별 상세 기획 (레이아웃·인터랙션·API 계약): `docs/spec/{페이지}/`

### 핵심 가치 (우선순위 순)

1. **내 맛집 지도 만들기** — 내 기준으로 기록하고 순위를 매기는 경험
2. **신뢰도 기반 평가** — trustScore가 높을수록 리뷰 영향력 증가
3. **함께 만드는 맛집 지도** — 친구·동료와 공유 지도

## Git 커밋 규칙

- **사용자의 명시적 요청 없이 커밋하지 않는다.** 코드를 수정하거나 파일을 생성한 뒤에도 커밋은 사용자가 직접 요청할 때만 수행한다.
- **커밋 author는 항상 사용자(Boram Kim)여야 한다.** `--author` 플래그나 `Co-authored-by:` 트레일러로 Claude를 author/contributor에 추가하지 않는다.
- **커밋 메시지에 진행 단위(`Day N`, `Week N` 등) 표기 금지.** 변경 내용(무엇이/왜 바뀌었는지)만 적는다. roadmap 매핑은 `docs/plan/roadmap1/week-{N}.md`가 관리한다.

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
pnpm design:check      # 디자인 토큰 일관성 체크 (scripts/design-check.mjs)
npx tsc --noEmit       # 타입 검사 (스크립트 없음 — 수동 실행)
```

## 스택

- **Framework** — Next.js (App Router) + React + TypeScript (strict)
- **스타일** — Tailwind CSS v4 (토큰: `src/app/globals.css` `@theme inline` + OKLCH CSS 변수). shadcn/ui new-york, `baseColor: neutral` (`src/components/ui/` — 직접 수정 금지). 기반 프리미티브: `@base-ui/react` + `radix-ui`. 작성 규칙은 **`ui-ux-expert` 스킬** 참조.
- **상태/데이터** — React Query 5 (+ devtools), Zustand 5. **서버 읽기는 native fetch + Next 데이터 캐시(`next:{tags,revalidate}`), React Query는 검색·낙관적 토글·Kakao SDK 등 클라이언트 인터랙션 한정**. axios 미사용.
- **지도** — Kakao Maps JS SDK (`NEXT_PUBLIC_KAKAO_MAP_APP_KEY` env, `react-kakao-maps-sdk` `useKakaoLoader` 동적 로드)
- **차트** — Recharts (레이더 차트, 바 차트)
- **폼** — shadcn `form.tsx` (추후 React Hook Form + Zod 도입 예정. 신규 폼 시 `pnpm dlx shadcn@latest add form`)
- **UX 유틸** — next-themes(다크모드), sonner(toast), date-fns + react-day-picker, embla-carousel, react-resizable-panels
- **인증** — NextAuth v5 (`src/auth.ts`, 미들웨어 alias `src/proxy.ts`)
- **번들러** — Turbopack (Next 기본, dev/build 모두). webpack 설정 추가 금지
- **테스팅** — vitest 셋업 유지. 테스트 코드 작성은 후순위
- **Path alias** — `@/*` → `./src/*`

## 디렉터리 구조

```
src/app                          Next App Router
src/components/{core,ui}         core는 ui/ 프리미티브를 감싸는 공통 컴포넌트에 한정. 그 외 중복은 features/(가까운 도메인) 또는 common/에 둔다. ui는 shadcn (직접 수정 금지)
src/components/features/<feat>/  feature = 페이지 단위. 진입점 파일은 반드시 index.tsx.
src/components/features/<feat>/hooks/use-*.ts  해당 feature(페이지)에만 쓰이는 훅은 feature 폴더 안 hooks/에 배치.
src/components/features/<feat>/stores/<name>-store.tsx  해당 feature에서만 쓰이는 Zustand + Context 스토어. 여러 feature가 공유하면 src/stores/로 승격.
src/components/features/<feat>/schema.ts       해당 feature에서만 쓰이는 zod schema는 feature 폴더 안에 배치. 여러 feature가 공유하게 되면 그때 src/lib/으로 승격.
src/components/common/          두 개 이상 feature에서 공유하는 컴포넌트. feature에 귀속시키면 교차 의존이 생기는 경우.
src/api/<feature>/<feature>.ts   fetch 기반 API 함수 (publicFetch/authedFetch/Server Action, feature별 하위 폴더)
src/hooks/use-*.ts               여러 feature에서 공유하는 범용 훅 (예: use-debounced-value, use-auth-status, use-mobile)
src/stores/<name>-store.tsx      여러 feature가 공유하는 Zustand + Context 스토어
src/lib                          유틸 함수 (utils.ts/cn, geo.ts, category.ts 등 비즈니스 로직)
src/types                        전역 타입 정의 (restaurant.ts, user.ts, follow.ts 등)
src/data                         개발용 mock 데이터
src/stories/{PascalCase}.stories.tsx  모든 스토리가 평탄하게 여기 모임
src/auth.ts + src/proxy.ts       NextAuth v5 (proxy는 middleware alias)
```

**feature 폴더 네이밍**: `features/<name>`의 `name`은 해당 라우트 세그먼트와 일치시킨다 (루트 `/`는 `home`). 여러 라우트가 공유하는 feature만 도메인 이름(`follow`, `review-write`) 사용.

**재사용 우선순위**: 무언가 만들기 전에 `core/` → `ui/` → 신규 생성 순서로 탐색한다. 리뷰어 에이전트가 이 순서를 체크한다.

## 네이밍·Import 컨벤션

깨면 frontend-code-reviewer가 지적한다.

- **파일/폴더명 kebab-case**. 컴포넌트 폴더는 `index.tsx` barrel. 배럴에서 import할 때는 `/index` suffix를 명시.
- **feature 폴더 진입점은 `index.tsx`**. `src/components/features/<feat>/`의 첫 번째 파일은 반드시 `index.tsx`로 생성한다. `feat-name.tsx` 같은 이름 금지.
- **훅/함수는 named export**. default export는 React 컴포넌트나 Next.js 규약(`page.tsx`, `layout.tsx`)이 요구할 때만.
- **Import 순서**: React → 3rd-party → `@/*` → 상대경로.
- **주석/스토리 설명/toast 문구는 한국어**.
- **컴포넌트 함수 위에는 한 줄 설명 주석을 단다** — 어떤 컴포넌트인지 한국어로 간단히 적는다 (예: `// 신뢰도 점수를 배지 형태로 표시`).
- **interface/type 프로퍼티 주석은 해당 줄 오른쪽에 인라인으로 작성한다** — `/** */` 블록을 프로퍼티 위에 쓰지 않는다. 예: `onAreaChanged?: (area: SearchArea) => void; // 최초 타일 로드 시에만 호출`
- **허가되지 않은 새 라이브러리 설치 금지** — 기존 deps로 해결 가능한지 먼저 확인.
- **`any` 지양**. 명시적으로 허용한 경우 외에는 타입을 정의한다.

## Spec 문서 작성 규칙 (`docs/spec/`)

백엔드·디자이너와 소통하기 위한 기획서는 `docs/spec/{페이지}/` 폴더로 관리한다.

### 폴더 구조

```
docs/spec/{페이지}/
  index.md           — 화면 기획 (레이아웃, 인터랙션, 상태)
  {기능}.md          — 특정 기능의 상세 기획 (필요한 경우)
  backend-spec.md    — 해당 페이지의 API 계약 전체
```

현재: `docs/spec/home/`, `docs/spec/restaurant/`

### 작성 스타일

- **짧게, 핵심만.** 도입 설명은 1~2줄. 불필요한 "왜 중요한가" 해설 제거.
- **표는 짧고 한눈에 보이는 것에만.** 파라미터 목록·API 목록·Kakao 매핑은 표로. 동작 흐름·케이스 분기는 bullets 또는 번호 목록으로.
- **미정 항목은 별도 섹션**으로 모아서 표시.
- **구현 세부사항(함수명·prop명·CSS 클래스) 금지.** 백엔드·디자이너가 읽는 문서이므로 "무엇을·언제·왜"만 적는다.

## 1차 MVP 범위

1차 MVP에 포함되지 않는 코드(기능, 컴포넌트, 로직)는 해당 코드 바로 위에 아래 주석을 달아 표시한다.

```ts
// TODO: 1차 MVP 제외 — <이유 또는 기능명>
```

주석이 달린 코드는 구현은 완료되어 있어도 MVP 릴리스에 노출/활성화하지 않는다.

## 로드맵(30-day-plan) 실행 규칙

`docs/plan/roadmap1/week-{N}.md`의 Day 작업은 `#1, #2, …` task로 쪼개져 있다.

### 실행 단위

- **task 1개 단위로만 진행 후 정지.** Day·Week 단위로 묶어 실행 금지. "Day N 해줘" 같은 광범위 지시도 첫 task만 실행 후 멈춘다.
- task 안에 명시된 빌드 확인(`pnpm build`·`pnpm lint`)은 별도로 끊지 않고 그 task에 포함한다.

### 2단 ask — 침묵=동의 금지

task/step 종료 후 반드시 다음 순서를 지킨다:

1. 아래 **task 완료 보고 형식**으로 작성 → 사용자 검토 대기
2. 검토 완료 후 **"다음 스텝 시작할까요? — `{다음 task/step 요약}`"** → `다음`/`진행`/`ok` 등 명시적 승인 대기

### 플랜 작성 규칙

- **플랜은 현재 진행할 task 하나만 담는다.** Day·Week 전체 task를 한 플랜에 묶어 작성하지 않는다.
- 플랜 파일도 아래 이모지 타이틀 포맷을 따른다.

### task 완료 보고 형식

이모지 타이틀을 포함한 3개 섹션으로 작성한다. 플랜 파일과 완료 보고 모두 동일한 포맷을 쓴다.

```
## 📋 Task N이 뭐였나 (적용한 실제 변경)
어떤 파일을, 어떻게 바꿨는지. 변경 전/후 코드 스니펫 포함.

## 💡 적용한 이유
- 문제: 변경 전 무엇이 문제였나
- 왜 이 방식인가: 선택한 접근법의 근거 (대안 대비 이 방식이 맞는 이유)
- 동작 원리: 각 변경이 어떻게 연결되어 작동하는지

## 🔜 다음 task — Task N+1: {한 줄 요약}
다음 task가 무엇인지, 왜 이 순서인지.
```

응답 섹션 타이틀에는 항상 이모지를 붙인다.

### 진행 표기

태스크를 완료하면 사용자 확인 후 `docs/plan/roadmap1/week-{N}.md` 내 해당 항목을 `- [x]`로 체크한다.

로드맵 표 항목 설명은 **사용자가 읽을 수 있는 수준**으로 작성한다. px 수치·CSS 클래스명·함수명·prop명 등 구현 세부사항은 적지 않는다. "무엇을 했는지"만 한 줄로.

**Day 완료 체크:** Day의 마지막 task까지 끝나고 사용자가 검토·확인하면, 일별 요약 테이블의 해당 Day 행 `완료` 열도 `[x]`로 체크한다.

### 이슈 기록

작업 중 발생한 이슈는 `docs/plan/roadmap1/week-{N}-issues.md`에 기록한다. `week-{N}.md` 본문에는 적지 않는다.

기록 형식: 표 금지, `-` 나열형. 각 항목은 "발견 → 처리" 한 줄. 예:
```
- 핀 클릭이 `<div onClick>` — 키보드 접근 없음 → `<button aria-label>` 로 교체
```
