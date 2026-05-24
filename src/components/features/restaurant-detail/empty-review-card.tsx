import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Surface } from '@/components/common/surface';

interface Props {
  restaurantId: string;
}

// 리뷰가 없는 상세 페이지에서 첫 리뷰 작성을 유도하는 empty 카드
export function EmptyReviewCard({ restaurantId }: Props) {
  return (
    <section className="px-6 py-6">
      <Surface variant="ring" padding="lg">
        <Empty className="border-0 py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Plus />
            </EmptyMedia>
            <EmptyTitle>이 음식점의 첫 리뷰 주인공이 되어보세요</EmptyTitle>
            <EmptyDescription>
              리뷰를 등록하면 음식점 메인 사진으로 노출되고,<br />
              신뢰도 점수에 가장 큰 영향을 줘요
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild className="rounded-chip">
              <Link href={`/restaurant/${restaurantId}/review/new`}>
                첫 리뷰 쓰기
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      </Surface>
    </section>
  );
}
