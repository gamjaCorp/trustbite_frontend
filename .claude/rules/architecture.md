# 아키텍처

## 디렉터리 구조

```
src/app                          Next App Router
src/app/<route>/_components/     해당 라우트에서만 쓰이는 컴포넌트. 진입점을 두면 index.tsx.
src/app/<route>/_hooks/use-*.ts  해당 라우트에서만 쓰이는 훅.
src/app/<route>/_lib/<name>.ts   해당 라우트에서만 쓰이는 순수 로직·타입·zod schema·Zustand 스토어.
src/app/<route>/actions.ts       해당 라우트의 Server Action.
src/components/{core,ui}         core는 ui/ 프리미티브를 감싸는 공통 컴포넌트에 한정. 그 외 중복은 common/에 둔다. ui는 shadcn (수정 시 사전 승인 — CLAUDE.md `ui/ 수정 절차`)
src/components/common/<도메인>/   두 개 이상 라우트에서 공유하는 컴포넌트. 라우트에 귀속시키면 교차 의존이 생기는 경우.
src/api/<feature>/<feature>.ts   fetch 기반 API 함수 (publicFetch/authedFetch/Server Action, feature별 하위 폴더)
src/hooks/use-*.ts               여러 라우트에서 공유하는 범용 훅 (예: use-debounced-value, use-auth-status, use-mobile)
src/stores/<name>-store.tsx      여러 라우트가 공유하는 Zustand + Context 스토어
src/lib                          유틸 함수 (utils.ts/cn, geo.ts, category.ts 등 비즈니스 로직)
src/types                        전역 타입 정의 (restaurant.ts, user.ts, follow.ts 등)
src/data                         개발용 mock 데이터
src/stories/{PascalCase}.stories.tsx  모든 스토리가 평탄하게 여기 모임
src/auth.ts + src/proxy.ts       NextAuth v5 (proxy는 middleware alias)
```

**colocation 규칙**: 배치 기준은 **그 코드를 쓰는 라우트가 몇 개인가** 하나다.

- **1개** — 해당 라우트의 `_components/`·`_hooks/`·`_lib/`에 둔다. 라우트 전용 Zustand 스토어·zod 스키마도 `_lib/`(별도 `_stores/`를 만들지 않는다), 서버 액션은 라우트 루트의 `actions.ts`. `_`로 시작하는 폴더는 Next.js Private Folder라 URL 세그먼트가 되지 않는다.
- **2개 이상** — `src/components/common/<도메인>/`으로 올린다. ui/ 프리미티브를 감싸는 얇은 래퍼면 `core/`.

공유 라우트 수가 바뀌면 양방향으로 이동한다 — 2개 이상이 되면 `common/`으로 올리고, 1개로 줄면 그 라우트의 `_*`로 내린다. 한 폴더 안에서 파일마다 공유 수가 다르면 **폴더째 옮기지 말고 경계를 따라 쪼갠다** (예: 목록 뷰는 라우트 전용 → `_components/`, 토글 버튼은 2개 라우트 공유 → `common/`).

**Route Group**: 루트(`/`) 페이지는 `app/(home)/`에 격리. `(home)` 폴더는 URL에 영향 없이 홈 전용임을 명시. 새 그룹 추가 시 `app/(그룹명)/` 패턴 사용.

**재사용 우선순위**: `core/` → `ui/` → 신규 생성.

## 네이밍·Import 컨벤션

- 파일/폴더 kebab-case. 배럴에서 import 시 `/index` suffix 명시.
- 훅/함수는 named export. default export는 React 컴포넌트·Next.js 규약만.
- Import 순서: React → 3rd-party → `@/*` → 상대경로.
- 주석·toast 문구는 한국어. 컴포넌트 함수 위에 한 줄 설명 주석.
- interface/type 프로퍼티 주석은 해당 줄 오른쪽 인라인 (`// 설명`).
- `any` 지양.
