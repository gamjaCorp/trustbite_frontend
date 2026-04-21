import { RestaurantDetail } from '@/types/restaurant';

interface Props {
  detail: RestaurantDetail;
}

const GRID_STYLE: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(to right, color-mix(in oklab, var(--ink) 12%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--ink) 12%, transparent) 1px, transparent 1px)',
  backgroundSize: '56px 56px',
};

export function LocationSection({ detail }: Props) {
  return (
    <section className="px-6 pt-8">
      <h2 className="text-lg font-bold text-foreground mb-3">위치</h2>

      <div
        className="relative w-full aspect-[5/3] rounded-2xl bg-paper overflow-hidden ring-1 ring-paper-edge/50"
        style={GRID_STYLE}
        role="img"
        aria-label={`${detail.name} 위치 미리보기`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="relative flex items-center justify-center">
            <span className="absolute w-16 h-16 rounded-full bg-primary/20 pulse-ring" />
            <span className="absolute w-12 h-12 rounded-full bg-primary/30" />
            <span className="relative w-5 h-5 rounded-full bg-foreground ring-4 ring-background" />
          </span>
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-sm font-semibold text-foreground">{detail.address}</h3>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          {detail.locationDescription}
        </p>
      </div>
    </section>
  );
}
