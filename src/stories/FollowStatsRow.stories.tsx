import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FollowStatsRow } from '@/components/common/follow-stats-row';

const meta = {
  title: 'Common/FollowStatsRow',
  component: FollowStatsRow,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '팔로워·팔로잉 카운트를 버튼 형태로 나란히 표시',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    followerCount: { control: 'number', description: '팔로워 수' },
    followingCount: { control: 'number', description: '팔로잉 수' },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: '텍스트 크기',
    },
    onClickFollowers: { control: false, description: '팔로워 클릭 핸들러' },
    onClickFollowing: { control: false, description: '팔로잉 클릭 핸들러' },
  },
} satisfies Meta<typeof FollowStatsRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default — md 크기',
  args: { followerCount: 124, followingCount: 38, size: 'md' },
};

export const Small: Story = {
  name: 'Small — sm 크기',
  args: { followerCount: 124, followingCount: 38, size: 'sm' },
};

export const WithCallbacks: Story = {
  name: 'WithCallbacks — 클릭 가능',
  args: {
    followerCount: 1024,
    followingCount: 256,
    size: 'md',
    onClickFollowers: () => alert('팔로워 클릭'),
    onClickFollowing: () => alert('팔로잉 클릭'),
  },
};
