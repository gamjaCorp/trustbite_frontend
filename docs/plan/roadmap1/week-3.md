# Week 3 — 나머지 화면 마이그 + 탐색 탭 동작 + 지도 통합 (5/26~5/30)

## 이번 주 목표

W2에서 만든 표준 절차(`api/` + `hooks/` + `lib/types/`)를 **나머지 화면 4개**에 적용한다.  
동시에 W1에서 UI만 만들어둔 **탐색 탭의 검색/필터/지도**를 동작시켜 탐색 → 상세 → 리뷰 → 결과 → `/profile` 전체 동선이 실 백엔드 API 위에서 굴러가게 만든다.

이 주가 끝나면 `src/data/mock-*` 파일이 모두 사라지고, **1차 MVP 9개 화면이 실 백엔드 위에서 동작**한다.

---

## 일별 요약

| Day | 날짜 | 목표 | 주요 산출물 | 완료 |
|---|---|---|---|---|
| Mon | 5/26 | 탐색 탭 검색/필터 동작 | `api/restaurant/search`, `useSearchRestaurants` (디바운스/URL) | ☐ |
| Tue | 5/27 | 지도 시트 통합 (Kakao Maps SDK) | 시트 30↔70 드래그, 핀 렌더, 영역 재검색 | ☐ |
| Wed | 5/28 | `/restaurant/[id]` 마이그 | `useRestaurantDetail`, 비로그인 분기 정합 | ☐ |
| Thu | 5/29 | `/review/new` + `/my-places` 마이그 | `useSubmitReview` 정합, `useMyRanking`/`useMyStats` | ☐ |
| Fri | 5/30 | `/user/[id]` + Wishlist mutation + 코드 리뷰 | `useUserProfile`, `useToggleBookmark` (낙관적 업데이트) | ☐ |

---

## Day 1 (월 5/26) — 탐색 탭 검색/필터 동작 — ≈ 5~6h

W1 Day 3에서 만든 검색/필터 UI에 동작을 붙인다.

**타입**

- [ ] `src/lib/types/restaurant/request.ts` — `SearchParams` (q, region, category[], context[], sort, page)
- [ ] `src/lib/types/restaurant/response.ts` — `RestaurantListResponse`

**API**

- [ ] `src/api/restaurant/restaurant.ts`에 `searchRestaurants(params: SearchParams)` 추가

**훅**

- [ ] `src/hooks/restaurant/use-search-restaurants.ts`
  - 검색어 300ms 디바운스
  - URL 쿼리 동기화 (`?q=...&category=...&sort=...`)
  - 쿼리 변경 시 자동 재호출

**UI 연결**

- [ ] `search-bar` → 디바운스 → URL → 훅
- [ ] `region-filter`, `sort-filter`, `category-chips`, `context-chips` → URL 즉시 반영
- [ ] 결과 0개: `<Empty>`, 로딩: `<RankCardSkeleton>`
- [ ] "필터 초기화" 버튼

> 산출물: 검색바/필터 조작이 실제로 리스트를 바꿈

---

## Day 2 (화 5/27) — 지도 시트 통합 — ≈ 5~6h

PRD 5장. 탐색 탭을 지도 + 리스트 결합 형태로.

**레이아웃**

- [ ] 탐색 탭: 상단 지도 (기본 30vh) + 하단 시트 (70vh)
- [ ] 시트 드래그 30% ↔ 70% 전환 (`vaul`)

**지도 (Kakao Maps JS SDK)**

- [ ] `NEXT_PUBLIC_KAKAO_MAP_KEY` env 확인
- [ ] `next/script` 동적 로드 설정
- [ ] `src/components/features/explore/map-view.tsx` Kakao SDK 기반으로 재작성
- [ ] 검색 결과 좌표로 핀 렌더
- [ ] 핀 클릭 시 미니 카드 (가게명 + 평점 + 신뢰도%)
- [ ] 일반 핀 / 내가 방문한 곳 핀 구분 (체크 아이콘)
- [ ] 지도 이동/줌 → "이 지역 다시 검색" 버튼 노출 → viewport 좌표로 재검색 (`src/components/features/explore/search-this-area.tsx` 연결)

**정리**

- [ ] `src/app/map/page.tsx` 삭제 (홈 탐색 탭으로 통합)

> 산출물: 지도 + 리스트가 한 화면에서 결합 동작

---

## Day 3 (수 5/28) — `/restaurant/[id]` 마이그 — ≈ 5h

가장 복잡한 화면. 표준 7단계 적용.

**타입**

- [ ] `src/lib/types/restaurant/response.ts`에 `RestaurantDetailResponse` 추가

**API**

- [ ] `src/api/restaurant/restaurant.ts`에 `getRestaurantDetail(id: string)` 추가

**훅**

- [ ] `src/hooks/restaurant/use-restaurant-detail.ts`

**페이지**

- [ ] `src/app/restaurant/[id]/page.tsx` — `'use client'` + `useRestaurantDetail`
- [ ] 로딩: `PhotoGallery` + `ScorePanel` 스켈레톤
- [ ] 404: `notFound()` 호출

**비로그인 분기 정합**

- [ ] middleware/`auth()` 결과로 분기 일관화
- [ ] 미리보기 vs 전체 분기를 컴포넌트 prop으로 명시 (`isPreview: boolean`)

**정리**

- [ ] `src/data/mock-restaurant-detail.ts` 흡수 후 삭제

> 산출물: `/restaurant/[id]`가 React Query로 동작

---

## Day 4 (목 5/29) — `/review/new` + `/my-places` 마이그 — ≈ 5~6h

**`/review/new` 마이그**

- [ ] `src/lib/types/review/request.ts`의 `CreateReviewRequest` 정합 확인
- [ ] W2 Day 5의 `useSubmitReview` 사용 일관화 — 모든 submit 경로가 mutation 통과
- [ ] `review-write-store` (Zustand) 유지 — 단계 전이·선택 가게·사진 상태 관리

**RHF + zod hybrid 적용**

- [ ] `src/lib/types/review/schema.ts` 신규 — `reviewWriteSchema`
  - 가게 선택 필수, 평점 1~5, 텍스트 100자 이상, 사진 0~5장
  - 한국어 에러 메시지
- [ ] `RatingFields`, `ReviewTextField`, `PhotoUploadGrid`를 `Controller`로 RHF에 등록
- [ ] submit: `handleSubmit(onValid)` → `useSubmitReview` mutation
- [ ] 검증 실패: shadcn `<FormMessage>` 한국어 표시

**`/my-places` 마이그**

- [ ] `src/lib/types/restaurant/response.ts`에 `MyRestaurantStats`, `MyRestaurantRankResponse` 추가
- [ ] `src/api/restaurant/my-ranking.ts` 신규 — `getMyRanking()`, `getMyStats()`
- [ ] `src/hooks/restaurant/use-my-ranking.ts`, `use-my-stats.ts`
- [ ] `src/app/my-places/page.tsx` — `'use client'` + 훅
- [ ] 로딩: 스탯 카드 + 리스트 스켈레톤
- [ ] 빈 목록: '아직 리뷰한 맛집이 없어요'

**정리**

- [ ] `src/data/mock-restaurant.ts`의 `mockStats5`, `mockRankList` → api로 흡수 후 삭제 확인

> 산출물: `/my-places` + `/review/new`가 데이터 레이어 위에서 동작

---

## Day 5 (금 5/30) — `/user/[id]` + Wishlist mutation + 코드 리뷰 — ≈ 4h

**`/user/[id]` 마이그**

- [ ] `src/lib/types/user/response.ts`에 `UserProfileResponse` 추가
- [ ] `src/api/user/user.ts`에 `getUserProfile(id: string)` 추가
- [ ] `src/hooks/user/use-user-profile.ts`
- [ ] `src/app/user/[id]/page.tsx` — `'use client'` 전환
- [ ] `src/data/mock-other-user.ts` 흡수 후 삭제

**Wishlist mutation 낙관적 업데이트**

- [ ] `src/lib/types/wishlist/type.ts` — `WishlistItem`
- [ ] `src/api/wishlist/wishlist.ts` — `getWishlist()`, `addBookmark(id)`, `removeBookmark(id)`
- [ ] `src/hooks/wishlist/use-wishlist.ts`
- [ ] `src/hooks/wishlist/use-toggle-bookmark.ts` — `useMutation` + `onMutate` 낙관적 업데이트 + 실패 시 롤백
- [ ] `wishlist-section.tsx`의 mock 토글 → `useToggleBookmark` 호출
- [ ] `/restaurant/[id]` 헤더 북마크 → `useToggleBookmark` 호출

**최종 mock-* 정리**

- [ ] `src/data/mock-*` 파일 0개 확인 (남은 파일 전량 흡수)
- [ ] `src/stores/auth-mock-store.tsx`, `wishlist-mock-store.tsx` 정리 여부 검토
- [ ] `pnpm lint && npx tsc --noEmit && pnpm build` 그린

**코드 리뷰 punch list 수집**

- [ ] `frontend-code-reviewer` 에이전트 1바퀴 — 컨벤션 위반 punch list 수집 (fix는 W4 Day 1)

> 산출물: 1차 MVP 9개 화면이 실 백엔드 API 위에서 동작. W4 진입 준비.

---

## 재사용 점검

| 필요한 것 | 사용 |
|---|---|
| 지도 | Kakao Maps JS SDK (`next/script` 로드) |
| 시트 드래그 | `vaul` (설치됨) |
| 낙관적 업데이트 | `@tanstack/react-query` `useMutation` `onMutate` |
| URL 쿼리 동기화 | `next/navigation` `useSearchParams`, `useRouter` |
| 디바운스 | `useDeferredValue` (React 19) 또는 직접 구현 |
| 리스트 스켈레톤 | `src/components/common/rank-card-skeleton.tsx` |
