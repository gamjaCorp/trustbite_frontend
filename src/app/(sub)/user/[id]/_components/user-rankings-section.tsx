import {
  PlaceListRow,
  toPlaceListRowData,
} from '@/components/common/restaurant/place-list-row/index';
import { SectionHeader } from '@/components/common/display/section-header';
import { DividedList } from '@/components/common/display/divided-list';
import type { RegionalRankEntry } from '@/types/restaurant';

interface Props {
  title: string;
  ownerName: string;
  entries: RegionalRankEntry[];
  startRank?: number; // 미리보기(1곳)는 1로 고정, 전체 랭킹은 인덱스 기반
}

// 랭킹 항목 리스트 섹션 — 제목 + 구분선 목록(PlaceListRow)
export function UserRankingsSection({ title, ownerName, entries, startRank = 1 }: Props) {
  return (
    <section className="mt-8 space-y-3">
      <SectionHeader title={title} className="px-1" />
      <DividedList
        items={entries}
        keyFn={(e) => e.id}
        listClassName="border-y border-border"
        renderItem={(entry, i) => (
          <PlaceListRow
            variant="my"
            ownerName={ownerName}
            data={toPlaceListRowData({ ...entry, rank: startRank + i })}
          />
        )}
      />
    </section>
  );
}
