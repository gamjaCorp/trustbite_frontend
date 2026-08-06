import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProfileHeaderCard } from '@/components/common/profile/profile-header-card';

const meta = {
  title: 'Common/ProfileHeaderCard',
  component: ProfileHeaderCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '프로필 헤더 카드 공통 셸 — /profile, /user/[id]에서 공유',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    avatarInitial: { control: 'text', description: '아바타 이니셜' },
    avatarUrl: { control: 'text', description: '아바타 이미지 URL (선택)' },
    title: { control: false, description: '이름 + 뱃지 슬롯' },
    subtitle: { control: false, description: '부제목 슬롯 (선택)' },
    rightAction: { control: false, description: '우측 액션 슬롯' },
    followerCount: { control: 'number', description: '팔로워 수' },
    followingCount: { control: 'number', description: '팔로잉 수' },
    followStatsSize: {
      control: 'select',
      options: ['sm', 'md'],
      description: '팔로우 통계 크기',
    },
    followersHref: { control: 'text', description: '팔로워 목록 경로' },
    followingHref: { control: 'text', description: '팔로잉 목록 경로' },
    bottomRight: { control: false, description: '하단 우측 슬롯' },
  },
} satisfies Meta<typeof ProfileHeaderCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { docs: { description: { story: '기본 (아바타 이니셜)' } } },
  args: {
    avatarInitial: '보',
    title: <span className="text-headline-3">보람</span>,
    followerCount: 124,
    followingCount: 38,
    followersHref: '/follow/me?tab=followers',
    followingHref: '/follow/me?tab=following',
  },
};

export const WithAvatar: Story = {
  name: 'WithAvatar',
  parameters: { docs: { description: { story: '아바타 이미지' } } },
  args: {
    avatarInitial: '보',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=boram',
    title: <span className="text-headline-3">보람</span>,
    subtitle: '@boram',
    followerCount: 124,
    followingCount: 38,
    followersHref: '/follow/me?tab=followers',
    followingHref: '/follow/me?tab=following',
  },
};

export const WithBottomRight: Story = {
  name: 'WithBottomRight',
  parameters: { docs: { description: { story: '하단 우측 슬롯' } } },
  args: {
    avatarInitial: '보',
    title: <span className="text-headline-3">보람</span>,
    subtitle: '@boram',
    followerCount: 124,
    followingCount: 38,
    followersHref: '/follow/me?tab=followers',
    followingHref: '/follow/me?tab=following',
    bottomRight: (
      <button className="text-label-2 text-muted-foreground border border-border rounded-md px-3 py-1.5">
        팔로우
      </button>
    ),
  },
};

export const SmallStats: Story = {
  name: 'SmallStats',
  parameters: { docs: { description: { story: 'sm 팔로우 통계' } } },
  args: {
    avatarInitial: '보',
    title: <span className="text-headline-3">보람</span>,
    followerCount: 8,
    followingCount: 3,
    followStatsSize: 'sm',
    followersHref: '/follow/me?tab=followers',
    followingHref: '/follow/me?tab=following',
  },
};
