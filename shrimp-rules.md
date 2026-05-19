# TrustBite Frontend — AI Agent Development Rules

## Project Overview

- **서비스**: 신뢰도 기반 맛집 지도 (TrustBite)
- **스택**: Next.js 16 App Router + React + TypeScript strict + Tailwind CSS v4 + shadcn/ui
- **상태**: Zustand 5 + React Query 5
- **지도**: Kakao Maps JS SDK (`NEXT_PUBLIC_KAKAO_MAP_KEY`)
- **인증**: NextAuth v5 (`src/auth.ts`, middleware alias `src/proxy.ts`)
- **패키지 매니저**: pnpm 고정 (npm/yarn 사용 금지)
- **번들러**: Turbopack (webpack 설정 추가 금지)

---

## Directory Structure

```
src/app/                         # Next App Router 페이지
  page.tsx                       # 홈 (/)
  signin/page.tsx                # 로그인
  onboarding/page.tsx            # 온보딩
  my-places/page.tsx             # 내 맛집
  profile/page.tsx               # 내 프로필
  restaurant/[id]/page.tsx       # 식당 상세
  restaurant/[id]/review/new/    # 식당 리뷰 작성
  review/new/page.tsx            # 일반 리뷰 작성
  user/[id]/page.tsx             # 타인 프로필

src/components/ui/               # shadcn 원본 — 절대 수정 금지
src/components/core/             # ui/ 프리미티브 래퍼만 (단일 .tsx, 폴더 금지)
src/components/common/           # 도메인 공통 컴포넌트 (features/ 미귀속)
src/components/features/{name}/  # 기능별 컴포넌트

src/lib/category.ts              # 카테고리 → 색 클래스 매핑 (유일한 정의 위치)
src/lib/trust-score.ts           # trustScore → 색 클래스 매핑 (유일한 정의 위치)
src/lib/grade-levels.ts          # 등급 레벨 정의
src/lib/rank.ts                  # 랭킹 유틸
src/lib/utils.ts                 # cn() (clsx + tailwind-merge)
src/lib/types/{feature}/         # schema.ts, request.ts, response.ts, type.ts

src/stores/{name}-store.tsx      # Zustand + Context 패턴 스토어
src/hooks/{feature}/use-*.ts     # React Query 훅
src/data/mock-*.ts               # 목업 데이터
src/stories/{PascalCase}.stories.tsx  # Storybook 스토리 (평탄 구조)
src/types/                       # 레거시 타입 (신규는 src/lib/types/ 사용)
```

---

## Component Placement Rules

### 결정 트리 (순서대로 확인)

1. `src/components/ui/` 에 맞는 shadcn 프리미티브가 있는가?
   - YES → 그대로 사용하거나 `className` prop으로 오버라이드
2. ui/ 프리미티브를 **래핑**해야 하는 재사용 컴포넌트인가?
   - YES → `src/components/core/{component-name}.tsx` (단일 파일, 폴더 금지)
3. 여러 feature에서 쓰이는 도메인 컴포넌트인가?
   - YES → `src/components/common/{component-name}.tsx`
4. 특정 기능/화면에만 쓰이는가?
   - YES → `src/components/features/{feature}/{component-name}.tsx`

### 금지

- `src/components/ui/` 파일 수정이 필요한 경우 직접 수정하지 말고 사용자에게 먼저 확인 후 진행
- `core/` 에 ui/ 래퍼가 아닌 컴포넌트 배치 금지
- `core/foo/index.tsx` 폴더+배럴 구조 금지 → `core/foo.tsx` 단일 파일만
- 새 컴포넌트 생성 전에 위 트리를 반드시 거칠 것

---

## Styling Rules

### Tailwind / globals.css

- **Tailwind 유틸리티 클래스만 사용**. `.css`, `.module.css` 신규 파일 생성 금지
- `style={{ ... }}` 인라인 스타일 금지 (동적 계산값 불가피한 경우만 허용)
- 조건부 클래스 → 반드시 `cn()` (`src/lib/utils.ts`) 사용
- `src/app/globals.css` → `@theme inline { }` 블록 내 토큰 추가만 허용. 그 외 수정 금지
- 임의값 `[px]` 사용 금지. 꼭 필요하면 `@theme inline`에 토큰으로 추가 후 참조

### Color

- 컬러 클래스는 반드시 토큰 기반 (`bg-palette-brand`, `text-primary`, `bg-success` 등)
- 컴포넌트 className에 hex/oklch/rgb 직접 입력 금지
- **카테고리 → 색**: `src/lib/category.ts`의 `CATEGORY_STYLE` 만 사용
- **trustScore → 색**: `src/lib/trust-score.ts`의 `getTrustToneClass()` 만 사용
- 컴포넌트 className에 `text-grade-s` 같은 도메인 의미 직접 박기 금지

### Typography

- 본문: `font-sans` (Pretendard Variable, body 기본 적용)
- 반복되는 타이포 조합 → `globals.css` `@utility` 블록에 시맨틱 이름으로 승격
- 최소 폰트 크기: `text-xs` (12px). `text-[10px]`, `text-[11px]` 등 12px 미만 임의값 금지

---

## Naming & Export Conventions

| 항목 | 규칙 |
|---|---|
| 파일/폴더 | kebab-case |
| 함수/훅 | named export |
| React 컴포넌트 | default export (Next 규약 파일 포함) |
| 컴포넌트 폴더 | `index.tsx` barrel, import 시 `/index` suffix 명시 |

### Import Order

```ts
// 1. React
import { useState } from 'react';
// 2. 3rd-party
import { useQuery } from '@tanstack/react-query';
// 3. @/* alias
import { cn } from '@/lib/utils';
// 4. 상대경로
import { MyComponent } from './my-component';
```

---

## Comment Rules

- **모든 컴포넌트 함수 바로 위**: 한 줄 한국어 설명 주석
  ```tsx
  // 신뢰도 점수를 배지 형태로 표시
  export default function TrustScoreBadge({ score }: Props) {
  ```
- toast 문구, 에러 메시지, 주석 → 한국어
- WHY가 자명하지 않을 때만 주석 작성
- `any` 지양. 불가피하면 `// eslint-disable-line` 와 이유 명시

---

## Form Rules

- **조합**: `react-hook-form` + `zod` + `zodResolver` + shadcn `Form`
- **zod 스키마 위치**: `src/lib/types/{feature}/schema.ts`
- 에러 메시지: 한국어로 zod 스키마 내 직접 명시
- 유효성 실패 → shadcn `<FormMessage>` 로 표시
- **단순 폼** (`/onboarding` 등): `useForm` + `handleSubmit` 전체 RHF
- **다단계·복합 폼** (`/review/new` 등): Zustand store(단계 전이·선택 상태) + RHF `Controller`(필드 검증) 하이브리드

---

## State Management

### Zustand Store 패턴

- 파일: `src/stores/{name}-store.tsx`
- 패턴: Zustand `createStore` + React Context Provider + `useStore` hook
- 기존 `src/stores/review-write-store.tsx` 를 참고 패턴으로 사용

### React Query 훅

- 위치: `src/hooks/{feature}/use-*.ts`
- 명명: `useGet{Resource}`, `useCreate{Resource}`, `useUpdate{Resource}`, `useDelete{Resource}`

---

## Domain Mapping Files (수정 시 주의)

| 파일 | 역할 |
|---|---|
| `src/lib/category.ts` | `Category` → Tailwind 클래스 (`CATEGORY_STYLE`) |
| `src/lib/trust-score.ts` | trustScore → 색 토큰 클래스 (`getTrustToneClass`) |
| `src/lib/grade-levels.ts` | 등급 레벨 정의 (`GradeLevel`) |
| `src/lib/rank.ts` | 랭킹 유틸 |

- 카테고리·등급·신뢰도 색 변경 시 반드시 위 파일만 수정
- 컴포넌트에서 직접 색 지정 금지

---

## 1차 MVP 제외 코드

MVP 제외 기능은 구현 위에 주석 추가:

```ts
// TODO: 1차 MVP 제외 — <이유 또는 기능명>
```

- 주석 달린 코드는 빌드에 포함되어도 UI에서 노출/활성화하지 않는다
- 예시: 포인트 시스템(3차 MVP), 지도 공유 기능

---

## Storybook

- 스토리 위치: `src/stories/{PascalCase}.stories.tsx` (평탄 구조, 하위 폴더 금지)
- 스토리 생성 시 `/generate-story` 스킬 사용

---

## Git & Commits

- **사용자 명시적 요청 없이 커밋 금지**
- 커밋 메시지: 한국어 또는 영어 prefix (`Feat:`, `Fix:`, `Design:`, `Refactor:` 등)

---

## Prohibited Actions

- `src/components/ui/` 파일 수정 시 사용자에게 먼저 확인 후 진행
- `globals.css` 에서 `@theme inline` 외 수정 금지
- 새 `.css` / `.module.css` 파일 생성 금지
- webpack 설정 추가 금지
- npm/yarn 사용 금지 (pnpm만)
- 새 라이브러리 설치 전 기존 deps로 해결 가능한지 먼저 확인
- 12px 미만 폰트 임의값 (`text-[10px]` 등) 금지
- 컴포넌트 className에 hex/rgb/oklch 직접 입력 금지
- `core/` 에 폴더+barrel 구조 금지
- `any` 타입 무분별 사용 금지
- 사용자 요청 없이 커밋 금지

---

## AI Decision Priorities

1. **컴포넌트 배치 의심 시** → 결정 트리 순서대로 (ui → core → common → features)
2. **색/스타일 의심 시** → `lib/category.ts` 또는 `lib/trust-score.ts` 먼저 확인
3. **상태 관리 의심 시** → 서버 상태: React Query, 클라이언트 복잡 상태: Zustand+Context, 로컬 폼 상태: RHF
4. **폼 구현 시** → 단계 수 확인 후 단순/하이브리드 결정
5. **새 유틸 필요 시** → `src/lib/utils.ts` 확장 또는 `src/lib/{name}.ts` 신규 파일
6. **새 타입 필요 시** → `src/lib/types/{feature}/{request|response|type|schema}.ts`
