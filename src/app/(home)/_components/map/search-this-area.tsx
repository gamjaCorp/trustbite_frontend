'use client';

import { Search } from 'lucide-react';
import { FloatingMapActionButton } from './floating-map-action-button';

interface Props {
  visible: boolean;
  onClick: () => void;
  className?: string;
}

// 지도 드래그·줌 후 재검색 유도 플로팅 버튼
export function SearchThisArea({ visible, onClick, className }: Props) {
  return (
    <FloatingMapActionButton
      visible={visible}
      icon={Search}
      label="이 지역에서 검색"
      onClick={onClick}
      className={className}
    />
  );
}
