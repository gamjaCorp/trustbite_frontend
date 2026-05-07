import Link from 'next/link';
import { Clock } from 'lucide-react';
import { RepeatVisitReview } from '@/types/restaurant';

interface Props {
  review: RepeatVisitReview;
}

export function RepeatVisitReviewCard({ review }: Props) {
  return (
    <section className="mx-6 mt-4 rounded-2xl bg-blue-50 ring-1 ring-blue-200 p-4 dark:bg-blue-950/30 dark:ring-blue-800/50">
      <header className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-sm text-blue-900 dark:text-blue-200">
          <Clock className="w-4 h-4" />
          <span>
            <Link
              href={`/user/${review.reviewerId}`}
              className="font-semibold hover:underline"
            >
              {review.reviewerName}
            </Link>
            님은{' '}
            <span className="font-numeric font-semibold">{review.visitCount}번</span> 다녀왔어요
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-300 dark:bg-blue-700" />
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
        </div>
      </header>

      <div className="flex items-start gap-3 mb-3">
        <Link
          href={`/user/${review.reviewerId}`}
          className="shrink-0 w-9 h-9 rounded-full bg-primary-subtle text-primary font-bold flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          {review.reviewerInitial}
        </Link>
        <div className="flex items-center flex-wrap gap-1.5">
          <Link
            href={`/user/${review.reviewerId}`}
            className="text-title-2 text-foreground hover:text-primary transition-colors"
          >
            {review.reviewerName}
          </Link>
          <span className="rounded-chip bg-primary/10 text-primary px-1.5 py-0.5 text-label-3">
            Lv.{review.reviewerLevel} {review.reviewerTitle}
          </span>
          <span className="text-caption-2 text-muted-foreground">신뢰도 {review.reviewerTrustScore}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {review.visits.map((visit) => (
          <div
            key={visit.label}
            className="rounded-xl bg-background/60 dark:bg-background/30 p-3"
          >
            <p className="text-label-3 text-blue-900 dark:text-blue-200 mb-1.5">
              {visit.label}
            </p>
            <div className="flex items-center gap-2.5 text-body-2 text-ink/70 mb-1.5">
              <span>
                맛 <span className="font-numeric font-semibold text-foreground">{visit.scores.taste.toFixed(1)}</span>
              </span>
              <span>
                가성비 <span className="font-numeric font-semibold text-foreground">{visit.scores.value.toFixed(1)}</span>
              </span>
              <span>
                분위기 <span className="font-numeric font-semibold text-foreground">{visit.scores.vibe.toFixed(1)}</span>
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{visit.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
