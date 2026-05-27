import { MapPin } from 'lucide-react';

// TODO: 1차 MVP 제외 — 위치 인증(2차 MVP)
export function LocationVerifyBanner() {
  return (
    <div className="rounded-2xl bg-muted/40 ring-1 ring-border px-4 py-3 flex items-center gap-3 opacity-60 grayscale select-none">
      <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-background ring-1 ring-border text-muted-foreground">
        <MapPin className="w-4 h-4" />
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-title-2 text-muted-foreground">위치 인증</span>
          <span className="rounded-chip bg-muted px-1.5 py-0.5 text-label-3 text-muted-foreground">
            출시 예정
          </span>
        </div>
        <p className="text-caption-2 text-muted-foreground mt-0.5">
          가게에서 50m 이내일 때 신뢰도를 더 올릴 수 있어요
        </p>
      </div>
    </div>
  );
}
