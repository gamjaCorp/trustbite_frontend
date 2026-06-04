import { Check } from 'lucide-react';
import { ToggleChip } from './toggle-chip';

interface Props {
  tags: ReadonlyArray<string>;
  isActive: (tag: string) => boolean;
  onToggle: (tag: string) => void;
  variant?: 'filter' | 'form'; // filter=상황 필터, form=리뷰 작성
  size?: 'sm' | 'md';
  checkPosition?: 'start' | 'end' | 'none'; // active 시 Check 아이콘 위치
  formatLabel?: (tag: string) => string; // 라벨 변환 (예: '#' prefix)
}

// 상황 태그 배열을 토글 칩 목록으로 렌더 — 레이아웃 래퍼는 부모가 담당
export function SceneTagChipRow({
  tags,
  isActive,
  onToggle,
  variant = 'filter',
  size = 'sm',
  checkPosition = 'start',
  formatLabel,
}: Props) {
  return (
    <>
      {tags.map((tag) => {
        const active = isActive(tag);
        return (
          <ToggleChip key={tag} active={active} onClick={() => onToggle(tag)} variant={variant} size={size}>
            {checkPosition === 'start' && active && <Check aria-hidden className="w-3.5 h-3.5" />}
            {formatLabel ? formatLabel(tag) : tag}
            {checkPosition === 'end' && active && <Check aria-hidden className="w-3.5 h-3.5" />}
          </ToggleChip>
        );
      })}
    </>
  );
}
