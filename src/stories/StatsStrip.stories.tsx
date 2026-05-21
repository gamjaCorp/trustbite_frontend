import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StatsStrip } from '@/components/common/stats-strip';

const meta = {
  title: 'Common/StatsStrip',
  component: StatsStrip,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '수직 라벨+값 셀로 구성된 통계 스트립',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: { control: false, description: '통계 항목 배열' },
  },
} satisfies Meta<typeof StatsStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default — 3개 항목',
  args: {
    items: [
      { label: '방문 횟수', value: '42' },
      { label: '리뷰 수', value: '18' },
      { label: '신뢰도', value: '87%' },
    ],
  },
};

export const WithLinks: Story = {
  name: 'WithLinks — 클릭 가능 항목',
  args: {
    items: [
      { label: '방문 횟수', value: '42', href: '/my-places' },
      { label: '리뷰 수', value: '18', href: '/my-places/reviews' },
      { label: '신뢰도', value: '87%' },
    ],
  },
};

export const WithColoredValue: Story = {
  name: 'WithColoredValue — 색상 강조 값',
  args: {
    items: [
      { label: '신뢰도 점수', value: '92%', valueClassName: 'text-success' },
      { label: '리뷰 수', value: '37' },
      { label: '맛집 수', value: '14' },
    ],
  },
};
