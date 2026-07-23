# TrustBite

> 믿을 수 있는 별점, 같이 모으는 맛집

좋아하는 사람과 함께 맛집을 찾고, 별점을 매기고, 우리만의 순위를 만들어가는 **신뢰도 기반 맛집 지도 서비스**입니다.
지도 위에서 맛집을 탐색하고, 마음에 드는 곳을 저장하고, 맥락형 별점으로 리뷰를 남기고, 신뢰도가 반영된 진짜 평점을 확인할 수 있습니다.

---

남자친구와 맛집을 다니면서 먹고 나면 늘 둘이 별점을 매겼습니다. 그런데 좋아하는 사람과 함께 별점을 매기고 우리만의 맛집 순위를 만들어가는 서비스는 어디에도 없었습니다.

맛집을 찾을 때도 마찬가지였습니다. 별점은 어디에나 있지만 어디에서도 믿을 수가 없었습니다. 광고성 리뷰와 조작된 별점이 섞여 있고, 대충 남긴 5점과 정성스러운 리뷰어의 4점이 똑같은 무게로 계산되니까요.

그래서 직접 만들기로 했습니다. TrustBite는 **리뷰어의 신뢰도(trustScore)** 를 별점에 가중치로 반영합니다. 사진·리뷰 충실도, 활동 꾸준함 같은 신호로 사용자마다 0.0~1.0의 trustScore가 매겨지고, 가게 평점은 이렇게 계산됩니다.

```
가게 평점 = Σ(유저별점 × trustScore) / Σ(trustScore)
```

신뢰도 높은 사람의 평가는 무겁게, 의심스러운 평가는 가볍게. 그래서 믿을 수 있는 별점이 되고, 그 위에서 좋아하는 사람과 우리만의 맛집 지도를 만들어갑니다.

## 주요 기능

- **홈 탐색** (`/`) — 카카오 지도 기반 맛집 탐색. 검색·카테고리 필터, 지도 핀 ↔ 리스트 연동, 뷰포트 이동 시 반경 재검색
- **맛집 상세** (`/restaurant/[id]`) — 위치·사진·리뷰와 맥락형 평점(맛/가성비/분위기)
- **리뷰 작성** (`/review/new`) — 항목별 별점 + 상황 태그(혼밥/데이트/회식 등)
- **나의 맛집** (`/my-places`) — 내가 저장·리뷰한 맛집 리스트
- **프로필** (`/profile`, `/user/[id]`) — trustScore 등급 뱃지(새싹 → 미슐랭 6단계), 팔로우·팔로워
- **인증** (`/signin`, `/onboarding`) — NextAuth v5 소셜 로그인과 온보딩

더 자세한 기획은 [`docs/PRD.md`](./docs/PRD.md)에, 코드베이스 규약은 [`.claude/CLAUDE.md`](./.claude/CLAUDE.md)에 있습니다.

## 기술 스택

- **Next.js 16 (App Router)** + **React 19** + **TypeScript 5 (strict)**
- **Tailwind CSS v4** + **shadcn/ui** (new-york)
- **React Query 5**, **Zustand 5**, **NextAuth v5**
- **Kakao Maps** (react-kakao-maps-sdk), **react-hook-form + zod**
- **Storybook 10** (Vitest + Playwright Chromium 브라우저 모드)

## 시작하기

패키지 매니저는 **pnpm**을 사용합니다.

```bash
pnpm install           # 의존성 설치
pnpm dev               # 개발 서버 실행 (http://localhost:3000)
```

### 자주 쓰는 커맨드

```bash
pnpm build             # 프로덕션 빌드
pnpm start             # 빌드된 서버 실행
pnpm lint              # ESLint
pnpm lint:fix          # ESLint 자동 수정
pnpm storybook         # Storybook 개발 (http://localhost:6006)
pnpm build-storybook   # Storybook 정적 빌드
npx tsc --noEmit       # 타입 검사
pnpm exec vitest       # Storybook 스토리 기반 테스트
```
