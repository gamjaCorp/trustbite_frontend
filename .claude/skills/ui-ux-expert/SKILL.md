---
name: ui-ux-expert
description: Triggered when the user creates or edits UI/screens, styles components, or asks about Tailwind tokens, colors, typography, layout, dark mode, or card patterns — e.g. "스타일 적용", "디자인 토큰", "타이포", "레이아웃", "다크모드", "card 디자인", "shadcn 컴포넌트 추가", "디자인 규칙". Also load before writing JSX/TSX that contains className or before adding to src/components/{core,features,common}.
version: 0.2.0
---

# UI/UX Expert

TrustBite 프론트엔드의 디자인 표준 + 디자인 결과물 자체 점검.

## When to apply

- 새 컴포넌트/페이지 작성 시
- `src/components/{core,ui,features,common}` 파일 수정 시
- 색·radius·shadow·spacing 값을 결정할 때
- 단순 문구(텍스트 내용) 수정·lint fix는 제외

---

## Design tone

토스·당근마켓 스타일 — 둥글고 친근하게. warm/subtle 톤. "Field Book" — 따뜻한 종이 질감 메타포를 베이스로 한다. 채도를 낮게 유지하고 (`paper`, `paper-edge`, `ink` 토큰 활용), hairline 구분선(`border-hairline`)으로 콘텐츠를 나눈다. 카드에 그림자를 지양하고 ring이나 hairline으로 경계를 표현한다. 상호작용은 `hover:bg-muted/30` → `active:bg-primary-subtle/40` 패턴으로 부드럽게.

---

## Reference index (필요할 때만 Read)

스킬 본문에는 룰만 두고, 구체 값/표는 아래 파일에서 찾는다.

| 언제                                               | 파일                                                     |
| -------------------------------------------------- | -------------------------------------------------------- |
| 컬러·radius·shadow·헤더상수 정할 때                | `.claude/skills/ui-ux-expert/reference/tokens.md`        |
| 텍스트 유틸 고를 때                                | `.claude/skills/ui-ux-expert/reference/typography.md`    |
| 카드/리스트/레이아웃/다크모드/core vs ui 작성 규칙 | `.claude/skills/ui-ux-expert/reference/patterns.md`      |
| 리뷰 시 알려진 위반 확인                           | `.claude/skills/ui-ux-expert/reference/anti-patterns.md` |

**원칙**: 위 파일 중 하나라도 필요하면 즉시 Read한다. 추측 금지.

---

## 절대 금지 (요약)

- **raw Tailwind 컬러** (`bg-blue-500`, `text-white`, `bg-white/85`) — 항상 semantic 토큰
- **raw 타이포 조합** (`text-3xl font-bold`) — 항상 `text-*` 시맨틱 유틸
- **컴포넌트에 `dark:` 직접 작성** — `paper`/`paper-edge`/`ink` 등 토큰 우선
- **헤더 높이 하드코딩** — `top-[var(--header-height)]` 사용
- **`src/components/ui/` 직접 수정** — `className`으로 override
- **`core/foo/index.tsx` 폴더+배럴** — `core/`는 단일 `.tsx` 파일
- global.css 수정이 필요하면 수정할건지 사용자에게 질문할 것.
- **caption-weighted 기본값 금지** — 본문 기본은 `text-body-1` (16px). `text-caption-2`/`text-label-3`는 메타·타임스탬프·태그 한정. 본문·리스트 1차 텍스트·버튼 라벨에 사용 금지.
- **Tight defaults 금지** — 본문 < 16px, 리스트 행 `py < 4`, 카드 `p < 5`, 섹션 `space-y < 5`, 1차 CTA `h < 12`는 명시적 이유 없으면 사용 금지. Toss·당근 기준.

---

## UX Reference Check (1회)

이 스킬이 트리거된 디자인 작업이 끝나는 시점에 **딱 한 번** 결과물을 자체 비평한다.
규칙 준수 체크(토큰/타이포)와는 별개로, "사용자가 봤을 때 좋은가"를 레퍼런스에 비유해서 판단.

### 언제 수행

- 컴포넌트/페이지를 새로 만들거나 시각적으로 수정한 작업이 끝난 직후 1회.
- 같은 턴 안에서 여러 파일을 다뤘으면 묶어서 한 번만.
- **스킵**: 단순 문구 수정, lint fix, 토큰 이름만 바꾸는 리네이밍, 이 스킬이 로드되지 않은 일반 작업.

### 레퍼런스 선택

- **앵커 (항상 포함)** — 토스, 당근마켓. TrustBite의 친근/warm 톤 기준점.
- **상황별 보조 1개** — 화면 성격에 맞춰 고른다.
  - 지도/장소 → 네이버지도, 카카오맵
  - 랭킹/리스트 → 에어비앤비, 야놀자
  - 프로필/통계 → 노션, 링크드인
  - 리뷰/피드 → 인스타, 캐치테이블
  - 폼/온보딩 → 토스 가입 플로우

### 출력 형식 (고정)

```
### 🔍 UX 체크 (1회)
- **정보 위계**: 😀/😐/😟 — <한 문장>
- **일관성**: 😀/😐/😟 — <한 문장>
- **친근함/톤**: 😀/😐/😟 — <한 문장>
- **사이즈/패딩**: 😀/😐/😟 — 본문 16px / 리스트 행 py-4↑ / 카드 p-5↑ / 섹션 space-y-5↑ / 1차 CTA h-12 충족 (Toss·당근 기준, 체크리스트는 patterns.md)
- **레퍼런스 비유**: <앵커 + 보조 1개와의 비유 1~2문장 (구체적으로)>
- **개선 포인트**: <있을 때만 1~2줄. 없으면 "없음">
```

### 원칙

- **비평만**, 자동 수정 금지. 적용은 사용자 결정.
- 한 턴에 한 번. 사용자가 "다시 봐줘"라고 하면 그때 재실행.
- 비유는 구체적으로 — "토스 송금 카드처럼 금액이 가장 굵게 위로 잡혀 한눈에 읽힌다"
  추상적인 "토스 느낌" 류는 피한다.
- 사이즈/패딩 라인은 `patterns.md`의 **사이즈 체크리스트 7항목** 중 미달 개수로 이모지 결정 (0=😀 / 1-2=😐 / 3+=😟).

---

## Reference files (코드 내 예시)

| 파일                                                     | 참조 목적                                        |
| -------------------------------------------------------- | ------------------------------------------------ |
| `src/app/globals.css`                                    | 전체 토큰 소스 (라인 7–243 토큰, 338–441 타이포) |
| `src/components/features/ranking/regional-rank-card.tsx` | 카드 행 구조 표준                                |
| `src/components/core/search-input.tsx`                   | core/ 래퍼 패턴 예시 (InputGroup)                |
| `src/components/core/select-list.tsx`                    | core/ 래퍼 패턴 예시 (Select)                    |
| `src/components/common/header.tsx`                       | 헤더·탭 내비게이션 구조                          |
| `src/app/layout.tsx`                                     | 폰트(Pretendard Variable) 로딩, 루트 레이아웃    |
