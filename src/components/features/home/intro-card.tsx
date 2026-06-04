'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Check, Sparkles, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'trustbite:intro_dismissed';

// 홈 최초 진입 시 1회 노출되는 TrustBite 핵심 가치 소개 카드
export function IntroCard() {
  const [visible, setVisible] = useState(false);
  const [winking, setWinking] = useState(false);

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

  const handleCta = () => {
    setWinking(true);
    // 윙크 애니메이션(0.45s) 완료 후 카드 닫기
    setTimeout(dismiss, 500);
  };

  return (
    <div className="relative rounded-card bg-primary-subtle ring-1 ring-primary/20 p-5 overflow-hidden mt-3">
      {/* 데코 블롭 */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary/15 blur-sm pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-primary/10 blur-sm pointer-events-none" />

      {/* 닫기 버튼 */}
      <button
        onClick={dismiss}
        aria-label="닫기"
        className="absolute top-0 right-0 w-11 h-11 rounded-full flex items-center justify-center text-primary/60 hover:text-primary hover:bg-primary/10 transition-colors z-10"
      >
        <X className="w-4 h-4" />
      </button>

      {/* 내부 콘텐츠 최대 너비 제한 */}
      <div className="max-w-2xl mx-auto">

      {/* 헤더 */}
      <div className="text-center mb-4">
        <p className="text-headline-2 text-foreground">
          별점 4.5인데
          <br />
          맛없었던 적, 있죠?
        </p>
        <p className="text-title-1 text-muted-foreground mt-1">
          같은 4.5점도 누가 줬느냐에 따라 무게가 달라요
        </p>
      </div>

      {/* 비교 행 */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-4 py-2">
        {/* 좌: 기존 별점 — 눈물 흘리는 별 */}
        <div className="bg-background ring-1 ring-border rounded-xl p-3 text-center space-y-1 shadow-sm -rotate-3">
          <div className="relative mx-auto w-7 h-7">
            <Star className="w-full h-full text-muted-foreground/40 fill-muted-foreground/20" />
            {/* 눈물: 별 하단에서 1회 흘러 사라짐 */}
            <span className="absolute -bottom-0.5 left-[52%] w-[3px] h-[5px] rounded-full bg-info/60 animate-tear-fall" />
          </div>
          <p className="text-label-3 text-muted-foreground">기존 별점</p>
          <p className="text-headline-2 text-muted-foreground/60 leading-none">4.5</p>
          <p className="text-caption-2 text-muted-foreground/50">신뢰도 ?</p>
        </div>

        <ArrowRight className="w-4 h-4 text-primary shrink-0" />

        {/* 우: TRUSTBITE — 2.4s마다 wiggle, CTA 클릭 시 wink */}
        <div className="relative bg-background ring-2 ring-primary rounded-xl p-3 text-center space-y-1 shadow-md rotate-3">
          <Sparkles className="absolute top-2 right-2 w-3 h-3 text-primary/60" />
          <Star
            className={cn(
              'w-7 h-7 mx-auto text-primary fill-primary',
              winking ? 'animate-star-wink' : 'animate-wiggle',
            )}
          />
          <p className="text-label-3 text-primary font-semibold tracking-widest">TRUSTBITE</p>
          <p className="text-headline-2 text-primary leading-none">4.5</p>
          <p className="text-caption-2 text-success flex items-center justify-center gap-0.5">
            신뢰도 88%
            <Check className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* 하단 캡션 + CTA */}
      <p className="text-caption-1 text-muted-foreground text-center mb-3">
        검증된 리뷰어의 평가일수록 점수에 더 크게 반영돼요
      </p>
      <div className="flex justify-center">
        <Button size="sm" onClick={handleCta} className="rounded-full px-6 font-bold">
          둘러볼래요
        </Button>
      </div>

      </div>{/* /내부 콘텐츠 최대 너비 제한 */}
    </div>
  );
}
