'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const FILTERS = [
  { id: 'all', label: '전체' },
  { id: 'trust', label: '신뢰도순' },
  { id: 'recent', label: '최신순' },
  { id: 'date', label: '#데이트' },
  { id: 'work', label: '#회식' },
  { id: 'solo', label: '#혼밥' },
] as const;

type FilterId = (typeof FILTERS)[number]['id'];

interface Props {
  title: string;
  caption?: string;
}

export function ReviewFilterBar({
  title,
  caption = '신뢰도 가중 평균으로 정렬돼요',
}: Props) {
  const [active, setActive] = useState<FilterId>('all');

  return (
    <div className="px-6 pt-6">
      <h2 className="text-headline-3 text-foreground">{title}</h2>
      <p className="mt-1 text-xs text-muted-foreground">{caption}</p>

      <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-1">
        {FILTERS.map((f) => {
          const isActive = active === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setActive(f.id)}
              className={cn(
                'shrink-0 rounded-chip px-3 py-1.5 text-label-3 transition-colors',
                isActive
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-ink/70 hover:bg-muted/80',
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
