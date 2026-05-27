// TODO: 1차 MVP 제외 — 백엔드 상세 API 도착 시 삭제
import type { QueryClient } from '@tanstack/react-query';
import type { RegionalRankEntry } from '@/types/restaurant';

// React Query 캐시에서 ID로 맛집 entry 조회
export function findPlaceInCache(
  qc: QueryClient,
  id: string,
): RegionalRankEntry | null {
  const queries = qc.getQueriesData<RegionalRankEntry[]>({ queryKey: ['nearby-places'] });
  for (const [, data] of queries) {
    if (!data) continue;
    const hit = data.find((e) => e.id === id);
    if (hit) return hit;
  }
  return null;
}
