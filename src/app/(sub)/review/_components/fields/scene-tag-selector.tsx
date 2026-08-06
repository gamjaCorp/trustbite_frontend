'use client';

import { useReviewActions, useReviewSceneTags } from '../../_lib/review-write-store';
import { SceneTagChipRow } from '@/components/common/display/scene-tag-chip-row';
import { OCCASIONS } from '@/lib/domain/category';
import type { SceneTag } from '@/types/restaurant';

// 리뷰 작성 상황 태그 선택 — 복수 선택 가능
export function SceneTagSelector() {
  const selected = useReviewSceneTags();
  const { toggleScene } = useReviewActions();

  return (
    <div className="flex flex-wrap gap-2">
      <SceneTagChipRow
        tags={OCCASIONS}
        isActive={(t) => selected.includes(t as SceneTag)}
        onToggle={(t) => toggleScene(t as SceneTag)}
        variant="form"
        size="md"
        checkPosition="end"
      />
    </div>
  );
}
