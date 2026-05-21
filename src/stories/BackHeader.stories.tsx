import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BackHeader } from '@/components/common/layout/back-header';
import { useAuthMock } from '@/stores/auth-mock-store';

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
