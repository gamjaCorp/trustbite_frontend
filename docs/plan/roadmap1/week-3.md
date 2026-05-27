# Week 3 — 백엔드 없이 지금 할 수 있는 일 (5/25~5/31)

## 이번 주 목표

백엔드가 아직 준비되지 않아 W3(백엔드 전환) 전체가 블로킹 상태.  
이번 주는 **백엔드 없이도 지금 할 수 있는 작업**을 앞당겨 진행한다.

이 주가 끝나면 지도 UX가 완성되고, 인프라 골격이 잡히고, 폼에 검증이 붙고, 코드가 배포 가능한 수준으로 정리된다.

---

## 일별 요약

| Day | 목표 | 주요 산출물 | 완료 |
|---|---|---|---|
| 1 | 실 Google 로그인 연결 (프론트) | NextAuth 세션 연결, `useAuthMock` 대체, mock-store 제거 (백엔드 불필요) | [x] |
| 2 | 지도 코드 검토 + UX 마무리 | 기존 지도 코드 검토(punch list) + 핀 미니카드 오버레이 | [ ] |
| 3 | 인프라 스캐폴딩 | `src/lib/types/` 재배치, fetch 래퍼 3파일 골격, 글로벌 에러/토스트 골격 | [ ] |
| 4 | 폼 검증 — 온보딩 RHF+zod / 리뷰 zod 검증 | 온보딩·리뷰 폼 검증 (제출은 mock 유지) | [ ] |
| 5 | 디자인 품질 점검 — 9개 화면 | cross-page 톤 통일, `pnpm design:check` 그린 | [ ] |
| 6 | 반응형 점검 | 375 / 768 / 1280 breakpoint 정상 동작 | [ ] |
| 7 | 코드 정리 + 빌드 + 스토리북 | `any`/`console.log` 제거, `pnpm build` 그린, 스토리북 잔여 | [ ] |

---

## Day 1 — 실 Google 로그인 연결 (프론트)

이미 완료된 것: `auth.ts`(Google provider 설정) · `api/auth/[...nextauth]/route.ts` · `/signin` 페이지 · `/onboarding` 페이지 · `.env.local` AUTH_* 키 스캐폴딩(값 미입력).
백엔드 없이 실 Google OAuth → 세션 발급 → UI 연결까지 가능. 백엔드 의존분(`POST /auth/login`, 온보딩 영속화)은 W4 Day 1에 잔류.

> `/login`·`/signin` 네이밍: 코드는 `/signin` 사용, `layout.tsx`도 `/signin` 참조. 로드맵 전반에서 `/login` 언급은 `/signin`으로 통일.

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| env 세팅 | - `.env.local`에 `AUTH_SECRET` · `AUTH_GOOGLE_ID` · `AUTH_GOOGLE_SECRET` 입력 (Google Cloud OAuth client 등록) | `.env.local` | [x] |
| NextAuth 설정 | - `callbacks.jwt` / `callbacks.session` 추가 — Google `sub` → `session.user.id` 노출 | `src/auth.ts` | [x] |
|  | - `next-auth.d.ts` 타입 augmentation — `Session['user'].id`, `JWT.id` | `src/types/next-auth.d.ts` (신규) | [x] |
|  | - `SessionProvider` 추가 + 서버 세션 주입 | `src/components/common/layout/providers.tsx`, `src/app/layout.tsx` | [x] |
| 훅·교체 | - `use-auth-status.ts` 훅 작성 — `useSession` 래핑, `{ isAuthed, user }` 반환 | `src/hooks/use-auth-status.ts` (신규) | [x] |
|  | - `useAuthMock` → `useAuthStatus` 교체 (소비처 8곳) | `header.tsx`, `back-header.tsx`, `place-list-row.tsx`, `review-cta-bar.tsx`, `restaurant-summary.tsx`, `my-review-section.tsx`, `logged-out-review-gate.tsx`, `auth-mock-toggle.tsx` | [x] |
|  | - `signin/page.tsx` `searchParams` await (Next 16 규약) | `src/app/signin/page.tsx` | [x] |
| mock 제거 | - `auth-mock-store.tsx` · `auth-mock-toggle.tsx` 제거 + 스토리 2개 갱신(`Header.stories.tsx`, `BackHeader.stories.tsx`) | `src/stores/`, `src/components/common/auth-mock-toggle.tsx`, `src/stories/` | [x] |
| 검증 | - `pnpm lint && npx tsc --noEmit` 그린 | — | [x] |

> 산출물: 실 Google 로그인 → 세션이 프론트 위에서 동작 (백엔드 미연동)

---

## Day 2 — 지도 코드 검토 + UX 마무리

탐색/지도 기능 전반(최근 커밋)은 직접 작성한 코드가 아니다.  
미니카드 오버레이를 얹기 전에 기존 코드를 먼저 검토하고 punch list를 정리한 뒤 오버레이를 추가한다.

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| 검토 · SDK/핀 | - `useKakaoLoader` 로딩 방식, 뷰포트 반경 계산, area/viewport/region 이벤트 흐름 검토 | `map-view.tsx`, `category-pin.tsx`, `restaurant-pin.tsx`, `search-this-area.tsx` | [ ] |
| 검토 · 동기화/검색 | - `activeId` pin↔row 동기화, applied/pending area 상태 전환, 검색 입력 흐름 검토 | `region-rank-list.tsx`, `hooks/explore/use-nearby-places.ts`, `common/place-list-row.tsx` | [ ] |
| 검토 · 데이터 어댑터 | - Kakao Local API 호출 구조, KakaoPlace → RegionalRankEntry 변환 로직, 타입 정의 검토 | `api/kakao-local.ts`, `lib/synthesize-restaurant.ts`, `types/restaurant.ts` | [ ] |
| 리팩토링 · 상태 스토어 | - `RegionRankList`의 8개 useState → Zustand+Context 스토어 이관 (뷰는 selector hook 소비, `MapView`·`PlaceListRow`는 prop 유지) | `src/stores/region-rank-store.tsx`(신규), `region-rank-list.tsx` | [ ] |
| 리팩토링 · 지오 유틸 추출 | - `SearchArea` 타입 + `haversine`·`computeViewportRadius`를 `map-view.tsx`에서 lib/types로 추출 | `src/lib/geo.ts`(신규), `src/lib/types/restaurant/type.ts`, `map-view.tsx` | [ ] |
| 리팩토링 · 검색 분기 훅 추출 | - geocoder→keyword→filter 분기 effect를 `use-place-search` 훅으로 추출 (store 액션 소비) | `src/hooks/explore/use-place-search.ts`(신규), `region-rank-list.tsx` | [ ] |
| 리팩토링 · 핀↔행 동기화 정리 | - activeId 기반 핀↔행 스크롤·하이라이트 로직을 훅/유틸로 정리 | `region-rank-list.tsx` | [ ] |
| 리팩토링 · View 컴포넌트 분해 | - `RegionRankListView`를 필터바·지도블록·결과리스트 하위 컴포넌트로 분해 (각자 store hook 소비) | `src/components/features/ranking/`(신규 분할) | [ ] |
| 에이전트 검토 | - `frontend-code-reviewer` 에이전트 1바퀴 — punch list 수집 및 즉시 수정 | — | [ ] |
| 핀 미니카드 | - 핀 클릭 → 지도 위 미니카드 오버레이 (가게명 + 평점 + 신뢰도%) | `src/components/features/explore/map-mini-card.tsx` (신규) | [ ] |
|  | - `map-view.tsx`의 `onPinClick` 콜백에 미니카드 표시 연결, 지도 바깥 클릭 시 닫힘 | `src/components/features/explore/map-view.tsx` | [ ] |
| 검증 | - `pnpm lint && npx tsc --noEmit` 그린 | — | [ ] |

> 산출물: 기존 지도 코드 검토·정리 완료 + 핀 클릭 미니카드 오버레이 동작

---

## Day 3 — 인프라 스캐폴딩

백엔드 연결 전 필요한 타입 경로 재배치 및 fetch 래퍼 골격 확보. API 함수 없이 골격만.

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| 타입 이동 | - `src/types/restaurant.ts` → `src/lib/types/restaurant/type.ts` 이동 | `src/types/` → `src/lib/types/` | [ ] |
|  | - `src/types/user.ts` → `src/lib/types/user/type.ts` 이동 | `src/types/` → `src/lib/types/` | [ ] |
|  | - `src/types/follow.ts` → `src/lib/types/follow/type.ts` 이동 | `src/types/` → `src/lib/types/` | [ ] |
|  | - 프로젝트 내 `@/types/*` import 전체 수정 | — | [ ] |
| fetch 골격 | - `ApiError` 클래스, `baseURL`(`NEXT_PUBLIC_API_BASE_URL`), 공통 응답 파서 작성 | `src/lib/fetch.ts` (신규) | [ ] |
|  | - `publicFetch<T>` (토큰 없음, `next: { tags, revalidate }` 캐시 가능), `authedFetch<T>` (`auth()` Bearer, `no-store`) 작성 | `src/lib/fetch.server.ts` (신규) | [ ] |
|  | - `clientFetch<T>` (세션 토큰, 401 시 sonner + signout) 작성 | `src/lib/fetch.client.ts` (신규) | [ ] |
| 에러 핸들러 | - 글로벌 React Query 에러 핸들러 → `sonner` toast 연결 골격 | `src/components/common/layout/providers.tsx` | [ ] |
| 검증 | - `pnpm lint && npx tsc --noEmit` 그린 | — | [ ] |

> 산출물: 타입 경로 일관화 + fetch 래퍼 골격 완비 (API 함수는 W4에서 작성)

---

## Day 4 — 폼 검증

온보딩 폼: 현재 plain useState + 수동 검증 → RHF + zod으로 전환.
리뷰 폼: 현재 **Zustand Context 스토어(`review-write-store`)로 상태 관리** — 스토어 구조 유지, zod schema 검증 메시지만 추가. RHF 전면 전환 아님.
제출은 기존 mock 유지.

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| 패키지 설치 | - `react-hook-form`, `zod`, `@hookform/resolvers` 패키지 설치 | `package.json` | [ ] |
|  | - shadcn `form.tsx` 추가 (`pnpm dlx shadcn@latest add form`) | `src/components/ui/form.tsx` (신규) | [ ] |
| 온보딩 폼 | - 온보딩 schema 작성 (닉네임 2~16자, 지역 1개 이상, 한국어 에러 메시지) | `src/lib/types/auth/schema.ts` (신규) | [ ] |
|  | - `/onboarding` 폼에 `useForm({ resolver: zodResolver })` + shadcn Form 컴포넌트 적용 | `src/app/onboarding/page.tsx` | [ ] |
| 리뷰 폼 | - 리뷰 작성 zod schema 작성 (가게 필수, 평점 1~5, 텍스트 100자 이상, 사진 0~5, 한국어 에러 메시지) | `src/lib/types/review/schema.ts` (신규) | [ ] |
|  | - `useReviewIsValid` 검증 로직을 zod schema `safeParse`로 교체 (Zustand 스토어 구조 유지) | `src/stores/review-write-store.tsx` | [ ] |
| 검증 | - `pnpm lint && npx tsc --noEmit` 그린 | — | [ ] |

> 산출물: 폼 검증 적용 완료 (리뷰 폼 Zustand 스토어 유지, 제출 로직은 기존 mock 유지)

---

## Day 5 — 디자인 품질 점검 — 9개 화면

순회 대상: `/` · `/restaurant/[id]` · `/review/new` · `/review/new/result` · `/profile` · `/my-places` · `/user/[id]` · `/signin`+`/onboarding`

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| 토큰 점검 | - 시맨틱 타이포 — raw `text-{xs,sm,...} font-*` 잔존 5건 이하로 정리 | — | [ ] |
|  | - 컬러 토큰 — arbitrary hex 0건 (Google 로고/Pin SVG 예외만) | — | [ ] |
|  | - 카드 톤 통일 — `p-4`, `shadow-card`, `rounded-card` 일관 적용 | — | [ ] |
|  | - 스페이싱 — `[px]` 임의값 사용처 정당화 확인 | — | [ ] |
|  | - 로딩/빈/에러 톤 일관 (Skeleton/Empty/Error) | — | [ ] |
| 접근성 | - 접근성 1차 — 텍스트 대비, 클릭 영역 ≥ 44px, `alt` 텍스트 | — | [ ] |
|  | - 컴포넌트 함수 위 한 줄 한국어 설명 주석 점검 | — | [ ] |
| 검증 | - `pnpm design:check` 통과 + critical 이슈 즉시 수정 | — | [ ] |

> 산출물: 9개 화면이 일관된 디자인 토큰 위에서 동작

---

## Day 6 — 반응형 점검

**뷰포트별 점검 대상**

| 뷰포트 | 확인 화면 |
|---|---|
| 모바일 375 × 667 | 모든 화면 |
| 태블릿 768 × 1024 | 홈, 상세, 리뷰 작성 |
| 데스크톱 1280 × 800 | 모든 화면 |

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| 레이아웃 | - `/review/new` 데스크톱 2컬럼 — 데스크톱만 사이드바, 모바일 단일 컬럼 | — | [ ] |
|  | - 헤더 모바일 — 중요하지 않은 요소 축소/숨김 | — | [ ] |
|  | - 탐색 탭 필터 칩 모바일 가로 스크롤 처리 | — | [ ] |
| 확인 | - 지도 미니카드 모바일 위치·크기 확인 | — | [ ] |
|  | - 등급 타임라인 모바일 가독성 확인 | — | [ ] |
|  | - `text-xs`(12px) 미만 텍스트 없는지 재확인 | — | [ ] |

> 산출물: 모든 화면이 375~1280에서 의도대로 표시

---

## Day 7 — 코드 정리 + 빌드 + 스토리북

배포 전 코드 품질 확보 — `any` 제거, `console.log` 제거, 빌드 그린, 스토리북 보강.

| 그룹 | 할 일 | 관련 파일 | 상태 |
|---|---|---|---|
| 코드 정리 | - `any` 타입 전수 검색 → 명시적 타입으로 교체 | — | [ ] |
|  | - `console.log` 전량 제거 | — | [ ] |
| Storybook | - W3 Day 1~6 산출물 중 Storybook story 미작성 컴포넌트 보강 | `src/stories/` | [ ] |
| 코드 리뷰 | - `frontend-code-reviewer` 에이전트 1바퀴 — punch list 수집 및 즉시 수정 | — | [ ] |
| 검증 | - `pnpm build` 번들 사이즈 확인 (지도 청크 분리 여부) | — | [ ] |
|  | - `pnpm lint && npx tsc --noEmit && pnpm build` 그린 | — | [ ] |

> 산출물: 커밋이 깨끗한 상태로 W4 백엔드 연동 진입 준비 완료

---

## 재사용 점검

| 필요한 것 | 사용 |
|---|---|
| 지도 미니카드 | `src/components/features/explore/map-mini-card.tsx` (Day 2 산출물) |
| toast | `sonner` (설치됨) |
| 폼 | `react-hook-form` + `zod` (Day 4에서 설치) + `src/components/ui/form.tsx` |
| 카드 셸 | `src/components/common/place-list-row.tsx` (이미 my/wishlist/regional variant 통합) |
| 로딩 스켈레톤 | `src/components/ui/skeleton.tsx` + feature별 skeleton (예: `ranking/region-rank-skeleton.tsx`) |
| 빈 상태 | `src/components/ui/empty.tsx` + feature별 empty |
| 타입 경로 | `src/lib/types/<feature>/type.ts` (Day 3 산출물) |
