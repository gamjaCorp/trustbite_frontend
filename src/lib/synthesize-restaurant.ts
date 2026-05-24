// TODO: 1차 MVP 제외 — Kakao Local 임시 합성 어댑터. 백엔드 도착 시 삭제
import type { Category, RegionalRankEntry, SceneTag, VisitStatus } from '@/types/restaurant';
import type { KakaoPlace } from '@/api/kakao-local';

// mulberry32 결정론적 RNG
function hash(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function makeRng(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CATEGORY_KEYWORDS: [string, Category][] = [
  ['일식', '일식'],
  ['중식', '중식'],
  ['양식', '양식'],
  ['카페', '카페'],
  ['술집', '술집'],
  ['한식', '한식'],
];

function mapCategory(kakaoCategory: string): Category {
  for (const [keyword, value] of CATEGORY_KEYWORDS) {
    if (kakaoCategory.includes(keyword)) return value;
  }
  return '기타';
}

function parseRegion(address: string): string {
  const m = address.match(/[가-힣]+(구|시|군)/);
  if (m) return m[0];
  const parts = address.split(' ');
  return parts.slice(0, 2).join(' ');
}

const COMMENTS = [
  '단골 친구가 알려준 비밀의 공간',
  '주말 점심에는 꼭 줄 서서 먹는 곳',
  '혼자 가도 눈치 안 보이는 편안한 분위기',
  '가성비 갑, 이 가격에 이 퀄리티',
  '양이 많아서 혼자 가면 항상 포장해오는 집',
  '처음 먹었는데 바로 단골 됐어요',
  '오랜 단골인데 한 번도 실망한 적 없는 곳',
  '데이트 코스로 완벽한 분위기',
  '직장인 점심으로 제격, 빠르고 맛있음',
  '특별한 날 찾게 되는 나만의 맛집',
];

const SCENE_TAGS: SceneTag[] = ['데이트', '회식', '혼밥', '다이어트'];
const VISIT_STATUSES: VisitStatus[] = ['none', 'none', 'none', 'visited', 'reviewed'];

export function synthesizeEntry(place: KakaoPlace, index: number): RegionalRankEntry {
  const r = makeRng(hash(place.id));

  const taste = 3 + Math.floor(r() * 3);
  const value = 3 + Math.floor(r() * 3);
  const vibe = 3 + Math.floor(r() * 3);
  const avgScore = Math.round(((taste + value + vibe) / 3) * 10) / 10;

  const visitCount = 1 + Math.floor(r() * 5);
  const monthsAgo = Math.floor(r() * 12);
  const daysAgo = Math.floor(r() * 28);
  const lastVisitedAt = new Date();
  lastVisitedAt.setMonth(lastVisitedAt.getMonth() - monthsAgo);
  lastVisitedAt.setDate(lastVisitedAt.getDate() - daysAgo);

  const commentIndex = hash(place.id) % COMMENTS.length;
  const sceneIndex = Math.floor(r() * SCENE_TAGS.length);
  const statusIndex = Math.floor(r() * VISIT_STATUSES.length);

  const photoRatio = r();
  const longTextRatio = r();
  const recentActivityRatio = r();

  const trustScore = 50 + Math.floor(r() * 50);
  const communityAvgScore = 3 + r() * 2;
  const reviewCount = 5 + Math.floor(r() * 200);

  const address = place.road_address_name || place.address_name;

  return {
    id: place.id,
    name: place.place_name,
    category: mapCategory(place.category_name),
    region: parseRegion(address),
    imageUrl: `https://picsum.photos/seed/${place.id}/400/300`,
    coordinates: {
      lat: parseFloat(place.y),
      lng: parseFloat(place.x),
    },
    rank: index + 1,
    comment: COMMENTS[commentIndex],
    scores: { taste, value, vibe },
    avgScore,
    visitCount,
    lastVisitedAt,
    myLatestScene: SCENE_TAGS[sceneIndex],
    communityAvgScore: Math.round(communityAvgScore * 10) / 10,
    reviewCount,
    myStatus: VISIT_STATUSES[statusIndex],
    trustScore,
    trustBreakdown: { photoRatio, longTextRatio, recentActivityRatio },
  };
}
