// 나의 맛집 페이지 탭 — 나의 랭킹 / 가고 싶은 서브탭 (server component)
import { RestaurantRankList } from './restaurant-rank-list';
import { TasteProfileSection } from '@/components/common/profile/taste-profile-section';
import { WishlistSection } from './wishlist-section';
import { RegionalRankEntry } from '@/types/restaurant';

import { MyPlacesTabsNav } from './my-places-tabs-nav';

interface Props {
  initialTab: 'ranking' | 'wishlist';
  entries: RegionalRankEntry[]; // 첫 페이지 — 이후 페이지는 랭킹 목록이 서버 액션으로 누적
  hasMore?: boolean; // 다음 페이지 존재 여부
}

// 내 맛집 탭 — 나의 랭킹·가고 싶은 곳 탭 전환 뷰
export function MyPlacesTabs({ initialTab, entries, hasMore }: Props) {
  return (
    <MyPlacesTabsNav
      initialTab={initialTab}
      rankingPanel={
        <>
          <div className="mt-5">
            {/* reviewCount를 넘기지 않는다 — 성향 집계 모수는 로드된 entries 수 그대로여야 한다
                (전체 리뷰 수를 넘기면 20건으로 낸 평균에 "리뷰 N개 기준"이라 표시됨) */}
            <TasteProfileSection entries={entries} />
          </div>
          <div className="mt-12">
            <RestaurantRankList initialEntries={entries} initialHasMore={hasMore ?? false} />
          </div>
        </>
      }
      wishlistPanel={<WishlistSection />}
    />
  );
}
