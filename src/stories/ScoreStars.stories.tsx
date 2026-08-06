import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ScoreStars } from '@/components/common/display/score-stars';

const meta = {
  title: 'Common/ScoreStars',
  component: ScoreStars,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '별점 + 점수 인라인 표시 컴포넌트',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    score: {
      control: { type: 'number', min: 0, max: 5, step: 0.1 },
      description: '별점 점수 (0~5)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '아이콘 및 텍스트 크기',
    },
  },
} satisfies Meta<typeof ScoreStars>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default — 4.3점',
  args: { score: 4.3, size: 'md' },
};

export const Full: Story = {
  name: 'Full — 만점 (5.0)',
  args: { score: 5.0, size: 'md' },
};

export const Half: Story = {
  name: 'Half — 절반 (3.5)',
  args: { score: 3.5, size: 'md' },
};

export const Empty: Story = {
  name: 'Empty — 0점',
  args: { score: 0, size: 'md' },
};

export const AllSizes: Story = {
  name: 'AllSizes — 크기 비교',
  args: { score: 4.3 },
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="w-6 text-label-2 text-muted-foreground">{size}</span>
          <ScoreStars score={4.3} size={size} />
        </div>
      ))}
    </div>
  ),
};
