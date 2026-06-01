'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReviewActions, useReviewSceneTags } from '@/stores/review-write-store';
import type { SceneTag } from '@/lib/types/restaurant';

const SCENE_TAGS: SceneTag[] = ['혼밥', '데이트', '회식', '다이어트'];

export function SceneTagSelector() {
  const selected = useReviewSceneTags();
  const { toggleScene } = useReviewActions();

  return (
    <div className="flex flex-wrap gap-2">
      {SCENE_TAGS.map((tag) => {
        const active = selected.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            aria-pressed={active}
            onClick={() => toggleScene(tag)}
            className={cn(
              'inline-flex items-center gap-1 rounded-chip px-3.5 py-1.5 text-label-2 transition-colors',
              active
                ? 'bg-primary/10 text-primary ring-1 ring-primary/40'
                : 'bg-muted text-foreground hover:bg-muted/70',
            )}
          >
            {tag}
            {active && <Check className="w-3.5 h-3.5" />}
          </button>
        );
      })}
    </div>
  );
}
