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
  ['분식', '분식'],   // "한식" 앞에 — "분식"이 없으면 한식 substring 오매칭 없지만 명시적 우선
  ['치킨', '치킨'],
  ['패스트푸드', '패스트푸드'],
  ['한식', '한식'],
];

export function mapCategory(kakaoCategory: string): Category {
  for (const [keyword, value] of CATEGORY_KEYWORDS) {
    if (kakaoCategory.includes(keyword)) return value;
  }
  return '기타';
}

// 광역 시·도 접두 제거 정규식
const SI_DO_PREFIX = new RegExp(
  '^(서울특별시|부산광역시|대구광역시|인천광역시|광주광역시|대전광역시|울산광역시|' +
  '세종특별자치시|경기도|강원특별자치도|강원도|충청북도|충청남도|전라북도|전라남도|' +
  '경상북도|경상남도|제주특별자치도|' +
  '서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주)\\s+',
);

function compactRegion(s: string): string {
  if (!s) return '';
  const stripped = s.replace(SI_DO_PREFIX, '');
  const tokens = stripped.split(/\s+/).filter(Boolean);
  // 끝에서 번지·도로명 번호(숫자 포함) 토큰 제거
  while (tokens.length && /\d/.test(tokens[tokens.length - 1])) tokens.pop();
  return tokens.join(' ');
}

function parseRegion(address: string, roadAddress: string): string {
  // 지번 주소 우선(동까지 포함) → 도로명 fallback → 원본
  return compactRegion(address) || compactRegion(roadAddress) || address || roadAddress;
}

function parseSubCategory(category: string): string {
  // "음식점 > 한식 > 국밥/돼지국밥" → "국밥/돼지국밥"
  const parts = category.split(' > ').map((s) => s.trim()).filter(Boolean);
  return parts.at(-1) ?? category;
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

  const subCategory = parseSubCategory(place.category_name);

  return {
    id: place.id,
    name: place.place_name,
    category: mapCategory(place.category_name),
    region: parseRegion(place.address_name, place.road_address_name),
    imageUrl: '',
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
    subCategory,
    phone: place.phone || undefined,
    roadAddress: place.road_address_name || undefined,
    placeUrl: place.place_url || undefined,
    categoryGroupName: place.category_group_name || undefined,
    categoryPath: place.category_name || undefined,
    ...MOCK_ENTRY_OVERRIDES[place.id],
  };
}

// 자동완성 확정 가게(SuggestItem 형태)를 단일 엔트리로 합성 — focus 모드 진입 시 사용
export function synthesizeEntryFromSuggest(item: {
  id: string;
  name: string;
  address: string;
  category: string;
  center: { lat: number; lng: number };
}): RegionalRankEntry {
  return synthesizeEntry(
    {
      id: item.id,
      place_name: item.name,
      category_name: item.category,
      category_group_code: '',
      category_group_name: '',
      address_name: item.address,
      road_address_name: item.address,
      x: String(item.center.lng),
      y: String(item.center.lat),
      phone: '',
      place_url: '',
      distance: '',
    },
    0,
  );
}

// TODO: 1차 MVP 제외 — 실제 mock 상세 데이터가 있는 place ID에 대해 카드 필드 덮어쓰기
const MOCK_ENTRY_OVERRIDES: Record<string, Partial<import('@/types/restaurant').RegionalRankEntry>> = {
  '1309119533': {
    name: '카레당',
    category: '일식',
    subCategory: '카레',
    communityAvgScore: 4.5,
    trustScore: 78,
    reviewCount: 87,
    imageUrl: '',
    hasRealData: true,
  },
};
