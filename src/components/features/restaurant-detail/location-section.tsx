import { Clock, Copy, MapPin } from 'lucide-react';
import { RestaurantDetail } from '@/types/restaurant';

interface Props {
  detail: RestaurantDetail;
}

const GRID_STYLE: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(to right, color-mix(in oklab, var(--ink) 12%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--ink) 12%, transparent) 1px, transparent 1px)',
  backgroundSize: '40px 40px',
};

export function LocationSection({ detail }: Props) {
  return (
    <section className="px-6 pt-10 pb-12">
      <h2 className="flex items-center gap-1.5 text-headline-2 text-foreground mb-3">
        <MapPin className="w-5 h-5 text-primary" />위치
      </h2>

      <div className="flex gap-4">
        {/* 좌측 — 지도 */}
        <div
          className="relative flex-1 aspect-[4/3] rounded-2xl bg-paper overflow-hidden ring-1 ring-paper-edge/50"
          style={GRID_STYLE}
          role="img"
          aria-label={`${detail.name} 위치 미리보기`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="relative flex items-center justify-center">
              <span className="absolute w-12 h-12 rounded-full bg-primary/20 pulse-ring" />
              <span className="absolute w-9 h-9 rounded-full bg-primary/30" />
              <span className="relative w-4 h-4 rounded-full bg-foreground ring-4 ring-background" />
            </span>
          </div>
          <div className="absolute right-2 bottom-2 flex flex-col rounded-md overflow-hidden ring-1 ring-paper-edge/60 bg-background/90 font-numeric text-title-2 text-ink/70">
            <span className="w-7 h-7 flex items-center justify-center border-b border-paper-edge/60">+</span>
            <span className="w-7 h-7 flex items-center justify-center">−</span>
          </div>
        </div>

        {/* 우측 — 주소·설명·CTA */}
        <div className="flex-1 min-w-0 flex flex-col">
          <h3 className="text-title-1 text-foreground">{detail.address}</h3>
          <p className="mt-1.5 inline-flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            {detail.accessSummary}
          </p>
          <p className="mt-2.5 rounded-xl bg-muted/50 px-3 py-2.5 text-sm text-ink/70 leading-relaxed line-clamp-3">
            {detail.locationDescription}
          </p>

          <div className="mt-auto pt-3 flex items-center gap-2 self-end">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-2 text-title-2 text-foreground hover:bg-muted active:scale-95 transition-all"
            >
              <Copy className="w-4 h-4" />
              복사
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
