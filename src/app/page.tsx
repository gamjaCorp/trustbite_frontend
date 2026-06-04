import Link from 'next/link';
import { PencilLine } from 'lucide-react';
import { RegionRankList } from '@/components/features/home/index';
import { Button } from '@/components/ui/button';

// 홈 — 지역 기반 맛집 랭킹 목록 + 지도 탐색 진입점
export default function Home() {
  return (
    <>
      <div className="max-w-5xl mx-auto px-6 pt-4 pb-24 space-y-6">
        <RegionRankList />
      </div>

      <Button
        asChild
        className="fixed bottom-8 right-8 rounded-chip gap-2 shadow-lg px-5 py-3 h-auto"
      >
        <Link href="/review/new">
          <PencilLine className="w-4 h-4" />
          리뷰 쓰기
        </Link>
      </Button>
    </>
  );
}
