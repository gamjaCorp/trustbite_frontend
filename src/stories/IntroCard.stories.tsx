import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IntroCard } from '@/components/common/intro-card';

const meta = {
  title: 'Common/IntroCard',
  component: IntroCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '홈 최초 진입 시 1회 노출되는 TrustBite 핵심 가치 소개 카드',
      },
    },
  },
  tags: ['autodocs'],
  // localStorage를 초기화해서 카드가 항상 보이도록
  decorators: [
    (Story) => {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('trustbite:intro_dismissed');
      }
      return <Story />;
    },
  ],
} satisfies Meta<typeof IntroCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default — 소개 카드 (닫기 가능)',
};
