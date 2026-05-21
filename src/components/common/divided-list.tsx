// 구분선 목록 — border-y 래퍼 안에 li 사이 border-t를 자동으로 적용
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyFn: (item: T) => string;
  // <ul> 에 추가할 클래스 (border-b/border-y, mt-* 등 위치 조정)
  listClassName?: string;
}

export function DividedList<T>({ items, renderItem, keyFn, listClassName }: Props<T>) {
  return (
    <ul className={cn(listClassName)}>
      {items.map((item, i) => (
        <li key={keyFn(item)} className={cn(i > 0 && 'border-t border-border')}>
          {renderItem(item, i)}
        </li>
      ))}
    </ul>
  );
}
