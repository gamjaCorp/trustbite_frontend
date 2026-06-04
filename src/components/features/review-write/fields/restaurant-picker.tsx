'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Surface } from '@/components/common/display/surface';
import { RestaurantIdentityRow } from '@/components/common/restaurant/restaurant-identity-row';
import { RestaurantThumbnail } from '@/components/common/restaurant/restaurant-thumbnail';
import { useReviewActions } from '@/stores/review-write-store';
import type { RegionalRankEntry } from '@/lib/types/restaurant';

interface Props {
  candidates: RegionalRankEntry[];
}

// 리뷰 작성 음식점 검색 및 선택
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
    <Surface variant="card" padding="sm">
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="음식점 이름 또는 지역을 검색해주세요"
          className="flex-1 bg-transparent outline-none text-label-1 placeholder:text-muted-foreground"
          aria-label="음식점 검색"
        />
      </div>

      <p className="mt-3 mb-1 px-1 text-caption-2 text-muted-foreground">
        {query.trim() ? '검색 결과' : '최근 방문한 곳'}
      </p>

      {filtered.length === 0 ? (
        <p className="px-3 py-6 text-center text-body-2 text-muted-foreground">
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
                  <RestaurantThumbnail
                    src={entry.imageUrl}
                    alt={entry.name}
                    category={entry.category}
                    showLabel={false}
                    className="absolute inset-0"
                  />
                </div>

                <RestaurantIdentityRow
                  name={entry.name}
                  category={entry.category}
                  subtitle={entry.region}
                  className="flex-1 text-left"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Surface>
  );
}
