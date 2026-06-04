'use client';

import { useState } from 'react';
import { RestaurantDetail } from '@/lib/types/restaurant';
import { TrustScoreBadge } from '@/components/common/trust/trust-score-badge';
import { TrustScoreSheet } from '@/components/common/trust/trust-score-sheet';
import { Surface } from '@/components/common/display/surface';
import { SCORE_LABELS } from '@/lib/domain/score-labels';

interface Props {
  detail: RestaurantDetail;
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const pct = Math.min(100, (score / 5) * 100);
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-10 text-label-3 text-muted-foreground shrink-0">{label}</span>
      <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-7 text-right text-label-3 text-foreground">
        {score.toFixed(1)}
      </span>
    </div>
  );
}

// 점수 패널 — 음식점 종합 평점·신뢰도 점수·고신뢰 리뷰어 비중 표시
export function ScorePanel({ detail }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);

  if (detail.reviewCount === 0) return null;

  return (
    <section className="px-6 pt-4">
      <Surface variant="ring" padding="lg">
        <div className="flex flex-col sm:flex-row gap-5">
          {/* 좌측 ── 평점/신뢰도 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-end gap-2">
              <div className="flex items-baseline gap-0.5">
                <span className="text-display-1 text-foreground">
                  {detail.communityAvgScore.toFixed(1)}
                </span>
                <span className="text-caption-1 text-muted-foreground">/ 5</span>
              </div>
              <TrustScoreBadge
                score={detail.trustScore}
                size="sm"
                onClick={() => setSheetOpen(true)}
              />
            </div>
            <p className="mt-0.5 text-caption-2 text-muted-foreground">
              리뷰 {detail.reviewCount}개 · 신뢰도 가중 평균
            </p>
            <p className="mt-1.5 text-label-3 text-foreground">검증된 평가</p>
            <p className="text-caption-2 text-muted-foreground">고신뢰도 리뷰어 비중이 높아요</p>
          </div>

          {/* 우측 ── 항목별 바 */}
          <div className="flex-1 flex flex-col justify-center gap-1.5">
            {SCORE_LABELS.map(({ key, label }) => (
              <ScoreBar key={key} label={label} score={detail.dimensionScores[key]} />
            ))}
          </div>
        </div>

        {/* Scene 태그 점수 */}
        <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
          {detail.sceneScores.map((s) => (
            <span
              key={s.tag}
              className="inline-flex items-center gap-1.5 rounded-chip bg-muted px-3 py-1.5 text-label-3"
            >
              <span className="text-muted-foreground">#{s.tag}</span>
              <span className="font-semibold text-foreground">
                {s.score.toFixed(1)}
              </span>
            </span>
          ))}
        </div>
      </Surface>

      <TrustScoreSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        restaurantName={detail.name}
        trustScore={detail.trustScore}
        breakdown={detail.trustBreakdown}
        reviewCount={detail.reviewCount}
      />
    </section>
  );
}
