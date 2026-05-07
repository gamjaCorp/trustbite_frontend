# Week 3 — 나머지 화면 마이그 + 탐색 탭 동작 + 지도 통합

## 이번 주 목표

Week 2에서 만든 표준 절차(`api/` + `hooks/` + `lib/types/`)를 **나머지 화면 4개**에 적용한다.  
동시에 Week 1에서 UI만 만들어둔 **탐색 탭의 검색/필터/지도**를 동작시켜  
탐색 → 상세 → 리뷰 → 결과 → /profile 전체 동선이 실 백엔드 API 위에서 굴러가게 만든다.

이 주가 끝나면 `src/data/mock-*` 파일이 모두 사라지고,  
**모든 1차 MVP 화면이 실 백엔드 API 위에서 동작**하는 상태가 된다.

---

## 일별 요약

| Day | 날짜 | 목표                                | 주요 산출물                                                    | 완료 |
| --- | ---- | ----------------------------------- | -------------------------------------------------------------- | ---- |
| Mon | 5/26 | 탐색 탭 검색/필터 동작              | `api/restaurant/search`, `useSearchRestaurants` (디바운스/URL) | ☐    |
| Tue | 5/27 | 지도 시트 통합 (Kakao Maps SDK)     | 시트 30↔70 드래그, 핀 렌더, 영역 재검색                        | ☐    |
| Wed | 5/28 | `/restaurant/[id]` 마이그           | `useRestaurantDetail`, 비로그인 분기 정합                      | ☐    |
| Thu | 5/29 | `/review/new` + `/my-places` 마이그 | `useSubmitReview` 정합, `useMyRanking`/`useMyStats`            | ☐    |
| Fri | 5/30 | `/user/[id]` + Wishlist mutation    | `useUserProfile`, `useToggleBookmark` (낙관적 업데이트)        | ☐    |

---

## Day 1 (월) — 탐색 탭 검색/필터 동작 — ≈ 5~6h

Week 1 Day 3에서 만든 검색/필터 UI에 동작을 붙인다.

**타입**

- [ ] `src/lib/types/restaurant/request.ts` — `SearchParams` (q, region, category[], context[], sort, page)
- [ ] `src/lib/types/restaurant/response.ts` — `RestaurantListResponse`

**API**

- [ ] `src/api/restaurant/restaurant.ts`에 `searchRestaurants(params)` 추가 (sleep + mock 필터링)

**훅**

- [ ] `src/hooks/restaurant/use-search-restaurants.ts`
  - [ ] 검색어 300ms 디바운스
  - [ ] URL 쿼리 동기화 (`?q=...&category=...&sort=...`)
  - [ ] 쿼리 변경 시 자동 재호출

**UI 연결**

- [ ] `search-bar` → 디바운스 → URL → 훅
- [ ] `region-filter`, `sort-filter`, `category-chips`, `context-chips` → URL 즉시 반영
- [ ] 결과 0개: `Empty`, 로딩: 스켈레톤
- [ ] "필터 초기화" 버튼

> 산출물: 검색바/필터 조작이 실제로 리스트를 바꿈

---

## Day 2 (화) — 지도 시트 통합 — ≈ 5~6h

PRD 5장. 탐색 탭을 지도 + 리스트 결합 형태로.

**레이아웃**

- [ ] 탐색 탭: 상단 지도 (기본 30vh) + 하단 시트 (70vh)
- [ ] 시트 드래그로 30% ↔ 70% 전환 (`vaul` 또는 직접 구현)

**지도**

- [ ] Kakao Maps JS SDK 초기 셋업 (`NEXT_PUBLIC_KAKAO_MAP_KEY` env, `next/script` 동적 로드)
- [ ] 기존 `react-naver-maps` 의존성 제거 + `src/components/features/explore/map-view.tsx`를 카카오 SDK 기반으로 재작성
- [ ] 검색 결과 좌표로 핀 렌더
- [ ] 핀 클릭 시 미니 카드 (가게명 + 평점 + 신뢰도%)
- [ ] 핀: 일반 / 내가 방문한 곳 (체크)
- [ ] 지도 이동/줌 감지 → "이 지역 다시 검색" 버튼 노출 → 클릭 시 viewport 좌표로 재검색
- [ ] 기존 `src/app/map/page.tsx` 삭제 (홈 탐색 탭으로 통합 — 중복 제거)

> 산출물: 지도 + 리스트가 한 화면에서 결합 동작

---

## Day 3 (수) — `/restaurant/[id]` 마이그 — ≈ 5h

가장 복잡한 화면. 표준 절차 적용.

**타입**

- [ ] `src/lib/types/restaurant/response.ts`에 `RestaurantDetailResponse` 추가

**API**

- [ ] `src/api/restaurant/restaurant.ts`에 `getRestaurantDetail(id)` 추가

**훅**

- [ ] `src/hooks/restaurant/use-restaurant-detail.ts`

**페이지**

- [ ] `/restaurant/[id]/page.tsx` client + `useRestaurantDetail`
- [ ] 로딩: PhotoGallery + ScorePanel 스켈레톤
- [ ] 404: `notFound()` 호출

**비로그인 분기 정합 (Week 1 Day 4 결과)**

- [ ] 미들웨어/`auth()` 결과로 분기 일관 처리
- [ ] 미리보기 vs 전체 분기를 컴포넌트 prop으로 명시

**정리**

- [ ] `src/data/mock-restaurant-detail.ts` 흡수 후 삭제

> 산출물: 가장 복잡한 화면이 React Query로 동작

---

## Day 4 (목) — `/review/new` + `/my-places` 마이그 — ≈ 5~6h

두 화면을 합쳐서 처리 — `/review/new` 폼은 Zustand store 유지하되 mutation만 정합, `/my-places`는 단순 GET 마이그.

**`/review/new` 마이그**

- [ ] `src/lib/types/review/request.ts` 보강 (`CreateReviewRequest` 정합)
- [ ] Week 2 Day 4의 `useSubmitReview` 사용 일관화 — 모든 submit 경로가 mutation 통과
- [ ] 사진 업로드는 mock URL 반환만 (실제 업로드는 백엔드 붙은 후)
- [ ] `review-write-store` (Zustand) 유지 — 폼 상태 관리

**`/my-places` 마이그**

- [ ] `src/lib/types/restaurant/response.ts`에 `MyRestaurantStats`, `MyRestaurantRankResponse` 추가
- [ ] `src/api/restaurant/my-ranking.ts` 신규 — `getMyRanking()`, `getMyStats()`
- [ ] `src/hooks/restaurant/use-my-ranking.ts`, `use-my-stats.ts`
- [ ] `/my-places/page.tsx` client 전환
- [ ] 로딩: 스탯 카드 + 리스트 스켈레톤
- [ ] 빈 목록: '아직 리뷰한 맛집이 없어요'

**정리**

- [ ] `src/data/mock-restaurant.ts`의 `mockStats5`, `mockRankList`를 api로 흡수 (다른 곳 참조 확인 후)

> 산출물: `/my-places` + `/review/new`가 데이터 레이어 위에서 동작

---

## Day 5 (금) — `/user/[id]` + Wishlist mutation + 9개 화면 디자인 점검 — ≈ 5.5h

마지막 마이그 + 북마크 mutation으로 데이터 레이어 마무리, 이후 **9개 화면 cross-page 디자인 정합성 점검** (W4에서 옮겨온 코드 품질 점검 포함).

**`/user/[id]` 마이그 (≈ 0.5h)**

- [ ] `src/lib/types/user/response.ts`에 `UserProfileResponse` 추가
- [ ] `src/api/user/user.ts`에 `getUserProfile(id)` 추가
- [ ] `src/hooks/user/use-user-profile.ts`
- [ ] `/user/[id]/page.tsx` client 전환
- [ ] `mock-other-user.ts` 흡수 후 삭제

**Wishlist mutation 낙관적 업데이트 (≈ 2h)**

- [ ] `src/lib/types/wishlist/type.ts` — `WishlistItem`
- [ ] `src/api/wishlist/wishlist.ts` — `getWishlist()`, `addBookmark`, `removeBookmark`
- [ ] `src/hooks/wishlist/use-wishlist.ts`
- [ ] `src/hooks/wishlist/use-toggle-bookmark.ts` — `useMutation` + `onMutate` 낙관적 업데이트 + 실패 시 롤백
- [ ] Week 1 Day 5에서 만든 `wishlist-section.tsx`의 mock 토글 → 실제 mutation 호출
- [ ] `/restaurant/[id]` 헤더 북마크 → `useToggleBookmark` 호출

**최종 mock-* 정리**

- [ ] `src/data/mock-*` 디렉터리에 남은 파일 0개 확인
- [ ] `pnpm lint && npx tsc --noEmit && pnpm build` 그린

**9개 화면 디자인 점검 (≈ 3h)**

순회 대상: `/`, `/restaurant/[id]`, `/review/new`, `/review/new/result`, `/profile`, `/profile/grade`, `/my-places`, `/user/[id]`, `/login`+`/onboarding`

각 화면 체크 (W0 Day 1 표준 기준):
- [ ] 시맨틱 타이포 사용률 ≥ 90% — raw `text-{xs,sm,...} font-*` 조합 잔존 검출
- [ ] 컬러 토큰 — arbitrary hex 0 (Google 로고/Pin SVG 예외만)
- [ ] 카드 톤 통일 — 패딩(`p-4` 위주), 그림자(`shadow-card`), 라운딩(`rounded-card`) 일관
- [ ] 스페이싱 — `gap-{2,3,4,6}` 위주, `[px]` 임의값 정당화 확인
- [ ] 로딩/빈/에러 상태 — 스켈레톤/Empty/Error 톤 일관
- [ ] 반응형 단서 — 모바일 375에서 깨짐 빠른 점검 (정밀 점검은 W4 Wed)
- [ ] 접근성 1차 — 텍스트 대비, 클릭 영역 ≥ 44px, 폼 라벨, alt 텍스트
- [ ] **`frontend-code-reviewer` 에이전트** 1바퀴 — 컨벤션 위반 punch list

**점검 결과 처리**
- [ ] critical(시각 깨짐, 접근성) 즉시 fix
- [ ] minor 메모 → W4 Mon/Tue 버퍼 시간에 처리

> 산출물: 1차 MVP 9개 화면이 실 데이터 + 토큰 표준 위에서 일관된 톤. W4 Wed/Thu/Fri로 깔끔하게 진입.

---

## 다음 주 punch list (→ Week 4)

- 모바일/태블릿/데스크톱 반응형 점검 (Wed)
- PRD 16 플로우 1-1, 1-2, 1-3 통합 QA (Thu)
- Vercel 스테이징 배포 (Fri)
- Mon/Tue: 버퍼 — W3 D5 디자인 점검에서 발견된 minor 이슈 처리

---

## 재사용 우선 점검

| 필요한 것              | 사용할 컴포넌트/패키지                                       |
| ---------------------- | ------------------------------------------------------------ |
| 지도                   | Kakao Maps JS SDK (`NEXT_PUBLIC_KAKAO_MAP_KEY`, `next/script` 로드) |
| 시트 드래그            | `vaul` (이미 설치)                                           |
| 낙관적 업데이트        | `@tanstack/react-query` `useMutation` `onMutate`             |
| URL 쿼리 동기화        | `next/navigation` `useSearchParams`, `useRouter`             |
| 디바운스               | 직접 구현 또는 `useDeferredValue` (React 19)                 |
| 리스트 스켈레톤        | `src/components/core/rank-card-skeleton/index.tsx` (W2 이동) |
