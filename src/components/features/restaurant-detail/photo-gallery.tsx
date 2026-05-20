'use client';

import { useState } from 'react';
import Image from 'next/image';
import { LayoutGrid } from 'lucide-react';
import { PhotoLightbox } from './photo-lightbox';

interface Props {
  photos: string[];
  totalCount: number;
}

// 가게 상세 헤더 사진 그리드 + 전체 보기 라이트박스
export function PhotoGallery({ photos, totalCount }: Props) {
  const [open, setOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const [main, ...rest] = photos;
  const thumbs = rest.slice(0, 4);

  const openAt = (i: number) => {
    setInitialIndex(i);
    setOpen(true);
  };

  return (
    <div className="relative px-6 pt-3">
      <div className="grid grid-cols-3 grid-rows-2 gap-1.5 h-[220px] sm:h-[240px] rounded-2xl overflow-hidden">
        <div
          className="relative row-span-2 col-span-1 cursor-pointer"
          onClick={() => openAt(0)}
        >
          {main && (
            <Image
              src={main}
              alt="대표 사진"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 33vw, 40vw"
              priority
            />
          )}
        </div>

        {thumbs.map((src, i) => (
          <div
            key={src}
            className="relative cursor-pointer"
            onClick={() => openAt(i + 1)}
          >
            <Image
              src={src}
              alt={`사진 ${i + 2}`}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 22vw, 30vw"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => openAt(0)}
        className="absolute bottom-3 right-8 inline-flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur px-3 py-1.5 text-label-3 text-foreground ring-1 ring-border hover:bg-background transition-colors"
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        사진 {totalCount}장 모두 보기
      </button>

      <PhotoLightbox
        key={open ? initialIndex : -1}
        photos={photos}
        open={open}
        onOpenChange={setOpen}
        initialIndex={initialIndex}
      />
    </div>
  );
}
