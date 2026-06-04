import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { UtensilsCrossed, Search, Heart, Star } from 'lucide-react';
import { EmptyState } from '@/components/core/empty-state';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'Core/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '아이콘·제목·설명·CTA 4슬롯 빈 상태 — Empty 원시 컴포넌트의 반복 구조를 단일 선언으로 축약',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    icon: { control: false, description: 'Lucide 아이콘 컴포넌트' },
    title: { control: 'text', description: '제목 (ReactNode)' },
    description: { control: 'text', description: '부제목 (ReactNode, 선택)' },
    cta: { control: false, description: 'CTA 버튼 슬롯 (선택)' },
    className: { control: 'text', description: 'Empty 래퍼 추가 클래스' },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default — 제목만',
  args: {
    icon: UtensilsCrossed,
    title: '아직 기록한 맛집이 없어요',
  },
};

export const WithDescription: Story = {
  name: 'WithDescription — 제목 + 설명',
  args: {
    icon: Search,
    title: '검색 결과가 없어요',
    description: '다른 키워드로 다시 시도해보세요',
  },
};

export const WithCta: Story = {
  name: 'WithCta — 제목 + 설명 + CTA',
  args: {
    icon: UtensilsCrossed,
    title: '아직 기록한 맛집이 없어요',
    description: '첫 맛집을 추가하면 나만의 미식 가이드가 시작돼요.',
    cta: <Button className="rounded-chip">새 맛집 추가하기</Button>,
  },
};

export const Wishlist: Story = {
  name: 'Wishlist — 찜 목록 빈 상태',
  args: {
    icon: Heart,
    title: '찜한 맛집이 없어요',
    description: '마음에 드는 맛집을 찜해보세요',
    className: 'border border-dashed border-border py-6',
  },
};

export const Review: Story = {
  name: 'Review — 리뷰 빈 상태',
  args: {
    icon: Star,
    title: '아직 리뷰가 없어요',
    description: '첫 번째 리뷰를 남겨보세요',
    className: 'py-12',
  },
};
