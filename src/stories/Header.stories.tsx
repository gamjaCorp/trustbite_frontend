import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Header } from '@/components/common/layout/header';
import { useAuthMock } from '@/stores/auth-mock-store';

const meta = {
  title: 'Common/Layout/Header',
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
    (Story) => {
      useAuthMock.setState({ isAuthed: false });
      return <Story />;
    },
  ],
};

export const LoggedIn: Story = {
  name: 'LoggedIn — 로그인 상태',
  decorators: [
    (Story) => {
      useAuthMock.setState({ isAuthed: true });
      return <Story />;
    },
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
    (Story) => {
      useAuthMock.setState({ isAuthed: true });
      return <Story />;
    },
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
    (Story) => {
      useAuthMock.setState({ isAuthed: false });
      return <Story />;
    },
  ],
};
