import { MapPin, Star, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MyRestaurantStats } from '@/types/restaurant';

interface Props {
  stats: MyRestaurantStats;
  onWriteReview?: () => void;
}

const RANK_COLORS = ['text-grade-s', 'text-grade-a', 'text-grade-b'];

function getTrustScoreColor(score: number) {
  if (score >= 80) return 'text-[var(--score-high)]';
  if (score >= 60) return 'text-[var(--score-good)]';
  if (score >= 40) return 'text-[var(--score-mid)]';
  if (score >= 20) return 'text-[var(--score-low)]';
  return 'text-[var(--score-danger)]';
}

export function MyRestaurantSummaryCard({ stats, onWriteReview }: Props) {
  const { visitCount, reviewCount, trustScore, topRestaurants, regionCounts, topCategory } = stats;

  return (
    <Card className="rounded-card shadow-card border-0 bg-card">
      <CardContent className="p-5 space-y-5">
        {/* 상단 스탯 */}
        <div className="flex gap-2">
          <StatChip label="방문" value={`${visitCount}곳`} />
          <StatChip label="리뷰" value={`${reviewCount}개`} />
          <StatChip
            label="신뢰도"
            value={`${trustScore}%`}
            valueClassName={cn(getTrustScoreColor(trustScore))}
          />
        </div>

        {/* 상태 분기 */}
        {reviewCount === 0 ? (
          <EmptyState onWriteReview={onWriteReview} />
        ) : reviewCount < 3 ? (
          <InProgressState reviewCount={reviewCount} />
        ) : (
          <FullState
            topRestaurants={topRestaurants}
            regionCounts={regionCounts}
            topCategory={topCategory}
          />
        )}
      </CardContent>
    </Card>
  );
}

/* ── 하위 컴포넌트 ── */

function StatChip({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex-1 bg-primary/10 rounded-chip px-3 py-2 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn('text-sm font-semibold text-primary', valueClassName)}>{value}</p>
    </div>
  );
}

function EmptyState({ onWriteReview }: { onWriteReview?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-4 text-center">
      <UtensilsCrossed className="w-10 h-10 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground leading-relaxed">
        첫 리뷰를 남기고
        <br />내 맛집 지도를 시작해보세요 🎉
      </p>
      <Button size="sm" onClick={onWriteReview} className="rounded-chip">
        리뷰 작성하기
      </Button>
    </div>
  );
}

function InProgressState({ reviewCount }: { reviewCount: number }) {
  return (
    <div className="rounded-(--radius) bg-muted px-4 py-3 text-sm text-muted-foreground text-center leading-relaxed">
      리뷰 {reviewCount}개 작성 완료!
      <br />
      <span className="text-foreground font-medium">
        리뷰를 더 남기면 인생 맛집 TOP 3가 만들어져요
      </span>{' '}
      ✨
    </div>
  );
}

function FullState({
  topRestaurants,
  regionCounts,
  topCategory,
}: Pick<MyRestaurantStats, 'topRestaurants' | 'regionCounts' | 'topCategory'>) {
  return (
    <div className="space-y-4">
      {/* 인생 맛집 TOP 3 */}
      <Section title="인생 맛집 TOP 3">
        <ol className="space-y-2">
          {topRestaurants.map((r) => (
            <li key={r.rank} className="flex items-center gap-2">
              <span className={cn('w-5 text-sm font-bold shrink-0', RANK_COLORS[r.rank - 1])}>
                {r.rank}위
              </span>
              <span className="flex-1 text-sm font-medium truncate">{r.name}</span>
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground shrink-0">
                <Star className="w-3 h-3 fill-grade-s text-grade-s" />
                {r.myRating}
              </span>
            </li>
          ))}
        </ol>
      </Section>

      {/* 지역별 탐험 */}
      <Section title="지역별 탐험">
        <div className="flex flex-wrap gap-2">
          {regionCounts.map(({ region, count }) => (
            <span
              key={region}
              className="flex items-center gap-1 text-xs bg-muted rounded-chip px-2.5 py-1"
            >
              <MapPin className="w-3 h-3 text-primary" />
              {region} {count}곳
            </span>
          ))}
        </div>
      </Section>

      {/* 가장 많이 간 카테고리 */}
      {topCategory && (
        <Section title="가장 많이 간 카테고리">
          <span className="inline-flex items-center gap-1 text-sm font-medium bg-primary/10 text-primary rounded-chip px-3 py-1">
            {topCategory}
          </span>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</p>
      {children}
    </div>
  );
}
