import Link from 'next/link';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Surface } from '@/components/common/display/surface';
import { EmptyState } from '@/components/core/empty-state';

interface Props {
  restaurantId: string;
}

// 리뷰가 없는 상세 페이지에서 첫 리뷰 작성을 유도하는 empty 카드
export function EmptyReviewCard({ restaurantId }: Props) {
  return (
    <section className="px-6 py-6">
      <Surface variant="ring" padding="lg">
        <EmptyState
          icon={Plus}
          title="이 음식점의 첫 리뷰 주인공이 되어보세요"
          description={
            <>
              리뷰를 등록하면 음식점 메인 사진으로 노출되고,<br />
              신뢰도 점수에 가장 큰 영향을 줘요
            </>
          }
          cta={
            <Button asChild className="rounded-chip">
              <Link href={`/restaurant/${restaurantId}/review/new`}>첫 리뷰 쓰기</Link>
            </Button>
          }
          className="py-12"
        />
      </Surface>
    </section>
  );
}
