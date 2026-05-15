'use client';

// 가고 싶은 맛집 위시리스트 섹션 — 북마크한 가게 리스트 표시
import { Bookmark } from 'lucide-react';
import { useWishlistMock } from '@/stores/wishlist-mock-store';
import { getRestaurantDetail } from '@/data/mock-restaurant-detail';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { WishlistItemCard } from '@/components/features/my-restaurant/wishlist-item-card';

export function WishlistSection() {
  const items = useWishlistMock((s) => s.items);
  const remove = useWishlistMock((s) => s.remove);

  const resolved = items
    .map((item) => ({ item, detail: getRestaurantDetail(item.restaurantId) }))
    .filter((entry): entry is { item: typeof entry.item; detail: NonNullable<typeof entry.detail> } => !!entry.detail)
    .sort((a, b) => new Date(b.item.addedAt).getTime() - new Date(a.item.addedAt).getTime());

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
    <div className="mt-4 divide-y divide-border">
      {resolved.map(({ item, detail }) => (
        <WishlistItemCard
          key={item.restaurantId}
          detail={detail}
          addedAt={item.addedAt}
          onRemove={remove}
        />
      ))}
    </div>
  );
}
