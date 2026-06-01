'use client';

import { Clock, Copy, ExternalLink, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { RestaurantDetail } from '@/lib/types/restaurant/type';
import { RestaurantLocationMap } from './restaurant-location-map';

interface Props {
  detail: RestaurantDetail;
}

const GRID_STYLE: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(to right, color-mix(in oklab, var(--ink) 12%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--ink) 12%, transparent) 1px, transparent 1px)',
  backgroundSize: '40px 40px',
};

export function LocationSection({ detail }: Props) {
  const displayAddress = detail.roadAddress || detail.address;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayAddress || detail.name);
    toast.success('주소가 복사되었어요');
  };

  return (
    <section className="px-6 pt-10 pb-12">
      <h2 className="flex items-center gap-1.5 text-headline-2 text-foreground mb-6">
        <MapPin className="w-5 h-5 text-primary" />위치
      </h2>

      <div className="flex flex-col sm:flex-row gap-7">
        {/* 좌측 — 지도 */}
        <div
          className="relative flex-1 aspect-[4/3] rounded-2xl bg-paper overflow-hidden ring-1 ring-border"
          style={GRID_STYLE}
          role="img"
          aria-label={`${detail.name} 위치 미리보기`}
        >
          {/* placeholder — 지도 로딩 실패·앱키 미설정·좌표 누락 시 표시 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="relative flex items-center justify-center">
              <span className="absolute w-12 h-12 rounded-full bg-primary/20 pulse-ring" />
              <span className="absolute w-9 h-9 rounded-full bg-primary/30" />
              <span className="relative w-4 h-4 rounded-full bg-foreground ring-4 ring-background" />
            </span>
          </div>
          {detail.coordinates && (
            <div className="absolute inset-0">
              <RestaurantLocationMap
                coordinates={detail.coordinates}
                category={detail.category}
                name={detail.name}
              />
            </div>
          )}
        </div>

        {/* 우측 — 주소·설명·CTA */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div>
            <h3 className="text-title-1 text-foreground">
              {displayAddress || '주소 정보 없음'}
            </h3>
            {detail.buildingName && (
              <p className="mt-0.5 text-caption-2 text-muted-foreground">{detail.buildingName}</p>
            )}
            {(detail.administrativeArea || detail.accessSummary || detail.nearestStation) && (
              <p className="mt-1.5 inline-flex items-center gap-1 text-caption-1 text-muted-foreground">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                {[
                  detail.administrativeArea,
                  detail.accessSummary,
                  detail.nearestStation
                    ? `${detail.nearestStation.name} 도보 ${detail.nearestStation.walkMinutes}분`
                    : undefined,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            )}
          </div>
          {detail.locationDescription && (
            <p className="mt-2.5 rounded-xl bg-muted/50 px-3 py-2.5 text-caption-1 text-ink/70 leading-relaxed line-clamp-3">
              {detail.locationDescription}
            </p>
          )}

          <div className="mt-auto pt-3 flex items-center gap-2 self-end">
            {detail.placeUrl && (
              <a
                href={detail.placeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-2 text-title-2 text-foreground hover:bg-muted transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                카카오맵
              </a>
            )}
            {displayAddress && (
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-2 text-title-2 text-foreground hover:bg-muted transition-colors"
              >
                <Copy className="w-4 h-4" />
                복사
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
