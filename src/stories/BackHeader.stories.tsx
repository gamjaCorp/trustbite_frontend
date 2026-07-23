import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SessionProvider } from 'next-auth/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BackHeader } from '@/components/common/layout/back-header';

const MOCK_SESSION = {
  user: { id: 'mock-user', name: '햄' },
  expires: '2099-01-01T00:00:00.000Z',
};

const meta = {
  title: 'Common/Layout/BackHeader',
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
        component: '뒤로가기 + TrustBite 로고 + 우측 내 프로필을 표시하는 페이지 헤더',
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
  decorators: [
    (Story) => (
      <SessionProvider session={null}>
        <Story />
      </SessionProvider>
    ),
  ],
};

export const LoggedIn: Story = {
  name: 'LoggedIn — 로그인 상태',
  decorators: [
    (Story) => (
      <SessionProvider session={MOCK_SESSION}>
        <Story />
      </SessionProvider>
    ),
  ],
};
