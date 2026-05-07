'use client';

import { useEffect, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'trustbite:intro_dismissed';

export function IntroCard() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dismissed = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!dismissed) setVisible(true);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    window.localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  return (
    <div className="relative rounded-card bg-primary-subtle ring-1 ring-primary/20 p-4 pr-10">
      <button
        onClick={dismiss}
        aria-label="닫기"
        className="absolute top-2.5 right-2.5 p-1 rounded-full text-primary/60 hover:text-primary hover:bg-primary/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-title-2 text-foreground leading-snug">
            별점 4.5인데 맛없었던 적 있죠?
          </p>
          <p className="text-caption-2 text-muted-foreground leading-relaxed">
            여기선 믿을 수 있는 리뷰만 점수에 반영돼요. 친구랑 함께 맛집을 모아보세요!
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={dismiss}
            className="mt-1 h-7 px-2 text-label-3 text-primary hover:bg-primary/10 hover:text-primary"
          >
            알겠어요
          </Button>
        </div>
      </div>
    </div>
  );
}
