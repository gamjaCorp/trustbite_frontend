// 미터 단위 거리를 사람이 읽기 쉬운 문자열로 변환 (예: 850m, 1.2km)
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}
