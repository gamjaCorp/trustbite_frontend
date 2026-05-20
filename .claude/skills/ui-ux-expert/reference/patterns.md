# Patterns — 레이아웃·카드·다크모드·core/ui 작성 규칙

---

## Layout patterns

```
페이지 컨테이너  max-w-5xl mx-auto px-6
하단 여백        pb-24 ~ pb-28  (fixed CTA 버튼 공간 확보)
수직 간격        space-y-4 / space-y-5 / space-y-6
sticky 섹션      sticky top-[var(--header-height)] z-10
사이드바 레이아웃  grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6
```

- **모바일 우선**. 브레이크포인트는 `lg:` 가끔만 사용 (사이드바 split 등). `sm:`은 갤러리 고정 높이 같은 예외 케이스에만.
- 햄버거 메뉴 없음 — 상단 탭 스트립이 모든 뷰포트에서 공유됨.
- floating CTA: `fixed bottom-8 right-8 rounded-chip shadow-lg`.

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
// ✅ core/chip-select.tsx — Select 위에 rounded-chip 고정 래핑
<SelectTrigger className={cn('w-fit rounded-chip gap-2 shrink-0', className)}>

// ✅ core/search-input.tsx — InputGroup 위에 h-10 + Search 아이콘 고정 래핑
<InputGroup className={cn('h-10', className)}>
```

- 항상 `className?: string` prop을 받아 `cn()` 으로 머지.
- `core/`의 범위는 **ui/ 래퍼 컴포넌트에 한정**. 도메인 공통 컴포넌트는 `features/` 또는 `common/`에 둔다.
