import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StatCell } from '@/components/common/stat-cell';

const meta = {
  title: 'Common/StatCell',
  component: StatCell,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '라벨·값 쌍의 단위 통계 셀 — StatsStrip 내부 및 단독 사용. md=headline-1(24px), sm=title-1(16px)',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: '라벨 (ReactNode)' },
    value: { control: 'text', description: '값 (ReactNode)' },
    href: { control: 'text', description: '있으면 Link로 렌더' },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'md=headline-1(24px) | sm=title-1(16px)',
    },
    valueClassName: { control: 'text', description: '값 추가 클래스' },
    className: { control: 'text', description: '셀 추가 클래스' },
  },
} satisfies Meta<typeof StatCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default — md 크기 (StatsStrip 기본)',
  args: { label: '리뷰', value: '24', size: 'md' },
};

export const Small: Story = {
  name: 'Small — sm 크기 (등급 가이드)',
  args: { label: '리뷰', value: '24개', size: 'sm' },
};

export const WithLink: Story = {
  name: 'WithLink — 링크 셀',
  args: { label: '팔로워', value: '128', href: '/followers', size: 'md' },
};

export const StripLayout: Story = {
  name: 'StripLayout — StatsStrip 레이아웃 재현',
  args: { label: '라벨', value: '값' },
  render: () => (
    <div className="flex divide-x divide-border border border-border rounded-xl overflow-hidden w-72">
      <StatCell label="리뷰" value="24" className="flex-1 p-5 text-center" />
      <StatCell label="팔로워" value="128" href="/followers" className="flex-1 p-5 text-center" />
      <StatCell label="팔로잉" value="47" href="/following" className="flex-1 p-5 text-center" />
    </div>
  ),
};

export const SmallPair: Story = {
  name: 'SmallPair — sm 두 개 나란히',
  args: { label: '라벨', value: '값' },
  render: () => (
    <div className="flex gap-8">
      <StatCell label="리뷰" value="24개" size="sm" className="text-center" />
      <StatCell label="신뢰도" value="72%" size="sm" className="text-center" />
    </div>
  ),
};
