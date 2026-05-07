'use client';

import { useMemo } from 'react';
import { Container, Marker, NaverMap, NavermapsProvider, useNavermaps } from 'react-naver-maps';
import { MapPin } from 'lucide-react';
import type { RegionalRankEntry } from '@/types/restaurant';
import { buildPinHtml } from './restaurant-pin';

interface MapViewProps {
  entries: RegionalRankEntry[];
  activeId?: string | null;
  onPinClick?: (id: string) => void;
  onMapMoved?: () => void;
}

const DEFAULT_CENTER = { lat: 37.5550, lng: 126.9700 };

function MapContent({ entries, activeId, onPinClick, onMapMoved }: MapViewProps) {
  const navermaps = useNavermaps();

  const center = useMemo(() => {
    if (entries.length === 0) return DEFAULT_CENTER;
    const avgLat = entries.reduce((s, e) => s + e.coordinates.lat, 0) / entries.length;
    const avgLng = entries.reduce((s, e) => s + e.coordinates.lng, 0) / entries.length;
    return { lat: avgLat, lng: avgLng };
  }, [entries]);

  return (
    <NaverMap
      defaultCenter={new navermaps.LatLng(center.lat, center.lng)}
      defaultZoom={12}
      logoControl={false}
      mapDataControl={false}
      scaleControl={false}
      onDragend={() => onMapMoved?.()}
      onZoomChanged={() => onMapMoved?.()}
    >
      {entries.map((entry) => (
        <Marker
          key={entry.id}
          position={new navermaps.LatLng(entry.coordinates.lat, entry.coordinates.lng)}
          icon={{
            content: buildPinHtml({ status: entry.myStatus, active: activeId === entry.id }),
            anchor: new navermaps.Point(16, 16),
          }}
          onClick={() => onPinClick?.(entry.id)}
        />
      ))}
    </NaverMap>
  );
}

export function MapView(props: MapViewProps) {
  const ncpKeyId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

  if (!ncpKeyId) {
    return (
      <div className="absolute inset-0 bg-muted/30 flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <MapPin className="w-8 h-8" />
        <p className="text-title-3">지도를 불러올 수 없어요</p>
        <p className="text-xs font-numeric">NEXT_PUBLIC_NAVER_MAP_CLIENT_ID 미설정</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <NavermapsProvider ncpKeyId={ncpKeyId}>
        <Container style={{ width: '100%', height: '100%' }}>
          <MapContent {...props} />
        </Container>
      </NavermapsProvider>
    </div>
  );
}
