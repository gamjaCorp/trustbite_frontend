import Link from 'next/link';
import { MapPinOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/core/empty-state';

// 404 본문 — 루트와 (sub) 두 not-found가 같은 문구를 쓰도록 한 곳에 모은다
export function NotFoundView() {
  return (
    <EmptyState
      icon={MapPinOff}
      title="페이지를 찾을 수 없어요"
      description="삭제됐거나 주소가 잘못된 것 같아요."
      cta={
        <Button asChild size="lg">
          <Link href="/">홈으로</Link>
        </Button>
      }
    />
  );
}
