import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Surface } from '@/components/common/display/surface';

const meta = {
  title: 'Common/Surface',
  component: Surface,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '카드 셸 컴포넌트 — variant와 padding으로 배경·테두리 패턴 표준화',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['card', 'elevated', 'ring', 'bordered', 'subtle'],
      description: '카드 스타일 variant',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: '내부 패딩 크기',
    },
  },
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleContent = () => (
  <div className="w-64 space-y-1">
    <p className="text-headline-3">샘플 카드</p>
    <p className="text-body-2 text-muted-foreground">Surface 컴포넌트 예시 내용입니다.</p>
  </div>
);

export const Default: Story = {
  name: 'Default — card + md',
  args: { variant: 'card', padding: 'md' },
  render: (args) => (
    <Surface {...args}>
      <SampleContent />
    </Surface>
  ),
};

export const Elevated: Story = {
  name: 'Elevated — 그림자만',
  args: { variant: 'elevated', padding: 'md' },
  render: (args) => (
    <Surface {...args}>
      <SampleContent />
    </Surface>
  ),
};

export const Ring: Story = {
  name: 'Ring — 테두리만 (그림자 없음)',
  args: { variant: 'ring', padding: 'md' },
  render: (args) => (
    <Surface {...args}>
      <SampleContent />
    </Surface>
  ),
};

export const Bordered: Story = {
  name: 'Bordered — border 테두리',
  args: { variant: 'bordered', padding: 'md' },
  render: (args) => (
    <Surface {...args}>
      <SampleContent />
    </Surface>
  ),
};

export const Subtle: Story = {
  name: 'Subtle — 주요 강조 배경',
  args: { variant: 'subtle', padding: 'md' },
  render: (args) => (
    <Surface {...args}>
      <SampleContent />
    </Surface>
  ),
};

export const AllVariants: Story = {
  name: 'AllVariants — variant × padding 쇼케이스',
  parameters: { layout: 'padded' },
  render: () => (
    <div className="space-y-6 p-4">
      {(['card', 'elevated', 'ring', 'bordered', 'subtle'] as const).map((variant) => (
        <div key={variant} className="space-y-2">
          <p className="text-label-2 text-muted-foreground">{variant}</p>
          <div className="flex gap-3 flex-wrap">
            {(['none', 'sm', 'md', 'lg'] as const).map((padding) => (
              <Surface key={padding} variant={variant} padding={padding} className="w-40">
                <p className="text-label-3 text-muted-foreground">padding={padding}</p>
              </Surface>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
