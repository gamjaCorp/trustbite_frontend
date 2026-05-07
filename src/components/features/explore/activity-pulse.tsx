import type { RealtimeReview } from '@/types/restaurant';

interface Props {
  reviews: RealtimeReview[];
}

export function ActivityPulse({ reviews }: Props) {
  if (reviews.length === 0) return null;
  const recent = reviews.filter((r) => r.minutesAgo <= 60);
  if (recent.length === 0) return null;

  const mostRecent = recent.reduce((a, b) => (a.minutesAgo < b.minutesAgo ? a : b));

  return (
    <div className="inline-flex items-center gap-2 rounded-chip bg-primary/10 pl-2 pr-3 py-1">
      <span className="relative flex h-2 w-2">
        <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-primary/60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
      </span>
      <span className="text-label-3 text-primary">
        <span className="font-numeric">{mostRecent.minutesAgo}분 전</span> · {recent.length}명이 새 리뷰를 남겼어요
      </span>
    </div>
  );
}
