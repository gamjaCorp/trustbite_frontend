import { Category, SceneTag } from '@/types/restaurant';

export const CATEGORY_STYLE: Record<Category, string> = {
  한식: 'bg-palette-red-subtle text-palette-red',
  일식: 'bg-palette-blue-subtle text-palette-blue',
  중식: 'bg-palette-amber-subtle text-palette-amber',
  양식: 'bg-palette-green-subtle text-palette-green',
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
  '카페',
  '술집',
  '기타',
];

export const OCCASIONS: SceneTag[] = ['혼밥', '데이트', '회식', '다이어트'];
