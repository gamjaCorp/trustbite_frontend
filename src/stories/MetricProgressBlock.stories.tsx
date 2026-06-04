import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FileText, ShieldCheck, Star } from 'lucide-react';
import { MetricProgressBlock } from '@/components/core/metric-progress-block';

const meta = {
  title: 'Core/MetricProgressBlock',
  component: MetricProgressBlock,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '아이콘·라벨·달성여부·Progress 바 1세트 — 등급 조건 진행률 등에 사용. met true=Check, false=잔여량, undefined=우측 없음',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    icon: { control: false, description: 'Lucide 아이콘 컴포넌트' },
    iconClassName: { control: 'text', description: '아이콘 색상 클래스' },
    label: { control: 'text', description: '지표 라벨' },
    met: {
      control: 'select',
      options: [true, false, undefined],
      description: 'true=달성(Check) | false=미달성(잔여량) | undefined=우측 없음',
    },
    remaining: { control: 'text', description: 'met=false일 때 잔여량 텍스트' },
    progressValue: { control: { type: 'number', min: 0, max: 100 }, description: '프로그레스 값 (0~100)' },
    progressClassName: { control: 'text', description: 'Progress 바 색상 오버라이드' },
  },
} satisfies Meta<typeof MetricProgressBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InProgress: Story = {
  name: 'InProgress — 진행 중 (미달성)',
  args: {
    icon: FileText,
    iconClassName: 'text-palette-amber',
    label: '리뷰 10개',
    met: false,
    remaining: '4개 남음',
    progressValue: 60,
    progressClassName: 'bg-palette-amber/20 [&>[data-slot=progress-indicator]]:bg-palette-amber',
  },
  render: (args) => (
    <div className="w-72">
      <MetricProgressBlock {...args} />
    </div>
  ),
};

export const Met: Story = {
  name: 'Met — 달성 완료',
  args: {
    icon: ShieldCheck,
    iconClassName: 'text-palette-green',
    label: '신뢰도 60%',
    met: true,
    progressValue: 100,
    progressClassName: 'bg-palette-green/20 [&>[data-slot=progress-indicator]]:bg-palette-green',
  },
  render: (args) => (
    <div className="w-72">
      <MetricProgressBlock {...args} />
    </div>
  ),
};

export const NoIndicator: Story = {
  name: 'NoIndicator — 우측 없음 (met=undefined)',
  args: {
    icon: Star,
    label: '평균 별점',
    progressValue: 75,
  },
  render: (args) => (
    <div className="w-72">
      <MetricProgressBlock {...args} />
    </div>
  ),
};

export const GradeConditions: Story = {
  name: 'GradeConditions — 등급 조건 2개 세트',
  args: { icon: FileText, label: '등급 조건', progressValue: 0 },
  render: () => (
    <div className="w-72 space-y-4">
      <MetricProgressBlock
        icon={FileText}
        iconClassName="text-palette-amber"
        label="리뷰 10개"
        met={false}
        remaining="4개 남음"
        progressValue={60}
        progressClassName="bg-palette-amber/20 [&>[data-slot=progress-indicator]]:bg-palette-amber"
      />
      <MetricProgressBlock
        icon={ShieldCheck}
        iconClassName="text-palette-green"
        label="신뢰도 60%"
        met={true}
        progressValue={100}
        progressClassName="bg-palette-green/20 [&>[data-slot=progress-indicator]]:bg-palette-green"
      />
    </div>
  ),
};
