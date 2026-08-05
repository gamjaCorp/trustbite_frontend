import {
  Beer,
  Coffee,
  Cookie,
  Drumstick,
  Fish,
  LayoutGrid,
  MoreHorizontal,
  Sandwich,
  Soup,
  Utensils,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import { Category, SceneTag } from '@/types/restaurant';
import type { RatingContext } from '@/types/rating';

export const CATEGORY_STYLE: Record<Category, string> = {
  한식: 'bg-palette-red-subtle text-palette-red',
  일식: 'bg-palette-blue-subtle text-palette-blue',
  중식: 'bg-palette-amber-subtle text-palette-amber',
  양식: 'bg-palette-green-subtle text-palette-green',
  분식: 'bg-palette-amber-subtle text-palette-amber',
  치킨: 'bg-palette-red-subtle text-palette-red',
  패스트푸드: 'bg-palette-gray-subtle text-palette-gray',
  카페: 'bg-palette-brand-subtle text-palette-brand',
  술집: 'bg-palette-red-subtle text-palette-red',
  기타: 'bg-palette-gray-subtle text-palette-gray',
};

// 텍스트 컬러만 필요한 자리(통계 셀 등)에서 reuse
export const CATEGORY_TEXT_STYLE: Record<Category, string> = {
  한식: 'text-palette-red',
  일식: 'text-palette-blue',
  중식: 'text-palette-amber',
  양식: 'text-palette-green',
  분식: 'text-palette-amber',
  치킨: 'text-palette-red',
  패스트푸드: 'text-palette-gray',
  카페: 'text-palette-brand',
  술집: 'text-palette-red',
  기타: 'text-palette-gray',
};

export const CATEGORIES: Array<Category | 'all'> = [
  'all',
  '한식',
  '일식',
  '중식',
  '양식',
  '분식',
  '치킨',
  '패스트푸드',
  '카페',
  '술집',
  '기타',
];

export const OCCASIONS: SceneTag[] = ['혼밥', '데이트', '회식', '가족', '친구'];

// 상황 태그(한글) → 백엔드 RatingContext enum 매핑 — 리뷰 제출 경계에서 사용
const SCENE_TAG_TO_RATING_CONTEXT: Record<SceneTag, RatingContext> = {
  혼밥: 'ALONE',
  데이트: 'DATE',
  회식: 'COMPANY',
  가족: 'FAMILY',
  친구: 'FRIEND',
};

export function sceneTagToRatingContext(tag: SceneTag): RatingContext {
  return SCENE_TAG_TO_RATING_CONTEXT[tag];
}

export const CATEGORY_ICON: Record<Category | 'all', LucideIcon> = {
  all: LayoutGrid,
  한식: Utensils,
  일식: Fish,
  중식: Soup,
  양식: UtensilsCrossed,
  분식: Cookie,
  치킨: Drumstick,
  패스트푸드: Sandwich,
  카페: Coffee,
  술집: Beer,
  기타: MoreHorizontal,
};
