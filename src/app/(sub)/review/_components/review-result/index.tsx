'use client';

import { Check } from 'lucide-react';

import { Modal } from '@/components/core/modal';
import { formatDelta } from '@/lib/format';
import type { ReviewResultSnapshot } from '../../_lib/review-write-store';

import { TrustScoreChangeCard } from './trust-score-change-card';
import { ContributionChecklist } from './contribution-checklist';
import { GradeProgressCard } from './grade-progress-card';
// TODO: 1차 MVP 제외 — 포인트 시스템(3차 MVP, Week 11)

interface Props {
  open: boolean;
  snapshot: ReviewResultSnapshot;
  onWriteMore: () => void;
  onViewMyReview: () => void;
}

// 리뷰 작성 완료 다이얼로그 — 점수 변화·등급 진행 요약
export function ReviewResultDialog({ open, snapshot, onWriteMore, onViewMyReview }: Props) {
  return (
    <Modal
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onWriteMore();
      }}
      icon={<Check strokeWidth={2.5} />}
      iconTone="success"
      title="리뷰 잘 올라갔어요"
      description={`신뢰도가 ${formatDelta(snapshot.breakdown.total)}%P 올랐어요`}
      primaryAction={{ label: '내가 쓴 리뷰 확인하기', onClick: onViewMyReview }}
      secondaryAction={{ label: '리뷰 하나 더 쓰기' }}
    >
      <div className="space-y-4">
        <TrustScoreChangeCard
          baseTrustScore={snapshot.baseTrustScore}
          nextTrustScore={snapshot.nextTrustScore}
          breakdown={snapshot.breakdown}
        />

        <ContributionChecklist breakdown={snapshot.breakdown} photoCount={snapshot.photoCount} />

        <GradeProgressCard
          grade={snapshot.grade}
          currentGradeReviewCount={snapshot.currentGradeReviewCount}
          currentGradeReviewTarget={snapshot.currentGradeReviewTarget}
          nextGrade={snapshot.nextGrade}
          remainingReviewsForNextGrade={snapshot.remainingReviewsForNextGrade}
        />

        {/* TODO: 1차 MVP 제외 — 포인트 시스템(3차 MVP, Week 11) */}
      </div>
    </Modal>
  );
}
