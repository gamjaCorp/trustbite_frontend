# Radix UI 패키지 구조 확인 — 변경 없음

## Context

사용자가 `package.json` 에 개별 `@radix-ui/react-*` 패키지들이 보이지 않고 `radix-ui` 한 개만 있는 이유를 질문. 구식 shadcn 템플릿에선 `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-popover` 등이 각각 나열되었기 때문에 "설치 누락" 으로 보일 수 있음.

## 조사 결과

- `src/components/ui/*.tsx` 내 모든 Radix import 는 umbrella 패키지 사용:
  - `import { Dialog as DialogPrimitive } from "radix-ui"`
  - `import { Slot } from "radix-ui"` 등
- `node_modules/radix-ui/package.json` 의 dependencies 에 `@radix-ui/react-accordion`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-dialog`, ... 모든 개별 primitive 가 transitive dep 로 포함됨.
- 이 프로젝트의 `components.json` 은 `"style": "new-york"` + shadcn CLI `^3.8.5` 로, 최신 shadcn 기본 템플릿이 umbrella `radix-ui` 를 쓰는 방식으로 2025년 초 전환된 결과.

## 결정

사용자 선택: **현재대로 유지.** umbrella 패턴은 shadcn 공식 기본값이며 기능/성능 차이가 없다. 개별 패키지로의 마이그레이션은 shadcn 컴포넌트 파일 전수 수정이 필요하고 향후 `shadcn add` 업데이트 시 매번 재작업이 발생하므로 비용 대비 이득이 없음.

## 수행할 작업

없음. 이 질문은 정보 확인 요청이었고 코드 변경 없음.

## 검증

`pnpm install` / `pnpm dev` 는 현재 상태에서 정상 동작 (이전 세션에서 검증됨). 추가 조치 불필요.
