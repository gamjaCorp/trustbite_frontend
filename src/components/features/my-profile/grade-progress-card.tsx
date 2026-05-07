import { Check } from 'lucide-react';

import { Progress } from '@/components/ui/progress';
import { GRADE_LABEL } from '@/lib/trust-score';
import { cn } from '@/lib/utils';
import type { MyProfile } from '@/types/user';

interface Props {
  profile: MyProfile;
}

const BADGE_LEVELS = [
  { level: 1, label: '새싹' },
  { level: 2, label: '단골' },
  { level: 3, label: '수집가' },
  { level: 4, label: '헌터' },
  { level: 5, label: '미식가' },
  { level: 6, label: '미슐랭' },
] as const;

export function GradeProgressCard({ profile }: Props) {
  const progressValue = Math.min(
    100,
    Math.round((profile.reviewCount / profile.reviewsToNextGrade) * 100),
  );

  return (
    <section className="rounded-2xl bg-card shadow-card p-5 space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">현재 등급</p>
          <p className="text-headline-3 text-foreground">
            {GRADE_LABEL[profile.currentGrade]}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-1">다음</p>
          <p className="text-headline-3 text-primary">
            {GRADE_LABEL[profile.nextGrade]}
          </p>
        </div>
      </div>

      <Progress value={progressValue} />

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-muted/50 px-4 py-3">
          <p className="text-xs text-muted-foreground mb-1">리뷰 수</p>
          <p className="font-numeric">
            <span className="text-title-1 text-foreground">
              {profile.reviewCount}
            </span>
            <span className="text-xs text-muted-foreground"> / {profile.reviewsToNextGrade}</span>
          </p>
        </div>
        <div className="rounded-xl bg-muted/50 px-4 py-3">
          <p className="text-xs text-muted-foreground mb-1">신뢰도</p>
          <p className="font-numeric flex items-baseline gap-1">
            <span className="text-title-1 text-foreground">
              {profile.trustScore}%
            </span>
            <span className="text-xs text-muted-foreground">/ {profile.trustScoreThreshold}%</span>
            {profile.trustScoreMet && (
              <Check className="w-3.5 h-3.5 text-success self-center" strokeWidth={3} />
            )}
          </p>
        </div>
      </div>

      <div>
        <p className="text-label-3 text-muted-foreground mb-3">뱃지 컬렉션</p>
        <ul className="grid grid-cols-6 gap-1">
          {BADGE_LEVELS.map(({ level, label }) => {
            const isActive = level === profile.badgeLevel;
            return (
              <li key={level} className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    'inline-flex items-center justify-center w-9 h-9 rounded-full text-label-3 transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  L{level}
                </span>
                <span
                  className={cn(
                    'text-xs',
                    isActive ? 'text-foreground font-semibold' : 'text-muted-foreground',
                  )}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
