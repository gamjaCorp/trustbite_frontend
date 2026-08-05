import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FollowStatsRow } from '@/components/common/profile/follow-stats-row';

const meta = {
  title: 'Common/Profile/FollowStatsRow',
  component: FollowStatsRow,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '팔로워·팔로잉 카운트를 링크 형태로 나란히 표시',
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
    followersHref: { control: 'text', description: '팔로워 목록 경로' },
    followingHref: { control: 'text', description: '팔로잉 목록 경로' },
  },
} satisfies Meta<typeof FollowStatsRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default — md 크기',
  args: { followerCount: 124, followingCount: 38, size: 'md', followersHref: '/follow/me?tab=followers', followingHref: '/follow/me?tab=following' },
};

export const Small: Story = {
  name: 'Small — sm 크기',
  args: { followerCount: 124, followingCount: 38, size: 'sm', followersHref: '/follow/me?tab=followers', followingHref: '/follow/me?tab=following' },
};
