'use client';

// 가고 싶은 맛집 위시리스트 섹션 — 안내 배너·헤더·정렬 + 카드 리스트
import { useMemo, useState } from 'react';
import { Bookmark, Share2, X } from 'lucide-react';
import { useWishlistMock } from '@/stores/wishlist-mock-store';
import { getRestaurantDetail } from '@/data/mock-restaurant-detail';
import { ChipSelect } from '@/components/core/chip-select';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { WishlistItemCard } from '@/components/features/my-restaurant/wishlist-item-card';
import type { RestaurantDetail } from '@/types/restaurant';

type WishlistSortKey = 'recent' | 'score' | 'trust';

const SORT_ITEMS = [
  { value: 'recent', label: '최근 저장순' },
  { value: 'score', label: '별점순' },
  { value: 'trust', label: '신뢰도순' },
];

export function WishlistSection() {
  const items = useWishlistMock((s) => s.items);
  const remove = useWishlistMock((s) => s.remove);
  const [sort, setSort] = useState<WishlistSortKey>('recent');
  const [showBanner, setShowBanner] = useState(true);

  const resolved = useMemo(
    () =>
      items
        .map((item) => ({ item, detail: getRestaurantDetail(item.restaurantId) }))
        .filter(
          (entry): entry is { item: typeof entry.item; detail: RestaurantDetail } =>
            !!entry.detail,
        ),
    [items],
  );

  const sortedList = useMemo(() => {
    return [...resolved].sort((a, b) => {
      if (sort === 'score') return b.detail.communityAvgScore - a.detail.communityAvgScore;
      if (sort === 'trust') return b.detail.trustScore - a.detail.trustScore;
      return new Date(b.item.addedAt).getTime() - new Date(a.item.addedAt).getTime();
    });
  }, [resolved, sort]);

  if (resolved.length === 0) {
    return (
      <Empty className="mt-8 border border-dashed border-border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Bookmark />
          </EmptyMedia>
          <EmptyTitle>가고 싶은 맛집을 저장해보세요</EmptyTitle>
          <EmptyDescription>상세 페이지의 북마크를 눌러 추가할 수 있어요</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div>
      {/* 안내 배너 */}
      {showBanner && (
        <div className="mt-4 flex items-start gap-4 rounded-2xl bg-primary-subtle/50 border border-primary/15 p-5">
          <Bookmark className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1.5">
            <p className="text-body-2 text-foreground">
              가고 싶은 곳{' '}
              <span className="text-primary">{resolved.length}</span>개를 모았어요
            </p>
            <p className="text-body-3 text-muted-foreground">
              다녀와서 리뷰를 쓰면 자동으로 &apos;나의 랭킹&apos;으로 옮겨져요
            </p>
          </div>
          <button
            type="button"
            aria-label="배너 닫기"
            onClick={() => setShowBanner(false)}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 헤더 행 */}
      <div className="mt-6 flex items-center justify-between gap-3 px-1">
        <h2 className="text-headline-2 text-foreground">위시리스트</h2>
        <div className="flex items-center gap-1.5 shrink-0">
          {/* TODO: 1차 MVP 제외 — 공유 기능 */}
          <div
            aria-disabled="true"
            className="w-9 h-9 rounded-full border border-border bg-muted text-muted-foreground flex items-center justify-center opacity-35 cursor-not-allowed"
          >
            <Share2 className="w-4 h-4" />
          </div>
          <ChipSelect
            value={sort}
            onValueChange={(v) => setSort(v as WishlistSortKey)}
            items={SORT_ITEMS}
          />
        </div>
      </div>

      {/* 카드 리스트 */}
      <ul className="mt-6 border-b border-border">
        {sortedList.map(({ item, detail }, i) => (
          <li
            key={item.restaurantId}
            className={i > 0 ? 'border-t border-border' : undefined}
          >
            <WishlistItemCard detail={detail} addedAt={item.addedAt} onRemove={remove} />
          </li>
        ))}
      </ul>
    </div>
  );
}
