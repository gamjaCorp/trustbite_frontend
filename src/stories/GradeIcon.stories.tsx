import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { GradeIcon } from '@/components/common/trust/grade-icon';
import { GRADE_LEVELS } from '@/lib/domain/grade-levels';

const NAMES = GRADE_LEVELS.map((d) => d.name);

const meta = {
  title: 'Common/Trust/GradeIcon',
  component: GradeIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '사용자 등급 아이콘 — 등급별 색상과 아이콘을 circle / inline 형태로 표시',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: NAMES,
      description: '등급 이름 (SPROUT=새싹 ~ MICHELIN=미슐랭)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '아이콘 크기',
    },
    variant: {
      control: 'select',
      options: ['circle', 'inline'],
      description: '표시 형태',
    },
    state: {
      control: 'select',
      options: ['default', 'muted', 'next'],
      description: '아이콘 상태',
    },
  },
} satisfies Meta<typeof GradeIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default — 맛집 수집가',
  args: { name: 'COLLECTOR', size: 'md', variant: 'circle', state: 'default' },
};

export const AllLevels: Story = {
  name: 'AllLevels — 전체 등급 쇼케이스',
  args: { name: 'SPROUT' },
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex gap-4 flex-wrap">
      {GRADE_LEVELS.map((def) => (
        <div key={def.name} className="flex flex-col items-center gap-1.5">
          <GradeIcon name={def.name} size="md" />
          <span className="text-label-3">{def.label}</span>
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  name: 'AllSizes — 크기 비교 (맛집 수집가)',
  args: { name: 'COLLECTOR' },
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-end gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-1.5">
          <GradeIcon name="COLLECTOR" size={size} />
          <span className="text-label-3 text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const InlineVariant: Story = {
  name: 'InlineVariant — 인라인 아이콘',
  args: { name: 'SPROUT' },
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex gap-3">
      {GRADE_LEVELS.map((def) => (
        <GradeIcon key={def.name} name={def.name} size="sm" variant="inline" />
      ))}
    </div>
  ),
};

export const MutedState: Story = {
  name: 'MutedState — 비활성 상태',
  args: { name: 'HUNTER' },
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex gap-4">
      <div className="flex flex-col items-center gap-1.5">
        <GradeIcon name="HUNTER" size="md" state="default" />
        <span className="text-label-3 text-muted-foreground">default</span>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <GradeIcon name="HUNTER" size="md" state="muted" />
        <span className="text-label-3 text-muted-foreground">muted</span>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <GradeIcon name="HUNTER" size="md" state="next" />
        <span className="text-label-3 text-muted-foreground">next</span>
      </div>
    </div>
  ),
};
