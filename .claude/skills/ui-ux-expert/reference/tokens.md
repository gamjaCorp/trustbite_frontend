# Tokens — 컬러·Radius·Shadow·상수

컬러, 반경, 그림자 토큰의 상세 정의. 값을 결정할 때 이 파일을 Read한다.

---

## Color — 2-tier 시스템

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

---

## Radius

| 토큰 | 값 | 사용 맥락 |
|---|---|---|
| `rounded-chip` | 9999px (pill) | 태그, 배지, chip 버튼 |
| `rounded-card` | 1rem (16px) | 카드, 이미지 컨테이너 |
| `rounded-modal` | 1.5rem (24px) | 바텀시트, 모달, 다이얼로그 |
| `rounded-xl` | 16px | 입력 필드, textarea |
| `rounded-full` | pill | 아바타, 아이콘 원형 버튼 |

---

## Shadow & 기타 상수

- **그림자 계층**: `shadow-xs`→`shadow-sm`→`shadow-md`→`shadow-lg`→`shadow-xl`. 카드는 `shadow-card` (0 0 0 1px + 2px blur). 카드에 그림자를 쓰기 전 먼저 hairline ring을 시도한다.
- **`--header-height: 91px`** — 헤더 높이 상수. sticky offset에 항상 `top-[var(--header-height)]` 사용. 수치 하드코딩 금지.
- **`border-hairline`** — `border-width: 0.5px`. Tailwind 기본 스케일에 없으므로 `@utility`로 정의됨. 리스트 구분선에 사용.
