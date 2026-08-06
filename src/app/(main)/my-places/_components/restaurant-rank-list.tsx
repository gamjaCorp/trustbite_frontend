'use client';

import { useMemo, useState, useTransition } from 'react';
import { UtensilsCrossed, Plus, Share2, MapPin } from 'lucide-react';
import type { RegionalRankEntry } from '@/types/restaurant';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/core/empty-state';
import {
  PlaceListRow,
  toPlaceListRowData,
} from '@/components/common/restaurant/place-list-row/index';
import { SectionHeader } from '@/components/common/display/section-header';
import { DividedList } from '@/components/common/display/divided-list';
import { SelectList } from '@/components/core/select-list';
import { IconButton } from '@/components/core/icon-button';
import MyRankFilterProvider, {
  useMyRankCategory,
  useMyRankFilterActions,
  useMyRankRegion,
  useMyRankSort,
} from '../_lib/my-rank-filter-store';
import { RankFilterBar } from './rank-filter-bar';
import { loadMoreMyRatings } from '../actions';

const SORT_ITEMS = [
  { value: 'score', label: '점수순' },
  { value: 'recent', label: '최근 방문순' },
];

interface Props {
  initialEntries: RegionalRankEntry[];
  initialHasMore: boolean;
}

// my-places 전체 랭킹 — Provider로 필터 스토어를 서브트리에 제공
export function RestaurantRankList({ initialEntries, initialHasMore }: Props) {
  return (
    <MyRankFilterProvider>
      <RestaurantRankListView initialEntries={initialEntries} initialHasMore={initialHasMore} />
    </MyRankFilterProvider>
  );
}

// 렌더링 전담 — 필터 상태는 store hook으로 직접 구독
function RestaurantRankListView({ initialEntries, initialHasMore }: Props) {
  const sort = useMyRankSort();
  const category = useMyRankCategory();
  const region = useMyRankRegion();
  const action = useMyRankFilterActions();

  // 서버가 준 첫 페이지에 "더보기"로 받은 다음 페이지들을 이어붙인다
  const [entries, setEntries] = useState(initialEntries);
  const [nextPage, setNextPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isPending, startTransition] = useTransition();

  const handleLoadMore = () => {
    startTransition(async () => {
      const result = await loadMoreMyRatings(nextPage);
      setEntries((prev) => [...prev, ...result.entries]);
      setNextPage((p) => p + 1);
      setHasMore(!result.last);
    });
  };

  const reviewedCount = useMemo(
    () => entries.filter((e) => e.myStatus === 'reviewed').length,
    [entries],
  );

  const regions = useMemo(
    () => Array.from(new Set(entries.map((e) => e.region))).sort(),
    [entries],
  );

  const filteredList = useMemo(() => {
    let list = entries;

    if (category !== 'all') list = list.filter((e) => e.category === category);
    if (region !== 'all') list = list.filter((e) => e.region === region);

    return [...list].sort((a, b) =>
      sort === 'score'
        ? b.avgScore - a.avgScore || a.rank - b.rank
        : b.lastVisitedAt.getTime() - a.lastVisitedAt.getTime(),
    );
  }, [entries, category, region, sort]);

  return (
    <div>
      {/* 섹션 헤더 */}
      <SectionHeader
        title="전체 랭킹"
        subtitle={`내가 쓴 리뷰 ${reviewedCount}개 · ${new Set(entries.map((e) => e.id)).size}곳 방문`}
        className="px-1"
        rightAction={
          <>
            {/* TODO: 1차 MVP 제외 — 공유 기능 */}
            <IconButton icon={Share2} aria-label="공유" disabled />
            <SelectList
              value={region}
              onValueChange={action.setRegion}
              icon={MapPin}
              placeholder="전체 지역"
              items={[
                { value: 'all', label: '전체 지역' },
                ...regions.map((r) => ({ value: r, label: r })),
              ]}
            />
            <SelectList
              value={sort}
              onValueChange={(v) => action.setSort(v as 'score' | 'recent')}
              items={SORT_ITEMS}
            />
          </>
        }
      />

      <RankFilterBar />

      {filteredList.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="아직 기록한 맛집이 없어요"
          description="첫 맛집을 추가하면 나만의 미식 가이드가 시작돼요."
          cta={
            <Button>
              <Plus />새 맛집 추가하기
            </Button>
          }
        />
      ) : (
        <>
          <DividedList
            items={filteredList}
            keyFn={(e) => (e.ratingId != null ? String(e.ratingId) : e.id)}
            listClassName="mt-6 border-b border-border"
            renderItem={(entry, i) => (
              <PlaceListRow variant="my" data={toPlaceListRowData({ ...entry, rank: i + 1 })} />
            )}
          />

          {hasMore && (
            <div className="mt-6 flex justify-center">
              <Button variant="outline" onClick={handleLoadMore} disabled={isPending}>
                {isPending ? '불러오는 중…' : '더보기'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
