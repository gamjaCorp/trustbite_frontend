# Week 0 — 디자인 파운데이션

## 이번 주 목표

W1 시작(5/12) 전에 **이미 정의된 디자인 시스템에 코드를 정렬**시킨다.

- `globals.css`의 시맨틱 타이포 유틸(`text-headline-*`, `text-title-*`, `text-body-*`, `text-label-*`, `text-caption-*`)은 L277~369에 완비되어 있으나 사용이 거의 0%. raw `text-xs/sm/...` 클래스 339회가 시스템을 우회하는 상태.
- `common/` 컴포넌트들이 CLAUDE.md 컨벤션(`core/` kebab-case + index.tsx barrel) 미적용 상태. 카드 11개가 features/* 8개 도메인에 흩어져 있어 패딩/그림자/라운딩이 제각각.

이 주가 끝나면 **W1 신규 화면 4개가 통일된 토대 위에** 얹힐 수 있다.

---

## 일별 요약

| Day | 날짜 | 목표                                                       | 주요 산출물                                                               | 완료 |
| --- | ---- | ---------------------------------------------------------- | ------------------------------------------------------------------------- | ---- |
| Thu | 5/8  | 라우트 구조 정리 + 타이포 시맨틱 + 컬러 토큰 체크           | route rename + 타이포 시맨틱화 + arbitrary hex 0 (Google 로고 예외)        | ☐    |
| Fri | 5/9  | `core/` 정착 + 카드 패턴 통일 + hex/shadow 토큰화          | `core/header/*`, `core/grade-badge/*` 등, hex 7→0                         | ☐    |
| Sat | 5/10 | 레퍼런스 화면 (홈 `/`) + `pnpm design:check` 자동화        | 표준 적용 페이지 1개, 위반 검출 그린                                      | ☐    |
| Sun | 5/11 | 버퍼 — 시각 보정 + W1 진입 준비                            | `pnpm lint && npx tsc --noEmit && pnpm build` 그린                        | ☐    |

---

## 타이포 매핑 가이드

| raw 조합                                        | 시맨틱 이름                               | 사이즈 (px/lh/weight) |
| ----------------------------------------------- | ----------------------------------------- | --------------------- |
| `text-2xl font-bold` (페이지 타이틀)            | `text-headline-1`                         | 24/32/600             |
| `text-xl font-bold` (섹션 타이틀)               | `text-headline-2`                         | 20/28/600             |
| `text-lg font-semibold` (서브 섹션)             | `text-headline-3`                         | 16/24/600             |
| `text-base font-semibold` (카드 제목)           | `text-title-1`                            | 16/24/600             |
| `text-sm font-semibold` (작은 카드 제목)        | `text-title-2`                            | 14/20/600             |
| `text-sm font-medium` (강조 본문)               | `text-title-3` 또는 `text-body-2` (문맥) | 14/20                 |
| `text-base` (본문)                              | `text-body-1`                             | 16/24/400             |
| `text-sm` (보조 본문)                           | `text-body-2`                             | 14/20/500             |
| `text-xs` 카드 본문/메타 — **승격 대상**        | `text-body-2`                             | 14/20 (12 → 14 승격)  |
| `text-xs` 타임스탬프/보조 라벨 — 유지           | `text-caption-2`                          | 12/16/400             |
| `text-sm font-medium` (버튼 라벨)               | `text-label-2`                            | 14/20/600             |
| `text-xs font-medium` (작은 라벨)               | `text-label-3`                            | 12/16/500             |

> **승격 원칙**: `text-xs`(12px)는 타임스탬프·인덱스 번호 등 진짜 보조 메타에만 남긴다. 카드 본문/메타가 빽빽하게 12px인 곳은 `text-body-2`(14px)로 의도적으로 끌어올린다.

---

## Day 1 (목) — 라우트 재구조 + 타이포 시맨틱 + 컬러 토큰 체크 — ≈ 6~7h

### 1부 — 라우트 재구조화 (≈ 1.5h)

`/me`/`/my`가 한 글자 차이라 헷갈리는 문제 해결. **Option B**: 의미별 분리 + URL이 직관적.

| 변경 전                           | 변경 후                                |
| --------------------------------- | -------------------------------------- |
| `/me`                             | `/profile`                             |
| `/me/grade`                       | `/profile/grade`                       |
| `/my?tab=ranking\|wishlist`       | `/my-places?tab=ranking\|wishlist`     |
| 홈 `?tab=explore\|my`             | `/` (탐색만, 단일 콘텐츠) — `/my-places` 분리 |

**파일 이동**
- [ ] `src/app/me/page.tsx` → `src/app/profile/page.tsx`
- [ ] `src/app/me/grade/page.tsx` → `src/app/profile/grade/page.tsx`
- [ ] `src/app/my/page.tsx` → `src/app/my-places/page.tsx`
- [ ] 빈 `src/app/me/`, `src/app/my/` 삭제

**링크/네비 갱신**
- [ ] `src/components/common/Header.tsx` 네비 항목 `{ href: '/my' }` → `'/my-places'`, `href="/me"` → `'/profile'`
- [ ] `src/components/features/my-profile/profile-summary-card.tsx` `href="/my"` → `'/my-places'`
- [ ] 프로젝트 전체 grep으로 `'/me'`, `'/me/grade'`, `'/my'` 문자열 사용처 모두 갱신
- [ ] `'/login?next=/me'` 같은 redirect 경로도 같이 갱신

**※ 변경하지 않는 것** (이름이 비슷하지만 라우트 아님):
- `src/components/features/my-profile/`, `my-restaurant/` 폴더 (feature 이름)
- `MyProfileView`, `useMyRanking`, `getMyStats` 등 코드 식별자
- `mock-my-profile.ts` 같은 mock 파일명

**홈 2탭 → 단일 탐색 결정**:
- 홈은 탐색 전용 (`/` 단일 콘텐츠)
- "나의 맛집" 진입은 헤더/하단 nav에서 `/my-places`로 이동

**점검**
- [ ] `pnpm dev` — `/profile`, `/profile/grade`, `/my-places` 진입 확인
- [ ] 헤더 nav 클릭 동선 확인
- [ ] `grep -rn "'/me\|'/my\|\"/me\|\"/my" src/` → 0건 (feature 폴더명 매치 제외)

### 2부 — 타이포 시맨틱 마이그레이션 + 컬러 토큰 체크 (≈ 5h)

> 타이포 마이그가 모든 컴포넌트를 한 번 훑는 작업이므로, **그 김에 컬러 토큰 위반도 같은 패스에서 체크**한다. 별도 패스를 다시 도는 비용을 아낌.

**준비**
- [ ] `globals.css` L277 위에 매핑 가이드 주석 박기 (위 표 기준)
- [ ] 현황 grep — 치환 전 베이스라인 기록:
  ```bash
  grep -rn "text-\(xs\|sm\|base\|lg\|xl\|2xl\) font-" src/ | wc -l   # 타이포 raw 조합
  grep -rn "text-xs" src/components src/app | wc -l                  # 12px 사용처
  grep -rn "#[0-9a-fA-F]\{3,6\}\b" src/components src/app --include="*.tsx" | wc -l  # hex 직접 사용
  grep -rn "text-\[#\|bg-\[#\|border-\[#" src/ | wc -l                # arbitrary hex 클래스
  ```

**컬러 토큰 매핑 (참고)** — `globals.css @theme inline` 기 정의 토큰
- 브랜드: `bg-primary`, `text-primary-foreground`, `bg-primary-subtle`
- 시맨틱: `text-success`, `bg-warning`, `border-error`, `text-info`
- 등급(S→D): `text-grade-s` ~ `text-grade-d`, `bg-grade-*`
- TrustScore: `bg-score-high` ~ `bg-score-danger`, `text-score-*`
- 중립: `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`

**일괄 치환 — 도메인별 순서대로, 매 도메인마다 (1) 타이포 시맨틱화 + (2) 컬러 토큰 체크 함께 수행, 끝나면 `pnpm dev` 시각 확인**

각 도메인에서 점검할 컬러 위반:
- `text-[#xxx]`, `bg-[#xxx]`, `border-[#xxx]` 같은 arbitrary hex → 의미상 가까운 토큰으로 교체
- 인라인 `style={{ color: '#xxx' }}` → 토큰 클래스로 교체 (동적 계산값이 아니라면)
- SVG `fill="#xxx"` / `stroke="#xxx"` → `currentColor` + 부모에 토큰 (Day 2의 `restaurant-pin.tsx` 예시 참고)
- ※ 예외: `app/login/page.tsx` Google 로고 — 브랜드 fill로 유지

도메인 체크리스트:
- [ ] `src/components/common/Header.tsx` — 타이포 + 컬러
- [ ] `src/components/features/explore/**` — 카드 제목/본문/메타 + 컬러
- [ ] `src/components/features/ranking/**` — 카드 제목/순위/메타 + 컬러
- [ ] `src/components/features/restaurant-detail/**` — 타이포 + 컬러
- [ ] `src/components/features/review-write/**` — 타이포 + 컬러
- [ ] `src/components/features/my-profile/**` — 타이포 + 컬러
- [ ] `src/components/features/my-restaurant/**` — 타이포 + 컬러
- [ ] `src/components/features/user-profile/**` — 타이포 + 컬러
- [ ] `src/components/features/auth/**` — 타이포 + 컬러
- [ ] `src/app/**` 페이지 레벨 타이포 (헤딩, 섹션 제목) + 컬러
- [ ] `text-xs` 사용처 중 카드 본문/메타에 해당하는 곳 `text-body-2`로 승격

**점검**
- [ ] `pnpm lint && npx tsc --noEmit`
- [ ] `grep -rn "#[0-9a-fA-F]\{3,6\}\b" src/components src/app --include="*.tsx" | grep -v "Google\|브랜드"` → Day 2에 남길 hex(restaurant-pin SVG 3건)만 잔존
- [ ] `grep -rn "text-\[#\|bg-\[#\|border-\[#" src/` → 0건
- [ ] 브라우저 — 홈 + `/profile` + 맛집 상세 시각 확인 (폰트 충분히 큰지, 컬러 톤 깨짐 없는지)

> 산출물: raw `text-* font-*` 조합 ≤ 5건, `text-xs` 승격 완료, arbitrary hex 클래스 0, hex 직접 사용은 SVG 인라인 케이스만 잔존(Day 2에서 `currentColor`로 처리)

---

## Day 2 (금) — `common/` → `core/` 이전 + 잔존 위반 정리 — ≈ 4~5h

> **원칙**: 프로토타입(W1 끝)이 안 끝났으므로 카드 베이스를 새로 추출하지 않는다. 진짜 공통 패턴은 신규 화면 4개가 추가된 뒤에야 보임. Day 2는 **이미 공용으로 쓰이는 것의 위치만** CLAUDE.md 컨벤션에 맞추고, **명백한 토큰 위반만** 청소한다.

**`common/` → `core/` 마이그레이션** (단순 위치 이동 + kebab-case + index.tsx barrel)
- [ ] `common/Header.tsx` → `core/header/index.tsx`
- [ ] `common/grade-badge.tsx` → `core/grade-badge/index.tsx`
- [ ] `common/intro-card.tsx` → `core/intro-card/index.tsx`
- [ ] `common/rank-card-skeleton.tsx` → `core/rank-card-skeleton/index.tsx`
- [ ] `common/trust-score-badge.tsx` → `core/trust-score-badge/index.tsx`
- [ ] `common/trust-score-sheet.tsx` → `core/trust-score-sheet/index.tsx`
- [ ] `@/components/common/*` import 전체 → `@/components/core/*/index`로 일괄 수정
- [ ] 빈 `common/` 삭제

**잔존 위반 정리**
- [ ] `features/explore/restaurant-pin.tsx` SVG hex 3건(`#22C55E`, `#FF7A00`, `#fff`) → `currentColor` + 부모 `text-grade-*` / `text-score-*` 적용
- [ ] `app/login/page.tsx` Google 로고 hex 4건 → **예외 유지** — `{/* 브랜드 고정 컬러 — 토큰 대체 금지 */}` 주석 추가
- [ ] `map/page.tsx`, `explore-sheet.tsx`, `sidebar.tsx`의 `shadow-[…]` 3건 → `shadow-card` 또는 `shadow-md` 토큰으로 치환 (안 맞으면 `globals.css @theme inline`에 `--shadow-sheet` 추가)

**※ 이번 주 안 하는 것** (의도적 보류):
- features/* 11개 카드를 베이스 컴포넌트로 추출 — W1 신규 화면 추가된 뒤 W2~W3에 자연 추출
- 새 `core/cards/*` / `core/badges/*` 폴더 생성 — 추출할 만한 진짜 공통이 아직 안 보임

**점검**
- [ ] `grep -rn "components/common" src/` → 0건
- [ ] `pnpm lint && npx tsc --noEmit`

> 산출물: `core/` 정착(위치 이동만). hex 위반 제로(Google 예외 제외).

---

## Day 3 (토) — 레퍼런스 화면 + 자동화 — ≈ 4~5h

**레퍼런스 화면 — 홈 `/`** (가장 자주 보이는 화면 → 톤 정렬 효과 즉시 체감)
- [ ] `src/app/page.tsx` + 그 하위 트리(헤더, 인트로 카드, 1~3위 카드, 4위~ 리스트)를 W0 표준으로 완전 정렬:
  - 시맨틱 타이포 100%
  - 카드 패딩·그림자·라운딩 토큰 통일 (`rounded-card`, `shadow-card`, `p-4` 등) — 베이스 컴포넌트 추출은 안 함, 클래스 조합으로 톤만 통일
  - 컬러 토큰 100%
- [ ] 브라우저 Before/After 시각 비교 — 만족하지 않으면 타이포 매핑 보정

**`pnpm design:check` 스크립트 추가**
- [ ] `package.json` scripts에 추가:
  ```json
  "design:check": "! grep -rnE 'text-\\[1[01]px\\]' src/ && ! (grep -rnE '#[0-9a-fA-F]{3,6}' src/components src/app --include='*.tsx' | grep -vE 'Google 로고|브랜드 고정' | grep .) && echo 'design:check passed'"
  ```
- [ ] 실행 확인 — 위반 0

> 산출물: 홈 `/` 가 W1 신규 화면의 디자인 레퍼런스. 자동 검출 그린.

---

## Day 4 (일) — 버퍼

- [ ] Day 1~3 잔여 보정 (시각 이상 발견 시)
- [ ] `pnpm lint && npx tsc --noEmit && pnpm build` 최종 그린
- [ ] W1 5/12 시작 준비 확인

---

## W0 끝 게이트

```bash
grep -rn "components/common" src/              # → 0
grep -rn "text-\[1[01]px\]" src/               # → 0
grep -rn "#[0-9a-fA-F]\{3,6\}" src/components src/app --include="*.tsx" \
  | grep -v "Google\|브랜드"                   # → 0
pnpm lint && npx tsc --noEmit && pnpm build    # → 그린
```

---

## 재사용 우선 점검

| 필요한 것           | 사용할 것                                                  |
| ------------------- | ---------------------------------------------------------- |
| 시맨틱 타이포       | `globals.css` L277~369 이미 완비                          |
| 컬러 토큰           | `globals.css @theme inline` — brand/semantic/grade/score  |
| 라운딩 토큰         | `--radius-card`, `--radius-modal`, `--radius-chip` 등     |
| 그림자 토큰         | `--shadow-xs`~`--shadow-xl`, `--shadow-card`              |
| 뱃지                | `src/components/ui/badge.tsx` variant 활용                 |
| 카드 톤 통일        | 클래스 조합(`rounded-card shadow-card p-4` 등) — 베이스 추출은 W2~W3 |
