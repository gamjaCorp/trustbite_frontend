'use client';

import { useState } from 'react';
import { type SceneTag } from '@/lib/types/restaurant';
import { SelectList, type SelectListItem } from '@/components/core/select-list';
import { SectionHeader } from '@/components/common/section-header';
import { SceneTagChipRow } from '@/components/common/scene-tag-chip-row';

const SORT_OPTIONS: SelectListItem[] = [
  { value: 'trust', label: '신뢰도순' },
  { value: 'recent', label: '최신순' },
  { value: 'score', label: '별점순' },
];

const SORT_CAPTIONS: Record<string, string> = {
  trust: '신뢰도 가중 평균으로 정렬돼요',
  recent: '최신순으로 정렬돼요',
  score: '별점이 높은 순으로 정렬돼요',
};

const SCENE_TAGS: SceneTag[] = ['데이트', '회식', '혼밥'];

interface Props {
  title: string;
}

// 다른 사람 리뷰의 정렬 + 상황 필터바
export function ReviewFilterBar({ title }: Props) {
  const [sort, setSort] = useState('trust');
  const [scenes, setScenes] = useState<Set<SceneTag>>(new Set());

  const toggleScene = (tag: SceneTag) => {
    setScenes((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  return (
    <div className="px-6 pt-10 space-y-3">
      <SectionHeader
        title={title}
        subtitle={SORT_CAPTIONS[sort]}
        rightAction={<SelectList value={sort} onValueChange={setSort} items={SORT_OPTIONS} />}
      />

      <div className="border-t border-dashed border-border" />

      <div className="flex items-center gap-2">
        <span className="text-label-3 text-muted-foreground shrink-0">상황</span>
        <SceneTagChipRow
          tags={SCENE_TAGS}
          isActive={(t) => scenes.has(t as SceneTag)}
          onToggle={(t) => toggleScene(t as SceneTag)}
          formatLabel={(t) => `#${t}`}
          checkPosition="none"
        />
      </div>
    </div>
  );
}
