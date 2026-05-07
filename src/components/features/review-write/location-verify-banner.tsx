import { ArrowDown, MapPin } from 'lucide-react';

export function LocationVerifyBanner() {
  return (
    <div className="rounded-2xl bg-muted/60 ring-1 ring-paper-edge/40 px-4 py-3 flex items-center gap-3">
      <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-background ring-1 ring-paper-edge/40 text-muted-foreground">
        <MapPin className="w-4 h-4" />
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-title-2 text-foreground">위치 인증</span>
          <span className="rounded-chip bg-background px-1.5 py-0.5 text-label-3 text-muted-foreground">
            2차 MVP
          </span>
        </div>
        <p className="text-caption-2 text-muted-foreground mt-0.5">
          가게에서 50m 이내일 때 인증 가능
        </p>
      </div>

      <span
        aria-hidden
        className="shrink-0 w-9 h-9 rounded-full bg-background ring-1 ring-paper-edge/40 flex items-center justify-center text-muted-foreground"
      >
        <ArrowDown className="w-4 h-4" />
      </span>
    </div>
  );
}
