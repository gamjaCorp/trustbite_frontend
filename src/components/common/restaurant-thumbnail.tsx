'use client';

// 가게 썸네일 — src가 비거나 로드 실패하면 카테고리 아이콘 placeholder로 스왑
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CATEGORY_ICON } from '@/lib/domain/category';
import type { Category } from '@/lib/types/restaurant';

interface RestaurantThumbnailProps {
  src: string;
  alt: string;
  category: Category;
  showLabel?: boolean; // 하단 "이미지 없음" 텍스트 표시 여부 (기본 true, 작은 썸네일은 false)
  className?: string;
}

export function RestaurantThumbnail({ src, alt, category, showLabel = true, className }: RestaurantThumbnailProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    const Icon = CATEGORY_ICON[category];
    return (
      <div
        className={cn(
          'flex h-full w-full flex-col items-center justify-center gap-1 bg-muted text-muted-foreground',
          className,
        )}
      >
        <Icon className="size-6" strokeWidth={1.5} aria-hidden />
        {showLabel && <span className="text-[10px] leading-none">이미지 없음</span>}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={cn('h-full w-full object-cover', className)}
    />
  );
}
