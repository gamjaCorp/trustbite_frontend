# TrustBite

신뢰도 기반 맛집 평가 서비스의 프론트엔드. 자세한 기획은 [`docs/PRD.md`](./docs/PRD.md), 코드베이스 규약과 디렉터리 구조는 [`.claude/CLAUDE.md`](./.claude/CLAUDE.md)를 참고한다.

## 기술 스택

- **Next.js 16 (App Router)** + **React 19** + **TypeScript 5 (strict)**
- **Tailwind CSS v4** + **shadcn/ui** (new-york)
- **React Query 5**, **Zustand 5**, **NextAuth v5**
- **Storybook 9** (Vitest + Playwright Chromium 브라우저 모드)

## 시작하기

패키지 매니저는 **pnpm** 고정이다.

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

<br/>
