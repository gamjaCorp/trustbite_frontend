import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { RankMedal } from '@/components/common/display/rank-medal';

const meta = {
  title: 'Common/RankMedal',
  component: RankMedal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '순위 메달 배지 — 1~3위는 금·은·동, 그 외는 fallback 톤',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    rank: {
      control: { type: 'number', min: 1, max: 99 },
      description: '순위 번호',
    },
    fallbackTone: {
      control: 'select',
      options: ['muted', 'paper'],
      description: '4위 이상일 때 배경 톤',
    },
  },
} satisfies Meta<typeof RankMedal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gold: Story = {
  name: 'Gold — 1위 금메달',
  args: { rank: 1 },
};

export const Silver: Story = {
  name: 'Silver — 2위 은메달',
  args: { rank: 2 },
};

export const Bronze: Story = {
  name: 'Bronze — 3위 동메달',
  args: { rank: 3 },
};

export const Fallback: Story = {
  name: 'Fallback — 4위 이상 (muted)',
  args: { rank: 7, fallbackTone: 'muted' },
};

export const FallbackPaper: Story = {
  name: 'FallbackPaper — 4위 이상 (paper)',
  args: { rank: 12, fallbackTone: 'paper' },
};
