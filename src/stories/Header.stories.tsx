import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SessionProvider } from 'next-auth/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Header } from '@/components/common/layout/header';

const MOCK_SESSION = {
  user: { id: 'mock-user', name: '햄' },
  expires: '2099-01-01T00:00:00.000Z',
};

const meta = {
  title: 'Common/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
    docs: {
      description: {
        component: 'TrustBite 로고 + 탭 내비게이션 + 로그인/프로필 영역을 포함한 메인 헤더',
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
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default — 비로그인 홈',
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

export const MyPlacesTab: Story = {
  name: 'MyPlacesTab — 나의 맛집 탭 활성',
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/my-places',
      },
    },
  },
  decorators: [
    (Story) => (
      <SessionProvider session={MOCK_SESSION}>
        <Story />
      </SessionProvider>
    ),
  ],
};

export const RestaurantPath: Story = {
  name: 'RestaurantPath — 숨겨진 상태 (맛집 상세 경로)',
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/restaurant/1',
      },
    },
  },
  decorators: [
    (Story) => (
      <SessionProvider session={null}>
        <Story />
      </SessionProvider>
    ),
  ],
};
