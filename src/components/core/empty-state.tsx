import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

interface Props {
  icon: LucideIcon;
  title: React.ReactNode;
  description?: React.ReactNode;
  cta?: React.ReactNode; // 하단 CTA 버튼 영역
  className?: string;
}

// 아이콘·제목·설명·CTA 4슬롯 빈 상태 — Empty 원시 컴포넌트의 반복 구조를 단일 선언으로 축약
export function EmptyState({ icon: Icon, title, description, cta, className }: Props) {
  return (
    <Empty className={cn('border-0 py-16', className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {cta && <EmptyContent>{cta}</EmptyContent>}
    </Empty>
  );
}
