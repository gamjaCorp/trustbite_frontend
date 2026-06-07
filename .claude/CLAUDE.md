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
src/app                         Next App Router
src/components/ui/              shadcn (수정 금지)
src/components/core/            ui/ 프리미티브를 감싸는 공통 컴포넌트
src/components/features/<feat>/ 페이지 단위. 진입점 index.tsx 필수. hooks/·schema.ts 포함 가능.
src/components/common/          두 개 이상 feature가 공유하는 컴포넌트
src/api/<feature>/              publicFetch·authedFetch·Server Action (feature별 하위 폴더)
src/hooks/use-*.ts              여러 feature가 공유하는 범용 훅
src/stores/<name>-store.tsx     Zustand + Context 스토어
src/lib/                        유틸 함수·타입 정의·비즈니스 로직
src/data/                       개발용 mock 데이터
src/stories/                    Storybook 스토리 (평탄 구조)
src/auth.ts + src/proxy.ts      NextAuth v5
```

**feature 폴더 네이밍**: 라우트 세그먼트와 일치 (루트 `/`는 `home`). 여러 라우트가 공유하는 feature만 도메인 이름 사용.

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

**모든 task에 적용.** 코드를 완성해 건네지 않는다. 사용자가 직접 핵심 로직을 작성하도록 유도한다.

1. 골격(파일·타입·import·주변 코드)을 먼저 작성한다.
2. 사용자가 채울 부분에 `// TODO(human)` 플레이스홀더 삽입 — 파일 전체에 하나만.
3. **Learn by Doing** 요청(Context / Your Task / Guidance)으로 멈춘다. 사용자 응답 전 추가 코드 작성 금지.
4. 응답 후 통합하고 패턴·시스템 효과 한 줄 인사이트 공유.

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
