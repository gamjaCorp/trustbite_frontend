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

export function StarRatingInput({ value, onChange, ariaLabel, size = 'md' }: Props) {
  const [hoverValue, setHoverValue] = useState(0);
  const display = hoverValue || value;
  const iconClass = size === 'lg' ? 'w-7 h-7' : 'w-6 h-6';

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onChange(Math.min(5, (value || 0) + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onChange(Math.max(1, (value || 1) - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      onChange(1);
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
        const filled = n <= display;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n}점`}
            tabIndex={value === n || (value === 0 && n === 1) ? 0 : -1}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHoverValue(n)}
            className={cn(
              'p-0.5 rounded transition-transform active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
            )}
          >
            <Star
              className={cn(
                iconClass,
                'transition-colors',
                filled
                  ? 'fill-palette-amber text-palette-amber'
                  : 'fill-transparent text-muted-foreground/40',
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
