// 팔로워·팔로잉 카운트를 버튼 형태로 나란히 표시하는 공통 행
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

interface Props {
  followerCount: number;
  followingCount: number;
  size?: 'sm' | 'md';
  onClickFollowers?: () => void;
  onClickFollowing?: () => void;
}

// 팔로워·팔로잉 수 표시 행 — 클릭 시 각 목록으로 이동
export function FollowStatsRow({
  followerCount,
  followingCount,
  size = 'md',
  onClickFollowers,
  onClickFollowing,
}: Props) {
  const textClass = size === 'md' ? 'text-label-2' : 'text-caption-1';
  const numClass = size === 'md' ? 'font-bold' : 'font-semibold';
  const gapClass = size === 'md' ? 'gap-4' : 'gap-3';

  return (
    <div className={cn('flex items-center', gapClass, textClass, 'text-muted-foreground')}>
      <button
        type="button"
        onClick={onClickFollowers}
        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <span className={cn(numClass, 'text-foreground')}>{followerCount}</span>
        <span>팔로워</span>
        <ChevronRight className="w-3 h-3" />
      </button>
      <button
        type="button"
        onClick={onClickFollowing}
        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <span className={cn(numClass, 'text-foreground')}>{followingCount}</span>
        <span>팔로잉</span>
        <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
}
