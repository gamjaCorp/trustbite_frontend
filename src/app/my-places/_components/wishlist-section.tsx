'use client';

// 가고 싶은 맛집 위시리스트 섹션 — 안내 배너·헤더·정렬 + 카드 리스트
import { useMemo, useState } from 'react';
import { Bookmark, Share2, X } from 'lucide-react';
import { useWishlistMock } from '@/stores/wishlist-mock-store';
import { getRestaurantDetail } from '@/data/mock-restaurant-detail';
import { SelectList } from '@/components/core/select-list';
import { EmptyState } from '@/components/core/empty-state';
import { PlaceListRow, toPlaceListRowDataFromDetail } from '@/components/common/restaurant/place-list-row/index';
import { SectionHeader } from '@/components/common/display/section-header';
import { DividedList } from '@/components/common/display/divided-list';
import { IconButton } from '@/components/core/icon-button';
import type { RestaurantDetail } from '@/types/restaurant';

type WishlistSortKey = 'recent' | 'score' | 'trust';

const SORT_ITEMS = [
  { value: 'recent', label: '최근 저장순' },
  { value: 'score', label: '별점순' },
  { value: 'trust', label: '신뢰도순' },
];

// 가고 싶은 곳 섹션 — 위시리스트 목록 + 방문 후 랭킹 이동 안내 배너
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
      <EmptyState
        icon={Bookmark}
        title="가고 싶은 맛집을 저장해보세요"
        description="상세 페이지의 북마크를 눌러 추가할 수 있어요"
        className="mt-8 border border-dashed border-border py-6"
      />
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
            className="shrink-0 relative text-muted-foreground hover:text-foreground transition-colors after:absolute after:content-[''] after:-inset-3.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 헤더 행 */}
      <SectionHeader
        title="위시리스트"
        className="mt-6 px-1"
        rightAction={
          <>
            {/* TODO: 1차 MVP 제외 — 공유 기능 */}
            <IconButton icon={Share2} aria-label="공유" disabled />
            <SelectList
              value={sort}
              onValueChange={(v) => setSort(v as WishlistSortKey)}
              items={SORT_ITEMS}
            />
          </>
        }
      />

      {/* 카드 리스트 */}
      <DividedList
        items={sortedList}
        keyFn={({ item }) => item.restaurantId}
        listClassName="mt-6 border-b border-border"
        renderItem={({ item, detail }) => (
          <PlaceListRow
            variant="wishlist"
            data={toPlaceListRowDataFromDetail(detail, { addedAt: item.addedAt })}
            onRemoveFromWishlist={remove}
          />
        )}
      />
    </div>
  );
}
