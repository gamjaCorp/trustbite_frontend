import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { UserAvatar } from '@/components/core/user-avatar';

const meta = {
  title: 'Core/UserAvatar',
  component: UserAvatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '유저 아바타 — bg-primary-subtle 이니셜 fallback + 선택적 이미지. xs/sm/md/lg/xl 5단계',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: '아바타 크기',
    },
    initial: { control: 'text', description: '표시할 이니셜' },
    imageUrl: { control: 'text', description: '프로필 이미지 URL (없으면 이니셜 표시)' },
    className: { control: 'text', description: '추가 클래스' },
  },
} satisfies Meta<typeof UserAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { docs: { description: { story: '이니셜 fallback' } } },
  args: { initial: '김', size: 'md' },
};

export const WithImage: Story = {
  name: 'WithImage',
  parameters: { docs: { description: { story: '이미지 있음' } } },
  args: {
    initial: '김',
    imageUrl: 'https://i.pravatar.cc/150?img=3',
    size: 'md',
  },
};

export const Sizes: Story = {
  parameters: { docs: { description: { story: '5가지 크기' } } },
  args: { initial: '김', size: 'md' },
  render: () => (
    <div className="flex items-end gap-4">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-1.5">
          <UserAvatar initial="김" size={size} />
          <span className="text-label-3 text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const MultipleUsers: Story = {
  name: 'MultipleUsers',
  parameters: { docs: { description: { story: '여러 이니셜' } } },
  args: { initial: '김', size: 'md' },
  render: () => (
    <div className="flex items-center gap-2">
      {['김', '이', '박', '최', 'J'].map((initial) => (
        <UserAvatar key={initial} initial={initial} size="md" />
      ))}
    </div>
  ),
};
