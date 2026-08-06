import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Bookmark, Share2, Heart } from 'lucide-react';
import { IconButton } from '@/components/core/icon-button';

const meta = {
  title: 'Core/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '원형 아이콘 버튼 — ui/button을 rounded-full로 감싼 공통 프리미티브. 두 사이즈 모두 터치 타깃 권장값 44px 이상이라 히트박스 확장 없이 시각 크기 = 클릭 영역이다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    icon: { control: false, description: 'Lucide 아이콘 컴포넌트' },
    'aria-label': { control: 'text', description: '스크린 리더 라벨 (필수)' },
    active: { control: 'boolean', description: 'true → bg-primary (북마크 등 토글 강조)' },
    disabled: { control: 'boolean', description: 'true → 불투명·클릭 불가 (준비 중 기능)' },
    size: {
      control: 'select',
      options: ['md', 'lg'],
      description: 'md(44) | lg(48) — 둘 다 터치 타깃 권장값 44px 이상',
    },
    variant: {
      control: 'select',
      options: ['secondary', 'ghost', 'outline', 'destructive'],
      description: 'inactive 상태 variant (active=true면 default로 override)',
    },
    iconClassName: { control: 'text', description: '아이콘 추가 클래스 (예: fill-current)' },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { docs: { description: { story: '기본 (북마크)' } } },
  args: { icon: Bookmark, 'aria-label': '북마크' },
};

export const Active: Story = {
  parameters: { docs: { description: { story: '활성 상태' } } },
  args: { icon: Bookmark, 'aria-label': '북마크', active: true, iconClassName: 'fill-current' },
};

export const Disabled: Story = {
  parameters: { docs: { description: { story: '준비 중 기능' } } },
  args: { icon: Share2, 'aria-label': '공유', disabled: true },
};

export const Sizes: Story = {
  parameters: { docs: { description: { story: '크기 비교 (44 / 48)' } } },
  args: { icon: Heart, 'aria-label': '좋아요' },
  render: () => (
    <div className="flex items-center gap-3">
      {(['md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-1.5">
          <IconButton icon={Heart} aria-label="좋아요" size={size} />
          <span className="text-label-3 text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const ShareBookmarkPair: Story = {
  name: 'ShareBookmarkPair',
  parameters: { docs: { description: { story: '공유+북마크 조합 (상세 페이지)' } } },
  args: { icon: Bookmark, 'aria-label': '북마크' },
  render: () => (
    <div className="flex items-center gap-1.5">
      <IconButton icon={Share2} aria-label="공유" disabled />
      <IconButton icon={Bookmark} aria-label="북마크" />
    </div>
  ),
};
