'use client';

import { MapPin } from 'lucide-react';
import type { RegionalRankEntry } from '@/types/restaurant';
import { cn } from '@/lib/utils';
import { PlaceListRow, toPlaceListRowData } from '@/components/common/place-list-row';
import { SelectList, type SelectListItem } from '@/components/core/select-list';
import { RegionRankEmpty } from './region-rank-empty';
import { RegionRankSkeleton } from './region-rank-skeleton';

// TODO: 1차 MVP 제외 — 백엔드 도착 시 sort state 연결 후 disabled 제거
const SORT_ITEMS: SelectListItem[] = [
  { value: 'rank', label: '랭킹순' },
  { value: 'trust', label: '신뢰도순' },
  { value: 'recent', label: '최신순' },
];

interface RankResultListProps {
  entries: RegionalRankEntry[]; // 랭크 부여된 결과 목록
  activeId: string | null; // 행 하이라이트 대상
  isFetching: boolean; // Kakao API 로딩 중 여부
  region: string | null; // 검색 기준 행정구역명 (없으면 "이 지역")
}

// 검색 결과 리스트 — 헤더(지역명 + 정렬) + 카운트 + PlaceListRow 목록
export function RankResultList({ entries, activeId, isFetching, region }: RankResultListProps) {
  if (entries.length === 0) {
    return isFetching ? <RegionRankSkeleton /> : <RegionRankEmpty />;
  }

  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-headline-2 text-foreground truncate">
            {region ? `${region} 일대 맛집` : '이 지역 맛집'}
          </h2>
          <SelectList
            value="rank"
            onValueChange={() => {}}
            items={SORT_ITEMS}
            disabled
            className="shrink-0"
          />
        </div>
        <p className="inline-flex items-center gap-1 text-caption-2 text-muted-foreground min-w-0">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">이 영역에 {entries.length}곳</span>
        </p>
      </div>
      <ul className="border-y border-border">
        {entries.map((entry, i) => (
          <li key={entry.id} className={cn(i > 0 && 'border-t border-border')}>
            <PlaceListRow
              variant="regional"
              minimal={!entry.hasRealData}
              data={toPlaceListRowData(entry)}
              active={activeId === entry.id}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
