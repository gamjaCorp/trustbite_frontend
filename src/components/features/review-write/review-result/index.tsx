'use client';

import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDelta } from '@/lib/format';
import type { ReviewResultSnapshot } from '@/stores/review-write-store';

import { TrustScoreChangeCard } from './trust-score-change-card';
import { ContributionChecklist } from './contribution-checklist';
import { GradeProgressCard } from './grade-progress-card';
// TODO: 1차 MVP 제외 — 포인트 시스템(3차 MVP, Week 11)
// import { PointsEarnedCard } from './points-earned-card';

interface Props {
  open: boolean;
  snapshot: ReviewResultSnapshot;
  onWriteMore: () => void;
  onViewMyReview: () => void;
}

export function ReviewResultDialog({ open, snapshot, onWriteMore, onViewMyReview }: Props) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onWriteMore(); }}>
      <DialogContent className="max-w-sm p-0 gap-0 rounded-3xl overflow-hidden">
        <DialogTitle className="sr-only">리뷰 제출 결과</DialogTitle>
        <DialogDescription className="sr-only">
          신뢰도 변화와 획득 포인트를 확인하세요
        </DialogDescription>

        <div className="overflow-y-auto max-h-[90vh] px-5 pt-10 pb-6 space-y-4">
          <div className="flex flex-col items-center gap-2 pb-3">
            <div className="w-12 h-12 rounded-full bg-success/15 flex items-center justify-center">
              <Check className="w-6 h-6 text-success" strokeWidth={2.5} />
            </div>
            <h2 className="text-headline-2 text-foreground text-center">리뷰 잘 올라갔어요</h2>
            <p className="text-body-2 text-muted-foreground text-center">
              신뢰도가{' '}
              <span className="font-semibold text-success">
                {formatDelta(snapshot.breakdown.total)}%P
              </span>{' '}
              올랐어요
            </p>
          </div>

          <TrustScoreChangeCard
            baseTrustScore={snapshot.baseTrustScore}
            nextTrustScore={snapshot.nextTrustScore}
            breakdown={snapshot.breakdown}
          />

          <ContributionChecklist
            breakdown={snapshot.breakdown}
            photoCount={snapshot.photoCount}
          />

          <GradeProgressCard
            currentLevel={snapshot.currentLevel}
            currentGradeReviewCount={snapshot.currentGradeReviewCount}
            currentGradeReviewTarget={snapshot.currentGradeReviewTarget}
            nextGradeName={snapshot.nextGradeName}
            remainingReviewsForNextGrade={snapshot.remainingReviewsForNextGrade}
          />

          {/* TODO: 1차 MVP 제외 — 포인트 시스템(3차 MVP, Week 11) */}
          {/* <PointsEarnedCard
            pointsEarned={snapshot.pointsEarned}
            pointReasons={snapshot.pointReasons}
          /> */}

          <div className="flex gap-3 pt-3">
            <Button
              variant="outline"
              className="flex-1 h-12 text-title-2 rounded-xl"
              onClick={onWriteMore}
            >
              리뷰 하나 더 쓰기
            </Button>
            <Button
              className="flex-1 h-12 text-title-2 rounded-xl"
              onClick={onViewMyReview}
            >
              내가 쓴 리뷰 확인하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
