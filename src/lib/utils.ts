import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const customTwMerge = extendTailwindMerge<'press-scale'>({
  extend: {
    theme: {
      // 이 목록에 없으면 rounded-lg 같은 기본값을 덮지 못하고 두 클래스가 함께 남는다
      radius: ['chip', 'card', 'modal'],
    },
    classGroups: {
      // 커스텀 유틸이라 tw-merge가 충돌을 모른다 — 등록해야 호출부의 -row가 base를 덮는다
      'press-scale': ['press-scale', 'press-scale-row'],
      'font-size': [
        'text-headline-1',
        'text-headline-2',
        'text-headline-3',
        'text-title-1',
        'text-title-2',
        'text-title-3',
        'text-body-1',
        'text-body-2',
        'text-body-3',
        'text-label-1',
        'text-label-2',
        'text-label-3',
        'text-caption-1',
        'text-caption-2',
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
