// 나의 맛집 페이지 탭 — 나의 랭킹 / 가고 싶은 서브탭 (server component)
import { RestaurantRankList } from './restaurant-rank-list';
import { TasteProfileSection } from '@/components/common/profile/taste-profile-section';
import { WishlistSection } from './wishlist-section';
import { RegionalRankEntry } from '@/types/restaurant';

import { MyPlacesTabsNav } from './my-places-tabs-nav';

interface Props {
  initialTab: 'ranking' | 'wishlist';
  entries: RegionalRankEntry[];
  reviewCount?: number;
}

// 내 맛집 탭 — 나의 랭킹·가고 싶은 곳 탭 전환 뷰
export function MyPlacesTabs({ initialTab, entries, reviewCount }: Props) {
  return (
    <MyPlacesTabsNav
      initialTab={initialTab}
      rankingPanel={
        <>
          <div className="mt-5">
            <TasteProfileSection entries={entries} reviewCount={reviewCount} />
          </div>
          <div className="mt-12">
            <RestaurantRankList entries={entries} />
          </div>
        </>
      }
      wishlistPanel={<WishlistSection />}
    />
  );
}
