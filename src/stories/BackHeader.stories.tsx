import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BackHeader } from '@/components/common/layout/back-header';
import type { MyProfileResponse } from '@/types/user';

const MOCK_ME: MyProfileResponse = {
  userId: 1,
  email: 'ham@example.com',
  nickname: '햄',
  picture: null,
  grade: 'COLLECTOR',
  trustScore: 0.72,
  reviewCount: 37,
  nextGrade: 'EXPLORER',
  needCount: 3,
  needScore: 0.05,
  createdAt: '2026-01-01T00:00:00',
  followerCount: 12,
  followingCount: 8,
};

const meta = {
  title: 'Common/BackHeader',
  component: BackHeader,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/restaurant/1',
      },
    },
    docs: {
      description: {
        component:
          '뒤로가기 + TrustBite 로고 + 우측 내 프로필을 표시하는 페이지 헤더. app/(sub) 그룹 레이아웃이 렌더한다',
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
} satisfies Meta<typeof BackHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default — 비로그인',
  args: { me: null },
};

export const LoggedIn: Story = {
  name: 'LoggedIn — 로그인 상태',
  args: { me: MOCK_ME },
};
