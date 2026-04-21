import { mockRankList } from '@/data/mock-restaurant';
import { RegionRankList } from '@/components/features/ranking/region-rank-list';

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-6 pt-4 pb-24">
      <RegionRankList entries={mockRankList} />
    </div>
  );
}
