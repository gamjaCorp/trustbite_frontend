import { Camera, FileText, TrendingUp } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Progress } from '@/components/ui/progress';
import { getTrustToneClass } from '@/lib/domain/trust-score';
import type { TrustBreakdown } from '@/types/restaurant';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantName: string;
  trustScore: number;
  breakdown: TrustBreakdown;
  reviewCount: number;
}

// 신뢰도 점수 상세 설명 바텀시트 — 점수 계산 방식·등급 기준 안내
export function TrustScoreSheet({
  open,
  onOpenChange,
  restaurantName,
  trustScore,
  breakdown,
  reviewCount,
}: Props) {
  const tone = getTrustToneClass(trustScore);

  const items: { icon: typeof Camera; label: string; ratio: number; desc: string }[] = [
    {
      icon: Camera,
      label: '사진이 있는 리뷰',
      ratio: breakdown.photoRatio,
      desc: `${Math.round(breakdown.photoRatio * reviewCount)}건 / ${reviewCount}건`,
    },
    {
      icon: FileText,
      label: '100자 이상 상세 리뷰',
      ratio: breakdown.longTextRatio,
      desc: `${Math.round(breakdown.longTextRatio * reviewCount)}건 / ${reviewCount}건`,
    },
    {
      icon: TrendingUp,
      label: '최근 6개월 활동',
      ratio: breakdown.recentActivityRatio,
      desc: `${Math.round(breakdown.recentActivityRatio * reviewCount)}건 / ${reviewCount}건`,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-modal">
        <SheetHeader>
          <SheetTitle className="text-left">{restaurantName}</SheetTitle>
          <SheetDescription className="text-left">
            이 가게의 신뢰도가 어떻게 계산됐는지 알려드릴게요.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-6 space-y-5">
          <div
            className={cn(
              'flex items-baseline justify-between rounded-2xl px-4 py-3 ring-1',
              tone.bg,
              tone.ring,
            )}
          >
            <span className="text-caption-1 text-muted-foreground">종합 신뢰도</span>
            <span className={cn('text-display-1 tabular-nums', tone.text)}>
              {Math.round(trustScore)}
              <span className="text-title-1">%</span>
            </span>
          </div>

          <div className="space-y-3">
            {items.map(({ icon: Icon, label, ratio, desc }) => (
              <div key={label} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-title-3 text-foreground flex-1">{label}</span>
                  <span className="text-caption-2 text-muted-foreground tabular-nums">{desc}</span>
                </div>
                <Progress value={ratio * 100} className="h-1.5" />
              </div>
            ))}
          </div>

          <p className="text-caption-2 text-muted-foreground leading-relaxed">
            사진과 자세한 글이 있는 리뷰, 최근 활동이 많을수록 신뢰도가 올라가요.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
