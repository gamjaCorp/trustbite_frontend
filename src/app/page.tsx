import Link from 'next/link';
import { PencilLine } from 'lucide-react';
import { RegionRankList } from '@/components/features/ranking/index';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <>
      <div className="max-w-5xl mx-auto px-6 pt-4 pb-24 space-y-6">
        {/* TODO: 1차 MVP 제외 — 실시간 평가 섹션 */}
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
