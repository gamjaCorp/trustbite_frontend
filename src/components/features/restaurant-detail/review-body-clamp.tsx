'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  content: string;
  // false면 clamp 비활성 — compact=false인 my-review-section 경로
  enabled?: boolean;
}

const CLAMP_THRESHOLD = 120;

// 리뷰 본문 + 더보기 토글 — CLAMP_THRESHOLD 초과 시 line-clamp-3 적용
export function ReviewBodyClamp({ content, enabled = true }: Props) {
  const [expanded, setExpanded] = useState(false);
  const needsClamp = enabled && content.length > CLAMP_THRESHOLD;
  const isClamped = needsClamp && !expanded;

  return (
    <>
      <p
        className={cn(
          'whitespace-pre-line text-body-1 text-foreground leading-relaxed',
          isClamped && 'line-clamp-3',
        )}
      >
        {content}
      </p>
      {needsClamp && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-label-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? '접기' : '…더보기'}
        </button>
      )}
    </>
  );
}
