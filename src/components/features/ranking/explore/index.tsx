'use client';

import { useEffect, useRef, useState } from 'react';
import { Circle, CustomOverlayMap, Map, useKakaoLoader } from 'react-kakao-maps-sdk';
import { MapPin } from 'lucide-react';
import type { RegionalRankEntry } from '@/lib/types/restaurant';
import { CategoryPin } from '@/components/common/category-pin';
import { type SearchArea, haversine, computeViewportRadius } from '@/lib/geo';
import { cn } from '@/lib/utils';

export type { SearchArea };

interface MapViewProps {
  entries: RegionalRankEntry[];
  activeId?: string | null;
  onPinClick?: (id: string) => void;
  onAreaChanged?: (area: SearchArea) => void; // 최초 타일 로드 시에만 검색 영역 전달 → 첫 자동 검색 트리거
  onViewportChange?: (area: SearchArea) => void; // 드래그·줌 등 viewport 변경 시마다 현재 영역 전달 → 재검색 버튼 표시 용도
  appliedArea?: SearchArea | null; // 현재 적용된 검색 영역 — 원이 이 영역에 고정됨. null이면 내부 초기값 사용
  onRegionChange?: (region: string | null) => void; // appliedArea 중심의 행정구역명 전달 (재검색 시에만 발화)
}

const DEFAULT_CENTER = { lat: 37.555, lng: 126.97 };
// --palette-brand (#ff7a00) 참조 — Kakao SDK fillColor는 string 전용이라 CSS 변수 직접 사용 불가
const CIRCLE_COLOR = '#ff7a00';
// onIdle에서 이 비율 미만 이동은 재검색 버튼을 띄우지 않음
const VIEWPORT_MOVE_RATIO = 0.3;
// 카카오 줌 1단계는 반경을 약 2배/절반으로 바꿈 — 0.35면 한 단계 줌도 확실히 감지
const RADIUS_CHANGE_RATIO = 0.35;
// 이 level 이하로 확대되면 모든 핀에 이름 라벨 표시 (작을수록 확대, 1=최대 확대)
const LABEL_VISIBLE_LEVEL = 3;
// 핀 클릭 시 줌인 기준 — 현재 level이 이보다 크면(덜 확대) 이 level로 줌인, 이미 확대된 경우 그 줌 유지
const CLOSEUP_LEVEL = 3;

// 카카오 지도 뷰 — appKey 유무 게이트 후 KakaoMap에 위임
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
  onViewportChange,
  appliedArea,
  onRegionChange,
  appKey,
}: MapViewProps & { appKey: string }) {
  const [loading, error] = useKakaoLoader({
    appkey: appKey,
    libraries: ['services', 'clusterer'],
  });

  // 현재 지도 zoom level 추적 — LABEL_VISIBLE_LEVEL 이하로 확대 시 모든 핀 라벨 표시
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

  // 첫 타일 로드 직후 부모 appliedArea가 전파되기 전까지만 사용하는 초기 원 상태
  const [initialArea, setInitialArea] = useState<SearchArea | null>(null);
  // onTileLoaded는 pan/zoom 시에도 재발화하므로 첫 발화에만 onAreaChanged를 호출
  const firedInitial = useRef(false);
  // Map 인스턴스 ref — appliedArea 변경 시 panTo에 사용
  const mapRef = useRef<kakao.maps.Map | null>(null);
  // 마지막으로 검색한 중심 — onIdle 오발화 가드에 사용 (동기 갱신, React 배치 무관)
  const searchedCenterRef = useRef<{ lat: number; lng: number } | null>(null);
  // 마지막으로 검색한 반경 — 줌 변화도 재검색 트리거에 포함하기 위해 추적
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
        // 동 우선(법정동 → 행정동) → 없으면 구로 fallback
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
    // 현재 줌이 클로즈업 기준보다 덜 확대된 경우에만 줌인 — 이미 확대 중이면 그 줌 유지
    if (map.getLevel() > CLOSEUP_LEVEL) map.setLevel(CLOSEUP_LEVEL);
    map.panTo(new kakao.maps.LatLng(entry.coordinates.lat, entry.coordinates.lng));
  }, [activeId, entries]);

  // 원은 항상 마지막 검색 영역(appliedArea)에 고정. 부모 전파 전 짧은 공백은 initialArea로 채움
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
            className="bg-transparent p-0 border-0 cursor-pointer"
          >
            <div className="relative flex items-center justify-center">
              <CategoryPin
                category={entry.category}
                active={activeId === entry.id}
                rank={entry.rank}
                showRank={entry.hasRealData ?? false}
              />
              {(() => {
                const isActive = activeId === entry.id;
                const showLabel = isActive || level <= LABEL_VISIBLE_LEVEL;
                if (!showLabel) return null;
                return (
                  <span className={cn(
                    'absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full border px-2 py-0.5 shadow-card',
                    isActive
                      ? 'border-primary bg-background/95 text-foreground text-label-3'
                      : 'border-border bg-background/95 text-foreground text-label-3',
                  )}>
                    {entry.name}
                  </span>
                );
              })()}
            </div>
          </button>
        </CustomOverlayMap>
      ))}
    </Map>
  );
}
