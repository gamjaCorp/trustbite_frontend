import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SectionHeader } from '@/components/common/display/section-header';

const meta = {
  title: 'Common/SectionHeader',
  component: SectionHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '섹션 헤더 — 제목 + 선택적 부제목 + 우측 액션 슬롯',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: '섹션 제목' },
    subtitle: { control: 'text', description: '부제목 (선택)' },
    size: {
      control: 'select',
      options: ['h1', 'h2', 'h3'],
      description: '제목 크기',
    },
    rightAction: { control: false, description: '우측 액션 슬롯' },
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default — h2',
  args: { title: '나의 맛집 목록', size: 'h2' },
};

export const WithSubtitle: Story = {
  name: 'WithSubtitle — 부제목 포함',
  args: { title: '신뢰도 점수', subtitle: '리뷰 퀄리티와 활동 기반으로 산정됩니다', size: 'h2' },
};

export const WithRightAction: Story = {
  name: 'WithRightAction — 우측 액션',
  args: {
    title: '최근 방문',
    size: 'h2',
    rightAction: (
      <button className="text-label-2 text-primary">전체 보기</button>
    ),
  },
};

export const AllSizes: Story = {
  name: 'AllSizes — h1/h2/h3 비교',
  args: { title: '제목 예시' },
  render: () => (
    <div className="w-80 space-y-6">
      {(['h1', 'h2', 'h3'] as const).map((size) => (
        <SectionHeader key={size} title={`${size} — 제목 예시`} size={size} />
      ))}
    </div>
  ),
};
