// TODO: 1차 MVP 제외 — 백엔드 상세 API 도착 시 삭제
import type { RegionalRankEntry, RestaurantDetail } from '@/types/restaurant';

// RegionalRankEntry(또는 null)를 RestaurantDetail placeholder로 변환
export function synthesizeDetailFromEntry(
  entry: RegionalRankEntry | null,
  id: string,
): RestaurantDetail {
  return {
    id,
    name: entry?.name ?? '정보 없음',
    category: entry?.category ?? '기타',
    subCategory: entry?.subCategory,
    region: entry?.region ?? '',
    address: entry?.roadAddress || entry?.region || '',
    accessSummary: '',
    hours: { weekday: '' },
    coordinates: entry?.coordinates ?? { lat: 37.555, lng: 126.97 },
    photos: entry?.imageUrl ? [entry.imageUrl] : [],
    totalPhotoCount: entry?.imageUrl ? 1 : 0,
    locationDescription: '',
    communityAvgScore: 0,
    dimensionScores: { taste: 0, value: 0, vibe: 0 },
    sceneScores: [],
    trustScore: 0,
    trustBreakdown: { photoRatio: 0, longTextRatio: 0, recentActivityRatio: 0 },
    reviewCount: 0,
    reviews: [],
    phone: entry?.phone,
    roadAddress: entry?.roadAddress,
    placeUrl: entry?.placeUrl,
    categoryGroupName: entry?.categoryGroupName,
    categoryPath: entry?.categoryPath,
  };
}
