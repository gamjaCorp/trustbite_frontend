// Kakao Places radius 최대값
export const MAX_RADIUS_M = 20000;

export interface SearchArea {
  center: { lat: number; lng: number };
  radius: number;
}

// Haversine 거리(m) 계산
export function haversine(
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
export function computeViewportRadius(map: kakao.maps.Map): number {
  const c = map.getCenter();
  const ne = map.getBounds().getNorthEast();
  const lat = c.getLat();
  const lng = c.getLng();
  const northM = haversine({ lat, lng }, { lat: ne.getLat(), lng });
  const eastM = haversine({ lat, lng }, { lat, lng: ne.getLng() });
  return Math.min(Math.min(northM, eastM) * 0.9, MAX_RADIUS_M);
}
