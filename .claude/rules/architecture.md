# 아키텍처

## 디렉터리 구조

```
src/app                          Next App Router
src/components/{core,ui}         core는 ui/ 프리미티브를 감싸는 공통 컴포넌트에 한정. 그 외 중복은 features/(가까운 도메인) 또는 common/에 둔다. ui는 shadcn (직접 수정 금지)
src/components/features/<feat>/  feature = 페이지 단위. 진입점 파일은 반드시 index.tsx.
src/components/features/<feat>/hooks/use-*.ts  해당 feature(페이지)에만 쓰이는 훅은 feature 폴더 안 hooks/에 배치.
src/components/features/<feat>/stores/<name>-store.tsx  해당 feature에서만 쓰이는 Zustand + Context 스토어. 여러 feature가 공유하면 src/stores/로 승격.
src/components/features/<feat>/schema.ts       해당 feature에서만 쓰이는 zod schema는 feature 폴더 안에 배치. 여러 feature가 공유하게 되면 그때 src/lib/으로 승격.
src/components/features/<feat>/lib/<name>.ts   해당 feature에서만 쓰이는 순수 로직·타입 (UI/훅/스토어가 아닌 유틸). 여러 feature가 공유하면 src/lib/으로 승격.
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
