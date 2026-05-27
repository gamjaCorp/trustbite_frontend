'use client';

import { ChangeEvent, useEffect, useRef } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  TRUST_DELTA,
  useReviewActions,
  useReviewPhotos,
} from '@/stores/review-write-store';

interface Props {
  maxSlots?: number;
  hideHeader?: boolean;
}

export function PhotoUploadGrid({ maxSlots = 4, hideHeader = false }: Props) {
  const photos = useReviewPhotos();
  const { addPhotos, removePhoto } = useReviewActions();
  const inputRef = useRef<HTMLInputElement>(null);
  const createdUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      createdUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      createdUrlsRef.current = [];
    };
  }, []);

  const reached = photos.length > 0;
  const remainingSlots = Math.max(0, maxSlots - photos.length);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const room = maxSlots - photos.length;
    const accepted = Array.from(files).slice(0, room);
    const urls = accepted.map((f) => URL.createObjectURL(f));
    createdUrlsRef.current.push(...urls);
    addPhotos(urls);
    e.target.value = '';
  };

  const handleRemove = (idx: number) => {
    const target = photos[idx]?.previewUrl;
    if (target) {
      URL.revokeObjectURL(target);
      createdUrlsRef.current = createdUrlsRef.current.filter((u) => u !== target);
    }
    removePhoto(idx);
  };

  return (
    <div>
      {!hideHeader && (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-title-2 text-foreground">사진</span>
          <span
            className={cn(
              'inline-flex items-center gap-1 text-caption-2 transition-colors',
              reached ? 'text-primary font-semibold' : 'text-muted-foreground',
            )}
          >
            {reached && <Check className="w-3.5 h-3.5" />}
            사진 첨부 +<span className="">{TRUST_DELTA.photo}</span>%
          </span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleChange}
      />

      <div className="grid grid-cols-4 gap-2">
        {photos.map((photo, idx) => (
          <div
            key={photo.previewUrl}
            className="relative aspect-square rounded-xl overflow-hidden bg-muted ring-1 ring-border"
          >
            <img
              src={photo.previewUrl}
              alt={`업로드한 사진 ${idx + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              aria-label={`사진 ${idx + 1} 삭제`}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-foreground/70 text-background flex items-center justify-center hover:bg-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {remainingSlots > 0 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border border-dashed ring-1 ring-border bg-muted/30 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:ring-primary/40 hover:text-primary hover:bg-primary/5 transition-colors"
            aria-label="사진 추가"
          >
            <Plus className="w-5 h-5" />
            {photos.length === 0 && (
              <span className="text-caption-2">최대 {maxSlots}장</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
