# Patterns — 레이아웃·카드·다크모드·core/ui 작성 규칙

---

## Layout patterns (Toss·당근 기준)

| 슬롯 | 기본값 | 레퍼런스 비교 |
|---|---|---|
| 페이지 가로 패딩 | `px-5` (모바일), `lg:px-6` | Toss 16px / 당근 16-20px |
| 페이지 컨테이너 | `max-w-5xl mx-auto px-5 lg:px-6` | — |
| 리스트 행 세로 패딩 | `py-4` (최소), 큰 행은 `py-5` | 당근 리스트 행 16-20px |
| 리스트 행 최소 높이 | `min-h-[56px]` | Toss/당근 터치 타깃 ≥56px |
| 카드 내부 패딩 | `p-5` (기본), 헤더+본문 분리 카드는 `p-6` | Toss 카드 20-24px |
| 섹션 수직 간격 | `space-y-5` 기본, 메이저 섹션 `space-y-6` | Toss 섹션 24-32px |
| 1차 CTA 높이 | `h-12` (모바일 전폭) | Toss "송금하기" 48px |
| 보조 버튼 높이 | `h-10` | 당근 보조 버튼 ~40px |
| 칩/태그 높이 | `h-8` 또는 `h-9` | — |
| sticky 섹션 offset | `top-[var(--header-height)]` | (변경 없음) |
| 하단 fixed CTA 여백 | `pb-24` ~ `pb-28` | (변경 없음) |
| 사이드바 레이아웃 | `grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6` | — |

- **모바일 우선**. 브레이크포인트는 `lg:` 가끔만 사용 (사이드바 split 등). `sm:`은 갤러리 고정 높이 같은 예외 케이스에만.
- 햄버거 메뉴 없음 — 상단 탭 스트립이 모든 뷰포트에서 공유됨.
- floating CTA: `fixed bottom-8 right-8 rounded-chip shadow-lg`.

> `py-3` / `space-y-3` / `h-9` 1차 CTA는 모두 "tight defaults" 위반. 캡션 줄·태그 줄·보조 칸 한정으로만 허용.

---

## Card & list patterns

**랭킹 카드 행 구조** (reference: `src/components/features/ranking/regional-rank-card.tsx`)

```
flex items-center gap-4 px-4 py-4
  ├─ rank medal       w-8 h-8 rounded-full
  ├─ image            w-24 h-24 rounded-card  (위에 bookmark 오버레이: absolute w-7 h-7 rounded-full backdrop-blur-sm)
  ├─ meta + name + CTA stack  (flex-1 min-w-0)
  ├─ vertical hairline  w-px bg-border/60
  └─ score column     text-right shrink-0
```

- **리스트 구분**: 카드 그림자 대신 `border-hairline border-y border-border/60` hairline 사용.
- **hover/active**: `hover:bg-muted/30` → `active:bg-primary-subtle/40`.
- **`<article>` 구분선**: `border-t border-border first:border-t-0` (reference: `review-card.tsx`).
- 이미지가 없는 텍스트 리스트는 `divide-y divide-border` 또는 `border-t` 패턴 통일.

---

## 사이즈 체크리스트 (UX Reference Check 7항목)

UX Reference Check의 `사이즈/패딩` 라인을 채울 때 1회 점검한다.

1. 본문 텍스트가 `text-body-1` (16px) 이상인가? (캡션·메타·타임스탬프 제외)
2. 리스트 행 세로 패딩이 `py-4` 이상이며 행 높이 ≥56px인가?
3. 카드 내부 패딩이 `p-5` 이상인가? (헤더+본문 분리 카드는 `p-6`)
4. 페이지 좌우 패딩이 `px-5` (모바일) / `lg:px-6` 인가?
5. 섹션 사이 간격이 `space-y-5` 이상인가? (작은 그룹은 `space-y-3` 허용)
6. 1차 CTA가 모바일에서 `h-12` 전폭(`w-full`)인가?
7. `text-caption-2` / `text-label-3`이 본문·리스트 제목·버튼 라벨 자리에 들어가지 않았는가?

미달 항목 수: 0=😀 / 1-2=😐 / 3+=😟.

---

## Dark mode

`globals.css:5` — `@custom-variant dark (&:is(.dark *))` + `next-themes`.

- **컴포넌트에 `dark:` 직접 작성하지 않는다**. semantic 토큰이 `.dark {}` 블록에서 자동으로 다크 값으로 교체됨.
- 불가피하게 `dark:` 가 필요한 경우 (palette token이 없는 커스텀 표면): primitive `palette-*` 클래스로 처리하거나 토큰 추가를 우선 검토.
- `paper` / `paper-edge` / `ink`는 다크에서도 warm tone으로 재정의되어 있음 (`globals.css:232–234`).

---

## core/ vs ui/ 작성 규칙

**`src/components/ui/`**: shadcn 직접 수정 금지. `className` prop으로 override.

**`src/components/core/`**: `ui/` 프리미티브 위에 className override로 래핑하는 **단일 `.tsx` 파일**. 폴더+`index.tsx` 배럴 금지.

```tsx
// ✅ core/select-list.tsx — Select 위에 rounded-chip 고정 래핑
<SelectTrigger className={cn('w-fit rounded-chip gap-2 shrink-0', className)}>

// ✅ core/search-input.tsx — InputGroup 위에 h-10 + Search 아이콘 고정 래핑
<InputGroup className={cn('h-10', className)}>
```

- 항상 `className?: string` prop을 받아 `cn()` 으로 머지.
- `core/`의 범위는 **ui/ 래퍼 컴포넌트에 한정**. 도메인 공통 컴포넌트는 `features/` 또는 `common/`에 둔다.
