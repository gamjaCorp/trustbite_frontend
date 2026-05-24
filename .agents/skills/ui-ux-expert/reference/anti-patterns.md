# Anti-patterns — 알려진 위반 목록

리뷰어 에이전트가 아래 항목을 검사한다. 이관/수정 대상.

| 위치 | 위반 내용 | 교정 방향 |
|---|---|---|
| `regional-rank-card.tsx:99` | `bg-white/85` 하드코딩 — 다크모드 깨짐 | `bg-card/80` 또는 `bg-background/80` 토큰화 |
| `regional-rank-card.tsx:110,128` vs `:114,136` | `text-ink/70` ↔ `text-muted-foreground` 혼용 | 역할별 하나로 통일 (`text-muted-foreground` 권장) |
| `signin/page.tsx:17` | `text-3xl font-bold` raw 타이포 | `text-headline-1` |
| `signin/page.tsx:13` | `max-w-[calc(100vh-97px)]` 헤더 높이 하드코딩 | `var(--header-height)` 사용 |
| `header.tsx:109,122` | `text-sm` raw 타이포 | `text-caption-1` 또는 `text-body-2` |
| `header.tsx:75-93` vs `detail-header.tsx:34-52` | avatar/auth 블록 중복 | `<UserBadge>` common 컴포넌트 추출 후보 |
| codebase-wide | `text-caption-2` (66건) / `text-label-3` (51건)이 본문·리스트 제목 자리 사용 | `text-body-1` / `text-title-1`로 교체 검토 |
| codebase-wide | 리스트 행 `py-3` 우세 (Toss/당근 대비 tight) | 1차 행은 `py-4`↑ + `min-h-[56px]` |
| codebase-wide | 1차 CTA `h-9` (16건) 우세 | 모바일 1차 CTA는 `h-12 w-full` |
| codebase-wide | 페이지 섹션 `space-y-3` (11건) 우세 | 일반 섹션 `space-y-5`↑, 작은 그룹만 `space-y-3` |
