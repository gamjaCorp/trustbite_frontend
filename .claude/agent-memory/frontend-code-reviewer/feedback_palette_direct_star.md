---
name: feedback_palette_direct_star
description: fill-palette-amber/text-palette-amber로 별점 아이콘 색상 적용 반복 패턴 — fill-warning/text-warning 시맨틱 토큰으로 대체해야 함
metadata:
  type: feedback
---

별점 Star 아이콘에 `fill-palette-amber text-palette-amber` 직접 적용 패턴이 반복됨 (`realtime-reviews.tsx` 등).

**Why:** palette 토큰은 디자인 시스템 내부 구현 세부사항. warning = palette-amber 매핑이 globals.css에 정의되어 있으므로 `fill-warning text-warning`으로 대체해야 의미 명확.

**How to apply:** 별점 아이콘 fill/text 색상은 항상 `fill-warning text-warning`을 사용. 리뷰어가 `fill-palette-*` 패턴을 발견하면 P1으로 지적.
