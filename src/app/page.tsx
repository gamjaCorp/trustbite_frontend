import Link from 'next/link';
import { PencilLine } from 'lucide-react';
// import { mockRealtimeReviews } from '@/data/mock-restaurant';
// import { RealtimeReviews } from '@/components/features/ranking/realtime-reviews';
import { RegionRankList } from '@/components/features/ranking/index';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <>
      <div className="max-w-5xl mx-auto px-6 pt-4 pb-24 space-y-6">
        {/* 실시간 평가 — 홈의 "지도↔리스트 동기화" 모델과 분리되어 일단 비활성화. 부활 시 import 두 줄 + 아래 라인 해제. */}
        {/* <RealtimeReviews reviews={mockRealtimeReviews} /> */}
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
