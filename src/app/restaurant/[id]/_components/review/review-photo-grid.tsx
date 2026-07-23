import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Props {
  photos: string[];
  max?: number;
  // true면 max 초과 장수를 마지막 셀에 +N 오버레이로 표시 (my-review용)
  showOverflow?: boolean;
  altPrefix?: string;
  className?: string;
}

// 리뷰 사진 3열 그리드 — max 초과 시 showOverflow로 +N 표시
export function ReviewPhotoGrid({
  photos,
  max = 3,
  showOverflow = false,
  altPrefix = '리뷰 사진',
  className,
}: Props) {
  if (!photos.length) return null;
  const shown = photos.slice(0, max);
  const hiddenCount = showOverflow ? Math.max(0, photos.length - max) : 0;

  return (
    <div className={cn('mt-3 grid grid-cols-3 gap-2 max-w-md', className)}>
      {shown.map((src, i) => {
        const isOverlay = showOverflow && i === shown.length - 1 && hiddenCount > 0;
        return (
          <div key={src} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
            <Image
              src={src}
              alt={`${altPrefix} ${i + 1}`}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 150px, 30vw"
            />
            {isOverlay && (
              <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                <span className="text-background text-headline-2">+{hiddenCount}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
