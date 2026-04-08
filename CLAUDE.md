## 명령어

```bash
npm run dev        # 개발 서버 시작
npm run build      # 프로덕션 빌드
npm run start      # 프로덕션 서버 시작
npm run lint       # ESLint 실행
npm run lint:fix   # 린트 이슈 자동 수정
```

# 프로젝트 개요

TrustBite는 신뢰도 기반 맛집 지도 서비스다.
"나만의 맛집 지도를 만들고, 믿을 수 있는 사람들과 함께 완성하는 플랫폼"

핵심 가치 (우선순위 순):

1. 내 맛집 지도 만들기 — 내 기준으로 기록하고 순위를 매기는 경험
2. 신뢰도 기반 평가 — trustScore가 높을수록 리뷰 영향력 증가
3. 함께 만드는 맛집 지도 — 친구·동료와 공유 지도

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Map**: Naver Maps SDK (`react-naver-maps`)
- **Chart**: Recharts (레이더 차트, 바 차트)
- **State**: Zustand (글로벌), React Query (서버 상태)
- **Form**: React Hook Form + Zod
- **Package Manager**: pnpm

### 파일 네이밍

파일명은 `snake-case`로 작성한다. (예: `my_restaurant_summary_card.tsx`)

### 컴포넌트 구조

- `src/components/ui/` — shadcn/ui 기본 컴포넌트 (직접 수정 금지; `npx shadcn@latest add <component>` 사용)
- `src/components/common/` — 공통 레이아웃 컴포넌트 (예: `Header`)
- `src/components/features/` — 기능별 컴포넌트
- `src/components/providers.tsx` — 루트 `ThemeProvider` (next-themes, class 전략)

### 스타일링

- Tailwind CSS v4, CSS 변수 기반 테마 (`src/app/globals.css`)
- 다크모드: `class` 전략
- 조건부 클래스: `cn()` (`src/lib/utils.ts`) — `clsx` + `tailwind-merge`
- shadcn 컴포넌트는 `class-variance-authority`로 variant 관리

## 디자인 가이드

토스·당근마켓 스타일 — 둥글고 친근하게. 색상은 CSS 변수 사용 (`src/app/globals.css`).

| 용도 | 변수 |
|---|---|
| 브랜드 (주황) | `--primary` / `--primary-foreground` / `--primary-subtle` |
| 등급 (S→D) | `--grade-s` … `--grade-d` |
| TrustScore | `--score-high` … `--score-danger` |
