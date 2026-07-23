'use client';

import { useState, KeyboardEvent } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  value: number;
  onChange: (n: number) => void;
  ariaLabel?: string;
  size?: 'md' | 'lg';
}

const STAR_VALUES = [1, 2, 3, 4, 5] as const;

// 별점 입력 — 좌측 절반은 N-0.5점, 우측 절반은 N점 (0.5 단위)
export function StarRatingInput({ value, onChange, ariaLabel, size = 'md' }: Props) {
  const [hoverValue, setHoverValue] = useState(0);
  const display = hoverValue || value;
  const iconClass = size === 'lg' ? 'w-7 h-7' : 'w-6 h-6';

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onChange(Math.min(5, (value || 0) + 0.5));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onChange(Math.max(0.5, (value || 0.5) - 0.5));
    } else if (e.key === 'Home') {
      e.preventDefault();
      onChange(0.5);
    } else if (e.key === 'End') {
      e.preventDefault();
      onChange(5);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      onMouseLeave={() => setHoverValue(0)}
      className="inline-flex items-center gap-1"
    >
      {STAR_VALUES.map((n) => {
        const full = display >= n;
        const half = !full && display >= n - 0.5;

        return (
          <div key={n} className="relative p-0.5">
            {/* 별 시각 렌더링 */}
            <div className="relative pointer-events-none" aria-hidden>
              {/* 빈 별 (배경) */}
              <Star
                className={cn(
                  iconClass,
                  'transition-colors',
                  full
                    ? 'fill-palette-amber text-palette-amber'
                    : 'fill-transparent text-muted-foreground/40',
                )}
              />
              {/* 채워진 별 — 절반일 때만 좌측 50% 클립 */}
              {half && (
                <span className="absolute inset-0 overflow-hidden w-1/2">
                  <Star className={cn(iconClass, 'fill-palette-amber text-palette-amber')} />
                </span>
              )}
            </div>

            {/* 좌측 절반 — N-0.5점 */}
            <button
              type="button"
              role="radio"
              aria-checked={value === n - 0.5}
              aria-label={`${n - 0.5}점`}
              tabIndex={value === n - 0.5 ? 0 : -1}
              onClick={() => onChange(n - 0.5)}
              onMouseEnter={() => setHoverValue(n - 0.5)}
              className="absolute inset-0 w-1/2 rounded-l focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />
            {/* 우측 절반 — N점 */}
            <button
              type="button"
              role="radio"
              aria-checked={value === n}
              aria-label={`${n}점`}
              tabIndex={value === n || (value === 0 && n === 1) ? 0 : -1}
              onClick={() => onChange(n)}
              onMouseEnter={() => setHoverValue(n)}
              className="absolute inset-0 left-1/2 w-1/2 rounded-r focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>
        );
      })}
    </div>
  );
}
