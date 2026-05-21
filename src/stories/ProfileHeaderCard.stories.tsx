import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProfileHeaderCard } from '@/components/common/profile-header-card';

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
    onClickFollowers: { control: false },
    onClickFollowing: { control: false },
    bottomRight: { control: false, description: '하단 우측 슬롯' },
  },
} satisfies Meta<typeof ProfileHeaderCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => undefined;

export const Default: Story = {
  name: 'Default — 기본 (아바타 이니셜)',
  args: {
    avatarInitial: '보',
    title: <span className="text-headline-3">보람</span>,
    followerCount: 124,
    followingCount: 38,
    onClickFollowers: noop,
    onClickFollowing: noop,
  },
};

export const WithAvatar: Story = {
  name: 'WithAvatar — 아바타 이미지',
  args: {
    avatarInitial: '보',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=boram',
    title: <span className="text-headline-3">보람</span>,
    subtitle: '@boram',
    followerCount: 124,
    followingCount: 38,
    onClickFollowers: noop,
    onClickFollowing: noop,
  },
};

export const WithBottomRight: Story = {
  name: 'WithBottomRight — 하단 우측 슬롯',
  args: {
    avatarInitial: '보',
    title: <span className="text-headline-3">보람</span>,
    subtitle: '@boram',
    followerCount: 124,
    followingCount: 38,
    onClickFollowers: noop,
    onClickFollowing: noop,
    bottomRight: (
      <button className="text-label-2 text-muted-foreground border border-border rounded-md px-3 py-1.5">
        팔로우
      </button>
    ),
  },
};

export const SmallStats: Story = {
  name: 'SmallStats — sm 팔로우 통계',
  args: {
    avatarInitial: '보',
    title: <span className="text-headline-3">보람</span>,
    followerCount: 8,
    followingCount: 3,
    followStatsSize: 'sm',
    onClickFollowers: noop,
    onClickFollowing: noop,
  },
};
