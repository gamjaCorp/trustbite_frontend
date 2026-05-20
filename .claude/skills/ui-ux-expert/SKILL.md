---
name: ui-ux-expert
description: Triggered when the user creates or edits UI/screens, styles components, or asks about Tailwind tokens, colors, typography, layout, dark mode, or card patterns — e.g. "스타일 적용", "디자인 토큰", "타이포", "레이아웃", "다크모드", "card 디자인", "shadcn 컴포넌트 추가", "디자인 규칙". Also load before writing JSX/TSX that contains className or before adding to src/components/{core,features,common}.
version: 0.1.0
---

# UI/UX Expert

TrustBite 프론트엔드의 디자인 토큰·타이포·레이아웃 표준.

## When to apply

- 새 컴포넌트/페이지 작성 시
- `src/components/{core,ui,features,common}` 파일 수정 시
- 색·radius·shadow·spacing 값을 결정할 때
- 단순 문구(텍스트 내용) 수정은 제외

---

## Design tone

토스·당근마켓 스타일 — 둥글고 친근하게. warm/subtle 톤. "Field Book" — 따뜻한 종이 질감 메타포를 베이스로 한다. 채도를 낮게 유지하고 (`paper`, `paper-edge`, `ink` 토큰 활용), hairline 구분선(`border-hairline`)으로 콘텐츠를 나눈다. 카드에 그림자를 지양하고 ring이나 hairline으로 경계를 표현한다. 상호작용은 `hover:bg-muted/30` → `active:bg-primary-subtle/40` 패턴으로 부드럽게.

---

## Tokens

### Color (2-tier 시스템)

**Tier 1 Primitive** — 색 자체만 정의. 컴포넌트에서 직접 참조 금지.

| Primitive | 대표 용도 |
|---|---|
| `palette-brand` | #ff7a00 — 주 브랜드 오렌지 |
| `palette-brand-subtle` | 브랜드 배경 틴트 |
| `palette-green` / `palette-green-subtle` | 긍정·성공 |
| `palette-amber` / `palette-amber-subtle` | 경고 |
| `palette-blue` / `palette-blue-subtle` | 정보 |
| `palette-red` / `palette-red-subtle` | 오류·위험 |
| `palette-gray` / `palette-gray-subtle` | 비활성 |
| `palette-gold` / `palette-silver` / `palette-bronze` | 랭킹 메달 |

**Tier 2 Semantic** — 컴포넌트에서는 이 토큰만 사용한다.

| Semantic token | 매핑 | 사용 맥락 |
|---|---|---|
| `primary` / `primary-foreground` | palette-brand | 주요 CTA, 강조 요소 |
| `primary-subtle` | palette-brand-subtle | primary 배경 틴트 |
| `success` / `success-subtle` | palette-green | 성공 상태 |
| `warning` | palette-amber | 경고 상태 |
| `info` | palette-blue | 정보 메시지 |
| `error` | palette-red | 오류 상태 |
| `muted` / `muted-foreground` | shadcn neutral | 보조 텍스트·배경 |
| `card` / `card-foreground` | shadcn neutral | 카드 표면 |
| `border` | shadcn neutral | 일반 구분선 |
| `paper` | warm off-white | 사이드바·시트 배경 |
| `paper-edge` | warm off-white edge | paper 경계 그림자 틴트 |
| `ink` | warm gray | 좌표·마이크로 텍스트 (작은 보조 텍스트) |

**금지**: `bg-blue-500`, `text-white`, `bg-white/85` 같은 raw Tailwind 컬러 사용 금지. 항상 semantic 토큰을 쓴다.

### Radius

| 토큰 | 값 | 사용 맥락 |
|---|---|---|
| `rounded-chip` | 9999px (pill) | 태그, 배지, chip 버튼 |
| `rounded-card` | 1rem (16px) | 카드, 이미지 컨테이너 |
| `rounded-modal` | 1.5rem (24px) | 바텀시트, 모달, 다이얼로그 |
| `rounded-xl` | 16px | 입력 필드, textarea |
| `rounded-full` | pill | 아바타, 아이콘 원형 버튼 |

### Shadow & 기타 상수

- **그림자 계층**: `shadow-xs`→`shadow-sm`→`shadow-md`→`shadow-lg`→`shadow-xl`. 카드는 `shadow-card` (0 0 0 1px + 2px blur). 카드에 그림자를 쓰기 전 먼저 hairline ring을 시도한다.
- **`--header-height: 91px`** — 헤더 높이 상수. sticky offset에 항상 `top-[var(--header-height)]` 사용. 수치 하드코딩 금지.
- **`border-hairline`** — `border-width: 0.5px`. Tailwind 기본 스케일에 없으므로 `@utility`로 정의됨. 리스트 구분선에 사용.

---

## Typography

`globals.css`의 `@utility` semantic 유틸만 사용한다. **raw `text-3xl font-bold`, `text-sm font-medium` 류 조합 금지.** `letter-spacing: -0.02em`은 모든 유틸에 내장되어 있어 별도 지정 불필요.

| 유틸 | 크기/줄높이/굵기 | 사용 맥락 |
|---|---|---|
| `text-headline-1` | 24px / 32px / 600 | 페이지 제목, 주요 섹션 헤더 |
| `text-headline-2` | 20px / 28px / 600 | 서브 섹션 제목 |
| `text-headline-3` | 16px / 24px / 600 | 다이얼로그·카드 내 소제목 |
| `text-title-1` | 16px / 24px / 600 | 카드 이름, UI 단위 제목 |
| `text-title-2` | 14px / 20px / 600 | 폼 라벨, 보조 제목 |
| `text-title-3` | 14px / 20px / 500 | 중간 강조 텍스트 |
| `text-body-1` | 16px / 24px / 400 | 일반 본문 |
| `text-body-2` | 14px / 20px / 500 | 보조 본문 |
| `text-body-3` | 12px / 16px / 400 | 작은 본문 |
| `text-label-1` | 16px / 24px / 500 | 버튼 텍스트, 입력 필드 내 텍스트 |
| `text-label-2` | 14px / 20px / 600 | 작은 버튼, 배지 텍스트 |
| `text-label-3` | 12px / 16px / 500 | 태그, 칩 텍스트 |
| `text-caption-1` | 14px / 20px / 400 | 보조 설명, hint 텍스트 |
| `text-caption-2` | 12px / 16px / 400 | 마이크로 텍스트, 타임스탬프 |

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

---

## Anti-patterns (현재 코드 내 알려진 위반 — 리뷰 체크리스트)

리뷰어 에이전트가 아래 항목을 검사한다. 이관/수정 대상.

| 위치 | 위반 내용 | 교정 방향 |
|---|---|---|
| `review-card.tsx:41` | `dark:bg-blue-900/30 dark:text-blue-300` — raw Tailwind 컬러 | `bg-palette-blue-subtle` + `text-info` 토큰으로 교체 |
| `regional-rank-card.tsx:99` | `bg-white/85` 하드코딩 — 다크모드 깨짐 | `bg-card/80` 또는 `bg-background/80` 토큰화 |
| `regional-rank-card.tsx:110,128` vs `:114,136` | `text-ink/70` ↔ `text-muted-foreground` 혼용 | 역할별 하나로 통일 (`text-muted-foreground` 권장) |
| `signin/page.tsx:17` | `text-3xl font-bold` raw 타이포 | `text-headline-1` |
| `signin/page.tsx:13` | `max-w-[calc(100vh-97px)]` 헤더 높이 하드코딩 | `var(--header-height)` 사용 |
| `header.tsx:109,122` | `text-sm` raw 타이포 | `text-caption-1` 또는 `text-body-2` |
| `header.tsx:75-93` vs `detail-header.tsx:34-52` | avatar/auth 블록 중복 | `<UserBadge>` common 컴포넌트 추출 후보 |

---

## Reference files

| 파일 | 참조 목적 |
|---|---|
| `src/app/globals.css` | 전체 토큰 소스 (라인 7–243 토큰, 338–441 타이포) |
| `src/components/features/ranking/regional-rank-card.tsx` | 카드 행 구조 표준 |
| `src/components/core/search-input.tsx` | core/ 래퍼 패턴 예시 (InputGroup) |
| `src/components/core/chip-select.tsx` | core/ 래퍼 패턴 예시 (Select) |
| `src/components/common/header.tsx` | 헤더·탭 내비게이션 구조 |
| `src/app/layout.tsx` | 폰트(Pretendard Variable) 로딩, 루트 레이아웃 |
