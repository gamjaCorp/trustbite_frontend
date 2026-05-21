// 카드 셸 CVA — variant(card/elevated/bordered/subtle/ring)로 배경·테두리 패턴 표준화
import type { ComponentProps } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const surfaceVariants = cva('rounded-2xl', {
  variants: {
    variant: {
      // ring + shadow — place-card 패턴 (리뷰 작성, 기여 체크리스트 등)
      card: 'bg-card ring-1 ring-border shadow-card',
      // shadow only — 가로 스크롤 카드, 통계 스트립 등
      elevated: 'bg-card shadow-card',
      // ring only — 점수 패널처럼 shadow 없이 구분선만
      ring: 'bg-card ring-1 ring-border',
      // border only — 프로필 헤더, my-profile 목록 섹션
      bordered: 'bg-card border border-border',
      // primary-subtle 배경 — 내 리뷰 섹션 강조 배경
      subtle: 'bg-primary-subtle ring-1 ring-primary/20',
    },
    padding: {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-5',
    },
  },
  defaultVariants: { variant: 'card', padding: 'md' },
});

type Props = ComponentProps<'div'> & VariantProps<typeof surfaceVariants>;

export function Surface({ className, variant, padding, ...props }: Props) {
  return (
    <div
      className={cn(surfaceVariants({ variant, padding }), className)}
      {...props}
    />
  );
}
