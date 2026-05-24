'use client';

import { useState } from 'react';
import { Circle, CustomOverlayMap, Map, useKakaoLoader } from 'react-kakao-maps-sdk';
import { MapPin } from 'lucide-react';
import type { RegionalRankEntry } from '@/types/restaurant';
import { buildPinHtml } from './restaurant-pin';

export interface MapBounds {
  sw: { lat: number; lng: number };
  ne: { lat: number; lng: number };
}

export interface SearchArea {
  center: { lat: number; lng: number };
  radius: number;
}

interface MapViewProps {
  entries: RegionalRankEntry[];
  activeId?: string | null;
  onPinClick?: (id: string) => void;
  /** idle 시 현재 viewport에서 계산한 검색 영역(중심+반경)을 전달 */
  onAreaChanged?: (area: SearchArea) => void;
}

const DEFAULT_CENTER = { lat: 37.555, lng: 126.97 };
const CIRCLE_COLOR = '#ff7a00';
// Kakao Places radius 최대값
const MAX_RADIUS_M = 20000;

// Haversine 거리(m) 계산
function haversine(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371000;
  const φ1 = (a.lat * Math.PI) / 180;
  const φ2 = (b.lat * Math.PI) / 180;
  const Δφ = ((b.lat - a.lat) * Math.PI) / 180;
  const Δλ = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

// 현재 viewport의 inscribed 반경 — 짧은 축에 접하는 원
function computeViewportRadius(map: kakao.maps.Map): number {
  const c = map.getCenter();
  const ne = map.getBounds().getNorthEast();
  const lat = c.getLat();
  const lng = c.getLng();
  const northM = haversine({ lat, lng }, { lat: ne.getLat(), lng });
  const eastM = haversine({ lat, lng }, { lat, lng: ne.getLng() });
  return Math.min(Math.min(northM, eastM) * 0.9, MAX_RADIUS_M);
}

export function MapView(props: MapViewProps) {
  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

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

// 지도 SDK 로딩 + 렌더링 담당 내부 컴포넌트
function KakaoMap({
  entries,
  activeId,
  onPinClick,
  onAreaChanged,
  appKey,
}: MapViewProps & { appKey: string }) {
  const [loading, error] = useKakaoLoader({
    appkey: appKey,
    libraries: ['services', 'clusterer'],
  });

  const [initialCenter] = useState(() => {
    if (entries.length === 0) return DEFAULT_CENTER;
    const avgLat = entries.reduce((s, e) => s + e.coordinates.lat, 0) / entries.length;
    const avgLng = entries.reduce((s, e) => s + e.coordinates.lng, 0) / entries.length;
    return { lat: avgLat, lng: avgLng };
  });

  // 원형 오버레이 상태 — 드래그/줌 시 실시간으로 갱신
  const [circleCenter, setCircleCenter] = useState(initialCenter);
  const [circleRadius, setCircleRadius] = useState(0);

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
        const c = target.getCenter();
        const center = { lat: c.getLat(), lng: c.getLng() };
        const radius = computeViewportRadius(target);
        setCircleCenter(center);
        setCircleRadius(radius);
        onAreaChanged?.({ center, radius });
      }}
      onDrag={(target) => {
        const c = target.getCenter();
        setCircleCenter({ lat: c.getLat(), lng: c.getLng() });
        setCircleRadius(computeViewportRadius(target));
      }}
      onZoomChanged={(target) => {
        const c = target.getCenter();
        setCircleCenter({ lat: c.getLat(), lng: c.getLng() });
        setCircleRadius(computeViewportRadius(target));
      }}
      onIdle={(target) => {
        const c = target.getCenter();
        const center = { lat: c.getLat(), lng: c.getLng() };
        const radius = computeViewportRadius(target);
        setCircleCenter(center);
        setCircleRadius(radius);
        onAreaChanged?.({ center, radius });
      }}
    >
      {circleRadius > 0 && (
        <Circle
          center={circleCenter}
          radius={circleRadius}
          strokeWeight={0}
          fillColor={CIRCLE_COLOR}
          fillOpacity={0.07}
        />
      )}
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
