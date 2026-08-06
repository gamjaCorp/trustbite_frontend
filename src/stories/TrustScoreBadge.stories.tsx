import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TrustScoreBadge } from '@/components/common/trust/trust-score-badge';

const meta = {
  title: 'Common/TrustScoreBadge',
  component: TrustScoreBadge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '신뢰도 점수를 색상 배지로 표시 — 점수 구간별 톤 자동 적용',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    score: {
      control: { type: 'number', min: 0, max: 100 },
      description: '신뢰도 점수 (0~100)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: '배지 크기',
    },
    showIcon: {
      control: 'boolean',
      description: '아이콘 표시 여부',
    },
    onClick: { control: false, description: '클릭 핸들러 (있으면 버튼으로 렌더)' },
  },
} satisfies Meta<typeof TrustScoreBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default — 78점',
  args: { score: 78, size: 'sm', showIcon: true },
};

export const High: Story = {
  name: 'High — 높은 신뢰도 (92)',
  args: { score: 92, size: 'sm', showIcon: true },
};

export const Mid: Story = {
  name: 'Mid — 중간 신뢰도 (55)',
  args: { score: 55, size: 'sm', showIcon: true },
};

export const Low: Story = {
  name: 'Low — 낮은 신뢰도 (30)',
  args: { score: 30, size: 'sm', showIcon: true },
};

export const WithoutIcon: Story = {
  name: 'WithoutIcon — 아이콘 없음',
  args: { score: 78, size: 'sm', showIcon: false },
};

export const Large: Story = {
  name: 'Large — md 크기',
  args: { score: 78, size: 'md', showIcon: true },
};

export const Clickable: Story = {
  name: 'Clickable — 클릭 가능',
  args: { score: 78, size: 'md', showIcon: true, onClick: () => undefined },
};
