# W2 Day 1 — 3개 화면 디자인 점검

> 점검 기준일: 5/18 (실제 작성: 5/21)  
> 점검 대상: `/my-places`, `/review/new`, `/restaurant/[id]` 리뷰 섹션  
> 점검 기준: week-2.md Day 1 5축 × ui-ux-expert 스킬 anti-patterns.md

---

## 요약

| 항목 | 결과 |
|---|---|
| Raw hex / oklch / rgb / hsl | **0건** — 전 화면 토큰 일관 사용 |
| `bg-white` / `bg-black` 절대색 | **0건** |
| Tailwind 팔레트 스케일(`text-red-500` 등) | **0건** |
| `text-ink/70` 임의 opacity 혼용 | **7+건** — anti-pattern, 정리 필요 |
| `text-foreground/85` 임의 opacity | **2+건** — 점검 필요 |
| 카드 컨테이너 표기 양식 | **혼재** — `ui/Card + rounded-card` vs `raw div + ring-1 shadow-card` |
| CTA 버튼 크기 | `/review/new` 모바일 CTA `py-3` → `h-12` 미달 |
| 리스트 행 패딩 | my-places `py-4` ✅, review `py-4` ✅ |

---

## 점검 5축 정의

1. **카드 컨테이너** — 패딩/라운딩/그림자/보더 토큰 일관성  
2. **시맨틱 타이포** — `text-foreground`/`text-muted-foreground` 등 정의된 토큰 사용 여부  
3. **컬러 토큰** — raw hex/oklch, `bg-white` 류 절대색 위반  
4. **여백 일관성** — 섹션 간 gap, 카드 내부 spacing, 패딩  
5. **UX 적합성** — 클릭 영역, 정보 위계, 빈 상태 메시지  

---

## 1. `/my-places` 점검 표

| 컴포넌트 | 카드 컨테이너 | 시맨틱 타이포 | 컬러 토큰 | 여백 | UX 적합성 |
|---|---|---|---|---|---|
| `my-places/page.tsx` | — | ✅ | ✅ | ✅ `px-5 pt-6 pb-24` | ✅ FAB `rounded-chip shadow-lg` |
| `my-places-tabs.tsx` | — | ✅ | ✅ | ✅ | ✅ Tabs 구조 |
| `taste-profile-section.tsx` | ⚠️ `rounded-2xl shadow-card` (직접 클래스, ui/Card 미사용) | ✅ `text-body-2 text-headline-2` | ✅ | ✅ `p-5` 이상 | ✅ 레이더 + 4셀 통계 |
| `restaurant-rank-list.tsx` | — | ✅ | ✅ | ✅ | ✅ 필터 칩 |
| `my-restaurant-card.tsx` | ✅ 행 스타일 (`border-t border-border`, 카드 컨테이너 의도 없음) | ⚠️ `text-caption-1 text-ink/70` (rank:49, 카테고리:71, 코멘트:87) — `text-muted-foreground` 권장 | ✅ 절대색 없음 | ✅ `py-4 pl-3 pr-2` | ✅ `hover:bg-muted/30` |
| `wishlist-section.tsx` | ✅ 안내 배너 `bg-primary-subtle/50 border border-primary/15` | ✅ | ✅ | ✅ | ✅ 빈 상태 `Empty` 컴포넌트 사용 |
| `wishlist-item-card.tsx` | ✅ 행 스타일 | ⚠️ `text-caption-1 text-ink/70` (:64 카테고리, :80 태그라인) | ✅ | ✅ `py-4` | ✅ 북마크 해제 `w-10 h-10` 충분 |
| `my-restaurant-summary-card.tsx` | ⚠️ `ui/Card` + `rounded-card` — 다른 카드들의 `rounded-2xl` 패턴과 혼재 | ✅ | ✅ | ✅ `CardContent p-5` | — |

**my-places 발견 사항**

- **카드 표기 양식 혼재**: `my-restaurant-summary-card`는 `ui/Card + rounded-card`이나 `taste-profile-section`은 `rounded-2xl shadow-card` raw div. 패턴 통일 필요.
- **`text-ink/70` 남용**: `my-restaurant-card`, `wishlist-item-card`의 카테고리·코멘트·태그라인 텍스트에서 `text-ink/70` 사용. anti-patterns.md 지적 사항(`text-ink/70 ↔ text-muted-foreground 혼용`). `text-muted-foreground`로 통일 권장.
- **세부 점수 행** `text-caption-2`: anti-patterns.md 전체 66건 중 일부. 점수 레이블(`맛`/`가성비`/`분위기`)은 `text-body-2`로 올려도 됨.

---

## 2. `/review/new` 점검 표

| 컴포넌트 | 카드 컨테이너 | 시맨틱 타이포 | 컬러 토큰 | 여백 | UX 적합성 |
|---|---|---|---|---|---|
| `review-write-form.tsx` (레이아웃) | ✅ `grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6` | ✅ | ✅ | ✅ `px-4|5` | ⚠️ 모바일 CTA `py-3 rounded-xl` → `h-12` 미달 |
| `restaurant-picker.tsx` | ⚠️ `rounded-2xl bg-card ring-1 ring-border p-3 shadow-card` — `p-3` (patterns.md 기준 `p-5` 권장) | ✅ | ✅ | ⚠️ `p-3` | ✅ |
| `target-restaurant-card.tsx` | ⚠️ `rounded-2xl bg-card ring-1 ring-border ... p-4 shadow-card` — `p-4` (권장 `p-5`) | ✅ | ✅ | ⚠️ `p-4` | ✅ |
| `rating-fields.tsx` | ✅ `rounded-xl bg-card ring-1 ring-border px-4 py-3` (입력 행 — `p-5` 예외 허용) | ✅ | ✅ | ✅ | ✅ |
| `star-rating-input.tsx` | — | ✅ | ✅ | ✅ | ✅ 0.5 단위 |
| `scene-tag-selector.tsx` | — | ✅ | ✅ | ✅ | ✅ |
| `review-text-field.tsx` | ✅ `rounded-xl bg-card ring-1 ring-border` | ✅ | ✅ | ✅ | ✅ |
| `photo-upload-grid.tsx` | ✅ `rounded-xl ring-1 ring-border bg-muted` | ✅ | ✅ | ✅ | ✅ |
| `location-verify-banner.tsx` | ✅ `rounded-2xl bg-muted/40 ring-1 ring-border` (disabled 톤 의도적) | ✅ | ✅ | ✅ | ✅ disabled 상태 명시 |
| `trust-delta-card.tsx` | ⚠️ `rounded-2xl bg-card ring-1 ring-border p-3|4 shadow-card` — `p-3` | ✅ | ✅ | ⚠️ `p-3` | ✅ |
| `ranking-preview.tsx` | ⚠️ `rounded-2xl bg-card ring-1 ring-border p-4 shadow-card` — `p-4` | ✅ | ✅ | ⚠️ `p-4` | ✅ |
| `preview-sidebar.tsx` | — (컨테이너 래퍼) | ✅ | ✅ | ✅ | ✅ |
| `MobileSubmitBar` | `bg-background/95 backdrop-blur-sm` | ✅ `text-caption-2 text-title-2` | ✅ | ⚠️ `py-3` 바 패딩 | ❌ CTA `py-3 rounded-xl` — 모바일 1차 CTA는 `h-12 w-full` 필요 |

**review/new 발견 사항**

- **카드 패딩 p-3/p-4**: 사이드바 카드들이 `p-3`~`p-4`. patterns.md 기준 카드 내부 패딩 `p-5`. 폼 환경 특성상 조밀하게 쓴 의도이지만 Toss/당근 기준 미달. W2-2에서 통합 시 `p-4` 이상으로 올리는 방향 검토.
- **MobileSubmitBar CTA**: `py-3 rounded-xl px-6` → anti-patterns.md "1차 CTA `h-9`(16건) 우세" 패턴과 동일. `h-12 w-full rounded-xl`로 교체 필요.
- **사이드바 카드 패턴은 일관**: `rounded-2xl + bg-card + ring-1 ring-border + shadow-card` 조합이 5+회 반복. Day 2 `core/place-card.tsx` 추출의 기준선이 됨.

---

## 3. `/restaurant/[id]` 리뷰 섹션 점검 표

| 컴포넌트 | 카드 컨테이너 | 시맨틱 타이포 | 컬러 토큰 | 여백 | UX 적합성 |
|---|---|---|---|---|---|
| `my-review-section.tsx` | ✅ `rounded-2xl bg-primary-subtle ring-1 ring-primary/20 p-4` | ⚠️ `text-ink/70` (:110,:133,:157 메타텍스트) | ✅ | ✅ `p-4` (내 리뷰 섹션 — `p-5`로 올릴 여지) | ✅ 드롭다운 메뉴 수정/삭제 |
| `review-filter-bar.tsx` | — (컨테이너 없음) | ✅ | ✅ | ✅ `px-6 pt-10 space-y-3` | ✅ 칩 필터 |
| `logged-out-review-gate.tsx` | ✅ `border border-border bg-background rounded-xl` | ✅ | ✅ | ✅ | ✅ LoginCtaDialog 연동 |
| `review-card.tsx` | ⚠️ `px-6 py-4 border-t border-border first:border-t-0` — 타인 리뷰 카드 컨테이너 없음. 내 리뷰(`primary-subtle` 외곽)와 위계 비대칭 | ⚠️ 본문 `text-body-2 text-foreground/85` (:69) — `text-body-1 text-foreground` 권장. 점수 행 `text-body-2 text-ink/70` (:55) — `text-muted-foreground` 권장 | ✅ | ✅ `py-4` | ✅ "더보기" 펼치기 |
| `review-cta-bar.tsx` | ✅ `border-t border-border bg-background` | ✅ | ✅ | ✅ | ✅ `rounded-full bg-primary` 원형 버튼 |
| `delete-review-dialog.tsx` | ✅ `DialogContent rounded-3xl` | ✅ | ✅ | ✅ | ✅ 파괴적 액션 confirm |

**restaurant 리뷰 섹션 발견 사항**

- **타인 리뷰 vs 내 리뷰 위계 비대칭**: `my-review-section`은 `rounded-2xl bg-primary-subtle ring-1 ring-primary/20` 외곽이 있고, `review-card`(타인 리뷰)는 `border-t`만 — 시각 위계가 역전될 수 있음(내 리뷰가 더 부각). 타인 리뷰에 경량 외곽(`bg-card ring-1 ring-border/50 rounded-xl`) 도입 또는 내 리뷰 외곽 경량화 검토.
- **`review-card` 본문 `text-body-2`**: 본문(`:69`)이 `text-body-2`(15px). patterns.md "본문 텍스트 16px(`text-body-1`) 이상" 기준 미달. `text-body-1 text-foreground`로 교체.
- **`text-foreground/85`**: anti-patterns.md에는 없지만 opacity 슬래시 임의 사용. `text-foreground`로 통일.
- **`text-ink/70`**: `my-review-section`(:110,:133,:157) 및 `review-card`(:55) 점수 레이블. `text-muted-foreground`로 통일.

---

## Day 2 리팩토링 후보 (우선순위 순)

| 우선순위 | 항목 | 대상 파일 | Week-2.md Day 2 매핑 |
|---|---|---|---|
| **P1** | **카드 셸 통합** — `rounded-2xl + bg-card + ring-1 ring-border + shadow-card` 패턴을 `core/place-card.tsx`로 추출. review/new 사이드바 카드 5종 + 기타 활용 카드에 적용. `my-restaurant-summary-card`도 동일 패턴으로 전환 | `review-write/restaurant-picker.tsx`, `target-restaurant-card.tsx`, `trust-delta-card.tsx`, `ranking-preview.tsx`, `my-restaurant-summary-card.tsx` | **(1) 맛집 카드 컨테이너 통합** |
| **P1** | **리뷰 본문 타이포 교체** — `text-body-2` → `text-body-1`, `text-foreground/85` → `text-foreground` | `review-card.tsx:69` | **(2) 점수/배지 정리** 연계 |
| **P1** | **`text-ink/70` → `text-muted-foreground` 통일** — my-restaurant-card, wishlist-item-card, review-card, my-review-section에 산재 | `my-restaurant-card.tsx:49,71,87`, `wishlist-item-card.tsx:64,80`, `review-card.tsx:55`, `my-review-section.tsx:110,133,157` | **(2) 점수/배지 정리** |
| **P1** | **MobileSubmitBar CTA `h-12 w-full`** — 모바일 1차 CTA 사이즈 교정 | `review-write-form.tsx` MobileSubmitBar | **(1) 컨테이너 통합** 후속 |
| **P2** | **타인 리뷰 카드 컨테이너** — `review-card.tsx`에 경량 외곽 도입해 내 리뷰와 위계 균형화 | `review-card.tsx` | **(4) 리뷰 결과 카드 모듈화** |
| **P2** | **카드 패딩 p-3 → p-4** — `restaurant-picker`, `trust-delta-card` 등 사이드바 카드의 `p-3`을 `p-4`로 | `restaurant-picker.tsx`, `trust-delta-card.tsx` | **(1) 컨테이너 통합** |
| **P3** | **위시리스트 안내 배너 알파 정리** — `bg-primary-subtle/50 border border-primary/15` → `bg-primary-subtle border border-primary/20` 단순화 | `wishlist-section.tsx:64` | 별도 폴리시 |

---

## W2-2 Day 2 작업 박스 매핑

| Day 2 박스 | 이번 점검에서 확인된 리팩토링 대상 |
|---|---|
| **(1) 맛집 카드 컨테이너 통합** | `restaurant-picker`, `target-restaurant-card`, `trust-delta-card`, `ranking-preview`, `my-restaurant-summary-card` 5종 → `core/place-card.tsx` 추출 |
| **(2) 점수/배지 류 정리** | `text-ink/70` → `text-muted-foreground` 전체 통일, `review-card` 본문 `text-body-1` 교체, `text-foreground/85` → `text-foreground` |
| **(3) 로딩/빈 상태 표준화** | 직접 확인된 사례 없음 (my-places는 이미 `Empty` 컴포넌트 사용 ✅). Week-1 기준 다른 화면에서 즉석 skeleton 사용 여부 별도 점검 |
| **(4) 리뷰 결과 카드 모듈화** | `review-card.tsx` 타인 리뷰 컨테이너 도입 + 내 리뷰 외곽 톤 균형화 |

---

## 종료 조건 체크

- [x] 3개 화면 × 5축 이슈 체크리스트 작성 완료
- [x] Day 2 리팩토링 대상이 우선순위와 함께 구체적으로 명시됨
