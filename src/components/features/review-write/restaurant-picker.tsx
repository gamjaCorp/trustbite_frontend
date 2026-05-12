'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { CategoryBadge } from '@/components/core/category-badge';
import { useReviewActions } from '@/stores/review-write-store';
import type { RegionalRankEntry } from '@/types/restaurant';

interface Props {
  candidates: RegionalRankEntry[];
}

export function RestaurantPicker({ candidates }: Props) {
  const [query, setQuery] = useState('');
  const { setSelectedRestaurant } = useReviewActions();

  const filtered = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return candidates.slice(0, 6);
    return candidates.filter(
      (c) => c.name.includes(trimmed) || c.region.includes(trimmed),
    );
  }, [query, candidates]);

  return (
    <div className="rounded-2xl bg-card ring-1 ring-paper-edge/40 p-3 shadow-card">
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="음식점 이름 또는 지역을 검색해주세요"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          aria-label="음식점 검색"
        />
      </div>

      <p className="mt-3 mb-1 px-1 text-caption-2 text-muted-foreground">
        {query.trim() ? '검색 결과' : '최근 방문한 곳'}
      </p>

      {filtered.length === 0 ? (
        <p className="px-3 py-6 text-center text-sm text-muted-foreground">
          검색 결과가 없어요
        </p>
      ) : (
        <ul className="max-h-72 overflow-y-auto">
          {filtered.map((entry) => (
            <li key={entry.id}>
              <button
                type="button"
                onClick={() =>
                  setSelectedRestaurant({
                    id: entry.id,
                    name: entry.name,
                    category: entry.category,
                    region: entry.region,
                    imageUrl: entry.imageUrl,
                    subtitle: `${entry.category} · ${entry.region}`,
                    visitCount: entry.visitCount,
                  })
                }
                className="w-full flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-muted/60 transition-colors"
              >
                <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image src={entry.imageUrl} alt={entry.name} fill className="object-cover" />
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <p className="text-title-2 text-foreground truncate">
                    {entry.name}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <CategoryBadge category={entry.category} />
                    <span className="text-caption-2 text-muted-foreground truncate">
                      {entry.region}
                    </span>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
