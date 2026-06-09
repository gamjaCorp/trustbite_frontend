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

## 디렉터리 구조

```
src/app/<route>/
  page.tsx                      라우트 진입점 (얇게 유지)
  _components/                  라우트 전용 UI 컴포넌트. 진입점 index.tsx 필수.
  _hooks/                       라우트 전용 훅 (해당 시)
  _lib/                         라우트 전용 도메인 로직 — 검증 스키마·데이터 변환 등 UI 아닌 실행 코드 (해당 시)
src/components/ui/              shadcn (수정 금지)
src/components/core/            ui/ 프리미티브를 감싸는 공통 컴포넌트
src/components/features/<feat>/ 여러 라우트가 공유하는 feature 단위 (follow/, review-write/ 등 완결된 기능)
src/components/common/          여러 라우트가 공유하는 작은 UI 프리미티브 (badge, chip, header 등)
src/api/<feature>/              publicFetch·authedFetch·Server Action (feature별 하위 폴더)
src/hooks/use-*.ts              여러 라우트가 공유하는 범용 훅
src/stores/<name>-store.tsx     Zustand + Context 스토어
src/lib/                        전역 재사용 유틸·타입·비즈니스 로직 (_lib/는 route-local, src/lib/는 전역)
src/data/                       개발용 mock 데이터
src/stories/                    Storybook 스토리 (평탄 구조)
src/auth.ts + src/proxy.ts      NextAuth v5
```

**colocation 규칙**: 한 라우트에서만 쓰이는 컴포넌트·훅·로직은 해당 라우트의 `_components/`·`_hooks/`·`_lib/`에 둔다. `_`로 시작하는 폴더는 Next.js Private Folder라 URL 세그먼트가 되지 않는다. 여러 라우트가 공유할 때 — 완결된 feature 단위면 `src/components/features/`, 작은 UI 프리미티브면 `src/components/common/`으로 올린다.

**Route Group**: 루트(`/`) 페이지는 `app/(home)/`에 격리. `(home)` 폴더는 URL에 영향 없이 홈 전용임을 명시. 새 그룹 추가 시 `app/(그룹명)/` 패턴 사용.

**재사용 우선순위**: `core/` → `ui/` → 신규 생성.

## 네이밍·Import 컨벤션

- 파일/폴더 kebab-case. 배럴에서 import 시 `/index` suffix 명시.
- 훅/함수는 named export. default export는 React 컴포넌트·Next.js 규약만.
- Import 순서: React → 3rd-party → `@/*` → 상대경로.
- 주석·toast 문구는 한국어. 컴포넌트 함수 위에 한 줄 설명 주석.
- interface/type 프로퍼티 주석은 해당 줄 오른쪽 인라인 (`// 설명`).
- `any` 지양.

## Spec 문서 (`docs/spec/{페이지}/`)

```
index.md          화면 기획
{기능}.md         기능별 상세 (필요 시)
backend-spec.md   API 계약
```

작성 스타일: 짧게 핵심만. 표는 파라미터·API 목록에만. 미정 항목은 별도 섹션. 구현 세부사항(함수명·CSS 클래스) 금지.

## 1차 MVP 범위

MVP 미포함 코드 위에 표시:

```ts
// TODO: 1차 MVP 제외 — <이유 또는 기능명>
```

## 로드맵 실행 규칙 (`docs/plan/roadmap1/week-{N}.md`)

### 실행 단위

**task 1개 단위로만 진행 후 정지.** 빌드 확인(`pnpm build`·`pnpm lint`)은 해당 task에 포함.

### Learn by Doing

**모든 task에 적용.** Claude는 코드를 직접 작성하지 않는다. 사용자가 순서대로 모든 코드를 작성하도록 유도한다.

**흐름:**
1. **계획 공유** — task를 2~5개 구현 단계로 쪼개 순서와 이유를 먼저 설명한다.
2. **단계별 요청** — 한 번에 한 단계씩 Learn by Doing 형식(Context / Your Task / Guidance)으로 요청한다. 사용자 응답 전 다음 단계로 넘어가지 않는다.
3. **검토 후 다음** — 사용자가 제출한 코드를 검토하고 인사이트를 한 줄 공유한 뒤, 다음 단계를 요청한다.
4. **완료** — 모든 단계가 끝나면 task 완료 보고로 마무리한다.

**제약:** Claude가 `TODO(human)` 플레이스홀더를 포함한 어떤 구현 코드도 작성하지 않는다. 파일 생성·타입 정의·import 추가도 사용자에게 요청한다.

### 2단 ask — 침묵=동의 금지

task 종료 후: ① 완료 보고 → 검토 대기 → ② "다음 스텝 시작할까요? — `{요약}`" → 명시적 승인 대기.

### 플랜

플랜은 현재 진행할 task 하나만. 이모지 타이틀 포맷 유지.

### task 완료 보고 형식

```
## 📋 Task N — (변경 내용 + 전/후 스니펫)
## 💡 적용한 이유 — 문제 / 왜 이 방식 / 동작 원리
## 🔜 다음 task — Task N+1: {한 줄 요약}
```

### 진행 표기

사용자 확인 후 `week-{N}.md` 해당 항목을 `[x]`로 체크. Day 마지막 task 확인 시 일별 요약 테이블 완료 열도 체크.

### 이슈 기록

`week-{N}-issues.md`에 `-` 나열형으로 기록. 본문에는 적지 않는다.

```
- 핀 클릭이 `<div onClick>` — 키보드 접근 없음 → `<button aria-label>` 로 교체
```
