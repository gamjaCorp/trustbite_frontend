'use client';

import { Plus } from 'lucide-react';
import { FloatingMapActionButton } from './floating-map-action-button';

interface Props {
  visible: boolean;
  count: number; // 더 불러올 개수
  onClick: () => void;
  className?: string;
}

// 지도 오버레이 더보기 버튼 — SearchThisArea와 상호 배타로 표시
export function LoadMoreButton({ visible, count, onClick, className }: Props) {
  return (
    <FloatingMapActionButton
      visible={visible}
      icon={Plus}
      label={`${count}개 더보기`}
      onClick={onClick}
      className={className}
    />
  );
}
