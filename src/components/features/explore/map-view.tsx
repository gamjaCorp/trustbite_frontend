'use client';

import { useState } from 'react';
import { CustomOverlayMap, Map, useKakaoLoader } from 'react-kakao-maps-sdk';
import { MapPin } from 'lucide-react';
import type { RegionalRankEntry } from '@/types/restaurant';
import { buildPinHtml } from './restaurant-pin';

export interface MapBounds {
  sw: { lat: number; lng: number };
  ne: { lat: number; lng: number };
}

interface MapViewProps {
  entries: RegionalRankEntry[];
  activeId?: string | null;
  onPinClick?: (id: string) => void;
  onBoundsChange?: (bounds: MapBounds) => void;
}

const DEFAULT_CENTER = { lat: 37.555, lng: 126.97 };

export function MapView(props: MapViewProps) {
  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

  // appKey 없으면 SDK 로더를 아예 호출하지 않는다 (콘솔 retry 로그 방지).
  if (!appKey) {
    return (
      <div className="absolute inset-0 bg-muted/30 flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <MapPin className="w-8 h-8" />
        <p className="text-title-3">지도를 불러올 수 없어요</p>
        <p className="text-caption-2">NEXT_PUBLIC_KAKAO_MAP_APP_KEY 미설정</p>
      </div>
    );
  }

  return <KakaoMap {...props} appKey={appKey} />;
}

function KakaoMap({
  entries,
  activeId,
  onPinClick,
  onBoundsChange,
  appKey,
}: MapViewProps & { appKey: string }) {
  const [loading, error] = useKakaoLoader({
    appkey: appKey,
    libraries: ['services', 'clusterer'],
  });

  // 초기 1회만 계산. 이후엔 사용자 조작(드래그/줌)에 맡긴다.
  // entries가 필터로 줄어들 때마다 지도가 튕기는 걸 방지하기 위함.
  const [initialCenter] = useState(() => {
    if (entries.length === 0) return DEFAULT_CENTER;
    const avgLat = entries.reduce((s, e) => s + e.coordinates.lat, 0) / entries.length;
    const avgLng = entries.reduce((s, e) => s + e.coordinates.lng, 0) / entries.length;
    return { lat: avgLat, lng: avgLng };
  });

  if (error) {
    return (
      <div className="absolute inset-0 bg-muted/30 flex items-center justify-center text-title-3 text-muted-foreground">
        지도를 불러오는 중 문제가 생겼어요
      </div>
    );
  }

  if (loading) {
    return (
      <div className="absolute inset-0 bg-muted/20 flex items-center justify-center text-title-3 text-muted-foreground">
        지도를 불러오는 중…
      </div>
    );
  }

  return (
    <Map
      center={initialCenter}
      level={5}
      style={{ width: '100%', height: '100%' }}
      onTileLoaded={(target) => {
        if (!onBoundsChange) return;
        const b = target.getBounds();
        onBoundsChange({
          sw: { lat: b.getSouthWest().getLat(), lng: b.getSouthWest().getLng() },
          ne: { lat: b.getNorthEast().getLat(), lng: b.getNorthEast().getLng() },
        });
      }}
      onIdle={(target) => {
        if (!onBoundsChange) return;
        const b = target.getBounds();
        onBoundsChange({
          sw: { lat: b.getSouthWest().getLat(), lng: b.getSouthWest().getLng() },
          ne: { lat: b.getNorthEast().getLat(), lng: b.getNorthEast().getLng() },
        });
      }}
    >
      {entries.map((entry) => (
        <CustomOverlayMap
          key={entry.id}
          position={{ lat: entry.coordinates.lat, lng: entry.coordinates.lng }}
          yAnchor={0.5}
          xAnchor={0.5}
          zIndex={activeId === entry.id ? 10 : entry.rank <= 3 ? 5 : 1}
        >
          <div
            onClick={() => onPinClick?.(entry.id)}
            dangerouslySetInnerHTML={{
              __html: buildPinHtml({
                status: entry.myStatus,
                active: activeId === entry.id,
                rank: entry.rank,
              }),
            }}
          />
        </CustomOverlayMap>
      ))}
    </Map>
  );
}
