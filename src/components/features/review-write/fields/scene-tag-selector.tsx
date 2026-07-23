'use client';

import { useReviewActions, useReviewSceneTags } from '../stores/review-write-store';
import { SceneTagChipRow } from '@/components/common/display/scene-tag-chip-row';
import type { SceneTag } from '@/types/restaurant';

const SCENE_TAGS: SceneTag[] = ['혼밥', '데이트', '회식', '다이어트'];

// 리뷰 작성 상황 태그 선택 — 복수 선택 가능
export function SceneTagSelector() {
  const selected = useReviewSceneTags();
  const { toggleScene } = useReviewActions();

  return (
    <div className="flex flex-wrap gap-2">
      <SceneTagChipRow
        tags={SCENE_TAGS}
        isActive={(t) => selected.includes(t as SceneTag)}
        onToggle={(t) => toggleScene(t as SceneTag)}
        variant="form"
        size="md"
        checkPosition="end"
      />
    </div>
  );
}
