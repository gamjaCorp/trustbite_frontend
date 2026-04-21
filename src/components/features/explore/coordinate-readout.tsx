import type { Coordinates } from '@/types/restaurant';

interface Props {
  coords: Coordinates;
  className?: string;
}

export function CoordinateReadout({ coords, className = '' }: Props) {
  const lat = coords.lat.toFixed(3);
  const lng = coords.lng.toFixed(3);
  return (
    <span className={`font-numeric text-[10px] tracking-wider text-ink/70 ${className}`}>
      {lat}°N · {lng}°E
    </span>
  );
}
