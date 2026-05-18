import { Lock, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { RegionalRankCard } from '@/components/features/ranking/regional-rank-card';
import type { RegionalRankEntry } from '@/types/restaurant';

interface Props {
  previewItem?: RegionalRankEntry;
  totalCount: number;
  targetName: string;
  onFollow: () => void;
}

export function LockedRankingsSection({ previewItem, totalCount, targetName, onFollow }: Props) {
  return (
    <section className="mt-8 space-y-3">
      <div className="flex items-baseline justify-between px-1">
        <h2 className="text-title-1 text-foreground">전체 랭킹 {totalCount}곳</h2>
        <span className="text-caption-2 text-muted-foreground">팔로우하면 열람할 수 있어요</span>
      </div>

      {previewItem && (
        <div className="opacity-60 pointer-events-none border-hairline border border-border/60 rounded-2xl overflow-hidden">
          <RegionalRankCard entry={previewItem} showVisitStats hideBookmark />
        </div>
      )}

      <div className="rounded-2xl bg-muted/40 border border-border px-6 py-7 flex flex-col items-center gap-3 text-center">
        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border">
          <Lock className="w-4 h-4 text-muted-foreground" />
        </span>
        <p className="text-title-2 text-foreground">
          팔로우하고 {targetName}님의 {totalCount}곳을 확인해보세요
        </p>
        <p className="text-caption-2 text-muted-foreground">
          팔로우는 무료, 리스트 열람은 10P가 들어요
        </p>
        <Button
          size="sm"
          onClick={onFollow}
          className="gap-1.5 rounded-xl bg-foreground text-background hover:bg-foreground/90"
        >
          <UserPlus className="w-3.5 h-3.5" />
          팔로우하기
        </Button>
      </div>
    </section>
  );
}
