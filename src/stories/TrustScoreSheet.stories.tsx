import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TrustScoreSheet } from '@/components/common/trust/trust-score-sheet';
import type { TrustBreakdown } from '@/types/restaurant';

const mockBreakdown: TrustBreakdown = {
  photoRatio: 0.72,
  longTextRatio: 0.58,
  recentActivityRatio: 0.85,
};

const lowBreakdown: TrustBreakdown = {
  photoRatio: 0.2,
  longTextRatio: 0.15,
  recentActivityRatio: 0.3,
};

const meta = {
  title: 'Common/Trust/TrustScoreSheet',
  component: TrustScoreSheet,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '가게 신뢰도 점수 구성 요소를 바텀 시트로 상세 표시',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean', description: '시트 열림 여부' },
    restaurantName: { control: 'text', description: '음식점 이름' },
    trustScore: { control: { type: 'number', min: 0, max: 100 }, description: '신뢰도 점수 (0~100)' },
    reviewCount: { control: 'number', description: '총 리뷰 수' },
    breakdown: { control: false, description: '신뢰도 구성 비율' },
    onOpenChange: { control: false },
  },
} satisfies Meta<typeof TrustScoreSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => undefined;

export const Default: Story = {
  name: 'Default — 높은 신뢰도 (87)',
  args: {
    open: true,
    onOpenChange: noop,
    restaurantName: '을지로 양꼬치',
    trustScore: 87,
    breakdown: mockBreakdown,
    reviewCount: 124,
  },
};

export const LowTrust: Story = {
  name: 'LowTrust — 낮은 신뢰도 (28)',
  args: {
    open: true,
    onOpenChange: noop,
    restaurantName: '신사동 카페',
    trustScore: 28,
    breakdown: lowBreakdown,
    reviewCount: 15,
  },
};

export const FewReviews: Story = {
  name: 'FewReviews — 리뷰 적음',
  args: {
    open: true,
    onOpenChange: noop,
    restaurantName: '망원동 파스타',
    trustScore: 62,
    breakdown: { photoRatio: 0.5, longTextRatio: 0.4, recentActivityRatio: 0.6 },
    reviewCount: 5,
  },
};
