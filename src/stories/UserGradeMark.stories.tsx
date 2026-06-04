import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TooltipProvider } from '@/components/ui/tooltip';
import { UserGradeMark } from '@/components/common/trust/user-grade-mark';
import { GRADE_LEVELS } from '@/lib/domain/grade-levels';
import type { GradeLevel } from '@/lib/domain/grade-levels';

const LEVELS = GRADE_LEVELS.map((d) => d.level) as GradeLevel[];

const meta = {
  title: 'Common/Trust/UserGradeMark',
  component: UserGradeMark,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '이름 옆에 붙이는 등급 아이콘 — hover 툴팁 또는 인라인 라벨',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  argTypes: {
    level: {
      control: 'select',
      options: LEVELS,
      description: '등급 레벨 (1=새싹 ~ 6=미슐랭)',
    },
    showLabel: {
      control: 'boolean',
      description: '등급 라벨 인라인 표시 여부',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm'],
      description: '아이콘 크기',
    },
  },
} satisfies Meta<typeof UserGradeMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default — 툴팁만 (showLabel=false)',
  args: { level: 3, showLabel: false, size: 'sm' },
};

export const WithLabel: Story = {
  name: 'WithLabel — 라벨 인라인',
  args: { level: 3, showLabel: true, size: 'sm' },
};

export const Small: Story = {
  name: 'Small — sm 크기',
  args: { level: 3, showLabel: false, size: 'sm' },
};

export const AllLevels: Story = {
  name: 'AllLevels — 전체 등급 비교',
  args: { level: 1 },
  parameters: { layout: 'padded' },
  render: () => (
    <TooltipProvider>
      <div className="flex flex-col gap-4">
        {GRADE_LEVELS.map((def) => (
          <div key={def.level} className="flex items-center gap-3">
            <span className="w-4 text-label-3 text-muted-foreground">{def.level}</span>
            <UserGradeMark level={def.level} showLabel />
            <span className="text-body-2">{def.label}</span>
          </div>
        ))}
      </div>
    </TooltipProvider>
  ),
};
