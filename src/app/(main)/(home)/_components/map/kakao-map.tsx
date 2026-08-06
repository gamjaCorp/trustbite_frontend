'use client';

// 카카오 지도 SDK 로딩 + 렌더링 담당 내부 컴포넌트 (MapView에서 appKey 게이트 통과 후 사용)
import { useEffect, useRef, useState } from 'react';
import { Circle, CustomOverlayMap, Map, useKakaoLoader } from 'react-kakao-maps-sdk';
import type { RegionalRankEntry } from '@/types/restaurant';
import { CategoryPin } from '@/components/common/category/category-pin';
import { type SearchArea, haversine, computeViewportRadius } from '@/lib/geo';
import { SDK_PRIMARY_COLOR } from '@/lib/kakao-sdk-colors';
import { cn } from '@/lib/utils';

const DEFAULT_CENTER = { lat: 37.555, lng: 126.97 };
const CIRCLE_COLOR = SDK_PRIMARY_COLOR;
const VIEWPORT_MOVE_RATIO = 0.3;
const RADIUS_CHANGE_RATIO = 0.35;
const LABEL_VISIBLE_LEVEL = 3;
const CLOSEUP_LEVEL = 3;

interface KakaoMapProps {
  entries: RegionalRankEntry[];
  activeId?: string | null;
  onPinClick?: (id: string) => void;
  onAreaChanged?: (area: SearchArea) => void;
  onViewportChange?: (area: SearchArea) => void;
  appliedArea?: SearchArea | null;
  onRegionChange?: (region: string | null) => void;
  appKey: string;
}

// 카카오 지도 SDK 로딩 및 핀·원·이벤트 처리 — MapView의 appKey 게이트 통과 후 렌더
export function KakaoMap({
  entries,
  activeId,
  onPinClick,
  onAreaChanged,
  onViewportChange,
  appliedArea,
  onRegionChange,
  appKey,
}: KakaoMapProps) {
  const [loading, error] = useKakaoLoader({
    appkey: appKey,
    libraries: ['services', 'clusterer'],
  });

  const [level, setLevel] = useState(5);

  const [resolvedCenter, setResolvedCenter] = useState<{ lat: number; lng: number } | null>(() => {
    if (entries.length > 0) {
      const avgLat = entries.reduce((s, e) => s + e.coordinates.lat, 0) / entries.length;
      const avgLng = entries.reduce((s, e) => s + e.coordinates.lng, 0) / entries.length;
      return { lat: avgLat, lng: avgLng };
    }
    return null;
  });

  useEffect(() => {
    if (resolvedCenter) return;

    let cancelled = false;
    const promise = new Promise<{ lat: number; lng: number }>((resolve) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        resolve(DEFAULT_CENTER);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(DEFAULT_CENTER),
        { timeout: 5000, maximumAge: 5 * 60 * 1000 },
      );
    });
    promise.then((center) => {
      if (!cancelled) setResolvedCenter(center);
    });

    return () => {
      cancelled = true;
    };
  }, [resolvedCenter]);

  const [initialArea, setInitialArea] = useState<SearchArea | null>(null);
  const firedInitial = useRef(false);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const searchedCenterRef = useRef<{ lat: number; lng: number } | null>(null);
  const searchedRadiusRef = useRef<number | null>(null);

  // onRegionChange를 ref로 안정화 — 부모가 매 렌더마다 새 함수를 넘겨도 effect 재실행 방지
  const onRegionChangeRef = useRef(onRegionChange);
  useEffect(() => {
    onRegionChangeRef.current = onRegionChange;
  });

  // appliedArea 중심의 행정구역을 역지오코딩해 부모에 전달
  useEffect(() => {
    if (loading || !appliedArea) return;
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2RegionCode(
      appliedArea.center.lng,
      appliedArea.center.lat,
      (result, status) => {
        if (status !== kakao.maps.services.Status.OK) {
          onRegionChangeRef.current?.(null);
          return;
        }
        const legal = result.find((r) => r.region_type === 'B');
        const admin = result.find((r) => r.region_type === 'H');
        const dong = legal?.region_3depth_name || admin?.region_3depth_name;
        const gu =
          admin?.region_2depth_name ?? legal?.region_2depth_name ?? result[0]?.region_2depth_name;
        onRegionChangeRef.current?.(dong || gu || null);
      },
    );
  }, [appliedArea, loading]);

  // appliedArea 변경 시 지도 중심 이동 + 검색 기준점 갱신
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !appliedArea) return;
    searchedCenterRef.current = appliedArea.center;
    searchedRadiusRef.current = appliedArea.radius;
    const cur = map.getCenter();
    const dx = Math.abs(cur.getLat() - appliedArea.center.lat);
    const dy = Math.abs(cur.getLng() - appliedArea.center.lng);
    if (dx < 1e-6 && dy < 1e-6) return;
    map.panTo(new kakao.maps.LatLng(appliedArea.center.lat, appliedArea.center.lng));
  }, [appliedArea]);

  // activeId 변경 시 해당 핀으로 이동·확대
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !activeId) return;
    const entry = entries.find((e) => e.id === activeId);
    if (!entry) return;
    if (map.getLevel() > CLOSEUP_LEVEL) map.setLevel(CLOSEUP_LEVEL);
    map.panTo(new kakao.maps.LatLng(entry.coordinates.lat, entry.coordinates.lng));
  }, [activeId, entries]);

  const circleArea = appliedArea ?? initialArea;

  if (error) {
    return (
      <div className="absolute inset-0 bg-muted/30 flex items-center justify-center text-title-3 text-muted-foreground">
        지도를 불러오는 중 문제가 생겼어요
      </div>
    );
  }

  if (loading || !resolvedCenter) {
    return (
      <div className="absolute inset-0 bg-muted/20 flex items-center justify-center text-title-3 text-muted-foreground">
        지도를 불러오는 중…
      </div>
    );
  }

  return (
    <Map
      center={resolvedCenter}
      level={5}
      style={{ width: '100%', height: '100%' }}
      onCreate={(map) => { mapRef.current = map; }}
      onTileLoaded={(target) => {
        if (!firedInitial.current) {
          firedInitial.current = true;
          const c = target.getCenter();
          const area = {
            center: { lat: c.getLat(), lng: c.getLng() },
            radius: computeViewportRadius(target),
          };
          setInitialArea(area);
          searchedCenterRef.current = area.center;
          searchedRadiusRef.current = area.radius;
          onAreaChanged?.(area);
        }
      }}
      onIdle={(target) => {
        const c = target.getCenter();
        const center = { lat: c.getLat(), lng: c.getLng() };
        const radius = computeViewportRadius(target);
        const searched = searchedCenterRef.current;
        const searchedRadius = searchedRadiusRef.current;
        const movedFar = !searched || haversine(center, searched) >= radius * VIEWPORT_MOVE_RATIO;
        const zoomedFar =
          !searchedRadius || Math.abs(radius - searchedRadius) >= searchedRadius * RADIUS_CHANGE_RATIO;
        if (!movedFar && !zoomedFar) return;
        onViewportChange?.({ center, radius });
      }}
      onZoomChanged={(target) => setLevel(target.getLevel())}
    >
      {circleArea && (
        <Circle
          center={circleArea.center}
          radius={circleArea.radius}
          strokeWeight={0}
          fillColor={CIRCLE_COLOR}
          fillOpacity={0.13}
        />
      )}
      {entries.map((entry) => (
        <CustomOverlayMap
          key={entry.id}
          position={{ lat: entry.coordinates.lat, lng: entry.coordinates.lng }}
          yAnchor={0.5}
          xAnchor={0.5}
          zIndex={activeId === entry.id ? 10 : 1}
        >
          <button
            type="button"
            aria-label={`${entry.name} 지도 핀`}
            onClick={() => onPinClick?.(entry.id)}
            className="bg-transparent p-0 border-0"
          >
            <div className="relative flex items-center justify-center">
              <CategoryPin
                category={entry.category}
                active={activeId === entry.id}
                rank={entry.rank}
                showRank={entry.hasRealData ?? false}
              />
              {(activeId === entry.id || level <= LABEL_VISIBLE_LEVEL) && (
                <span className={cn(
                  'absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full border px-2 py-0.5 shadow-card bg-background/95 text-foreground text-label-3',
                  activeId === entry.id ? 'border-primary' : 'border-border',
                )}>
                  {entry.name}
                </span>
              )}
            </div>
          </button>
        </CustomOverlayMap>
      ))}
    </Map>
  );
}
