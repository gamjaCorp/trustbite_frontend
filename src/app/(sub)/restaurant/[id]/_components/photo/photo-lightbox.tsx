'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Modal } from '@/components/core/modal';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

interface Props {
  photos: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialIndex?: number;
}

// 가게 사진 전체 보기 라이트박스
export function PhotoLightbox({ photos, open, onOpenChange, initialIndex = 0 }: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="사진 모두 보기"
      description={`${photos.length}장의 사진`}
      hideHeader
      size="xl"
      mobileSheet={false}
    >
      <div className="relative">
        <Carousel opts={{ startIndex: initialIndex }} setApi={setApi} className="w-full">
          <CarouselContent className="ml-0">
            {photos.map((src, i) => (
              <CarouselItem key={src} className="pl-0">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={src}
                    alt={`사진 ${i + 1}`}
                    fill
                    className="object-contain"
                    sizes="(min-width: 768px) 768px, 100vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-chip bg-foreground/60 px-3 py-1 text-label-3 text-background tabular-nums pointer-events-none">
          {current + 1} / {photos.length}
        </div>
      </div>
    </Modal>
  );
}
