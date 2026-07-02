# review-write feature

리뷰 작성 페이지 (`/review/new`, `/restaurant/[id]/review/new`).  
두 라우트 모두 `ReviewWriteForm` 진입점 하나를 공유한다.

---

## 진입점

### `index.tsx`

| 컴포넌트 | 역할 |
|---|---|
| `ReviewWriteForm` | Provider 래퍼. `initialSelectedRestaurant`·`initialDraft`를 받아 store를 초기화하고 `ReviewWriteFormInner`를 렌더한다. |
| `ReviewWriteFormInner` | 폼 전체 레이아웃. store에서 상태를 읽어 제출·결과 다이얼로그 흐름을 조율한다. |
| `DimmedWhilePicking` | 가게가 선택되지 않은 동안 자식 영역을 흐리게 하고 `inert`로 인터랙션을 차단한다. |

---

## 로직 모듈

### `stores/review-write-store.tsx`

Zustand + Context 패턴의 feature 전용 store.  
별점·태그·텍스트·사진을 하나의 store에서 관리하고, selector hook을 통해 컴포넌트에 노출한다.

| export | 역할 |
|---|---|
| `ReviewWriteProvider` | Context + store 초기화. Provider 밖에서 hook 호출 시 에러. |
| `useSelectedRestaurant` | 현재 선택된 음식점 |
| `useReviewRating(dim)` | 맛·가성비·분위기 각 점수 |
| `useReviewSceneTags` | 선택된 상황 태그 목록 |
| `useReviewText` | 리뷰 텍스트 |
| `useReviewPhotos` | 업로드한 사진 목록 |
| `useReviewActions` | setSelectedRestaurant / setRating / toggleScene / setText / addPhotos / removePhoto / reset |
| `useReviewAvgScore` | 세 점수 평균 (하나라도 0이면 0 반환) |
| `useReviewIsValid` | reviewSchema 통과 여부 — 제출 버튼 활성 게이트 |
| `useReviewTrustDelta` | 현재 입력 기준 신뢰도 증가량(%) |
| `useReviewTextLength` | 텍스트 글자 수 |
| `useReviewPhotoCount` | 사진 수 |
| `useReviewIsEditMode` | 수정 모드 여부 |
| `ReviewDraft` | 초안 타입 (수정 모드 prefill) |
| `ReviewResultSnapshot` | 제출 결과 스냅샷 타입 |
| `SelectedRestaurant` | 선택된 음식점 타입 |

### `build-review-snapshot.ts`

순수 함수 `buildReviewSnapshot`. store 상태를 받아 `ReviewResultSnapshot`을 계산한다.  
`computeTrustBreakdown` + `computeNextTrustScore`(`lib/domain/trust-delta`)를 호출하며, UI 의존이 없다.

### `schema.ts`

Zod 스키마 `reviewSchema`. `useReviewIsValid`의 단일 출처.  
별점은 0.5 단위, 사진은 최대 4장, 텍스트는 제출 필수 아님(100자 이상은 신뢰도 보너스).

### `type/grade-context.ts`

`GradeContext` 인터페이스. 유저 등급·신뢰도 관련 6개 필드를 묶은 타입.  
page에서 props로 내려오고, `mock-review-config.ts`의 `MOCK_GRADE_CONTEXT`가 현재 목 구현이다.

---

## fields/ — 폼 입력 컴포넌트

| 파일 | 컴포넌트 | 역할 |
|---|---|---|
| `field-group.tsx` | `FieldGroup` | 라벨·필수 별표·힌트·labelRight + children을 감싸는 레이아웃 쉘. store 의존 없음. |
| `field-hints.tsx` | `ReviewHint` | 100자 돌파 시 신뢰도 보너스 힌트 표시 (FieldGroup hint 슬롯) |
| | `ReviewCharCount` | 현재 글자 수 카운터 (FieldGroup labelRight 슬롯) |
| | `PhotoHint` | 사진 첨부 시 신뢰도 보너스 힌트 (FieldGroup hint 슬롯) |
| `restaurant-picker.tsx` | `RestaurantPicker` | 음식점 검색·선택 UI. 검색어 없으면 최근 방문 목록 6개 표시. 선택 시 store에 write. |
| `target-restaurant-card.tsx` | `TargetRestaurantCard` | 음식점 선택 후 나타나는 카드. 다시 선택 버튼으로 picker로 돌아간다. |
| `rating-fields.tsx` | `RatingFields` | 맛·가성비·분위기 별점 입력 묶음. 각 항목은 `RatingRow` + `StarRatingInput`. |
| `star-rating-input.tsx` | `StarRatingInput` | 0.5점 단위 별점 입력. 좌절반=N-0.5점, 우절반=N점. 키보드(화살표) 지원. |
| `scene-tag-selector.tsx` | `SceneTagSelector` | 혼밥·데이트·회식·다이어트 태그 다중 선택. store의 `toggleScene` 호출. |
| `review-text-field.tsx` | `ReviewTextField` | 리뷰 텍스트 자유 입력. store의 `setText` 호출. |
| `photo-upload-grid.tsx` | `PhotoUploadGrid` | 사진 업로드 그리드 (최대 4장). `URL.createObjectURL` 미리보기, 삭제 시 revoke. |
| `location-verify-banner.tsx` | `LocationVerifyBanner` | 위치 인증 UI (2차 MVP 예정). 현재 비활성 상태로 표시만 함. |
| `mobile-submit-bar.tsx` | `MobileSubmitBar` | 모바일 전용 하단 고정 제출 바. 신뢰도 변화(base → next) + 제출 버튼. lg 이상 hidden. |

---

## preview/ — 데스크톱 사이드바

| 파일 | 컴포넌트 | 역할 |
|---|---|---|
| `preview-sidebar.tsx` | `PreviewSidebar` | 사이드바 레이아웃 쉘. `TrustDeltaCard`와 `RankingPreview`를 세로로 배치. sticky. |
| `trust-delta-card.tsx` | `TrustDeltaCard` | 신뢰도 변동 미리보기 (base → next, progress bar). 데스크톱 제출 버튼 포함. |
| `ranking-preview.tsx` | `RankingPreview` | 별점 입력 시 내 맛집 랭킹에서 새 가게 위치가 실시간으로 시뮬레이션됨. |

---

## review-result/ — 제출 완료 다이얼로그

| 파일 | 컴포넌트 | 역할 |
|---|---|---|
| `index.tsx` | `ReviewResultDialog` | Dialog 껍데기. `ReviewResultSnapshot`을 받아 하위 카드들을 배치. |
| `trust-score-change-card.tsx` | `TrustScoreChangeCard` | 제출 후 신뢰도 점수 증가를 800ms 숫자 카운트업 애니메이션으로 표시. |
| `contribution-checklist.tsx` | `ContributionChecklist` | 신뢰도 상승 항목 체크리스트 (꾸준함·사진·100자). `TrustBreakdown` 기반. |
| `grade-progress-card.tsx` | `GradeProgressCard` | 현재 등급 진행 바 + 다음 등급까지 남은 리뷰 수. 클릭 시 `/profile`로 이동. |

---

## 데이터 흐름 요약

```
page.tsx (server)
  └─ MOCK_GRADE_CONTEXT (mock, Day3에 API로 교체)
  └─ candidates, myTopRestaurants (mock restaurant data)
       │
       ▼
ReviewWriteForm (client boundary)
  └─ ReviewWriteProvider ── ReviewWriteStore
       └─ ReviewWriteFormInner
            ├─ fields/*       store write
            ├─ PreviewSidebar store read (실시간 미리보기)
            └─ MobileSubmitBar store read
                   │ onSubmit
                   ▼
             buildReviewSnapshot → ReviewResultSnapshot
                   │
                   ▼
             ReviewResultDialog
```
