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
        component: '원형 아이콘 버튼 — ui/button을 rounded-full로 감싼 공통 프리미티브. disabled prop으로 준비 중 상태 표현.',
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
      options: ['icon-sm', 'icon', 'icon-lg'],
      description: 'icon-sm(32) | icon(36) | icon-lg(40)',
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
  name: 'Default — 기본 (북마크)',
  args: { icon: Bookmark, 'aria-label': '북마크', size: 'icon' },
};

export const Active: Story = {
  name: 'Active — 활성 상태',
  args: { icon: Bookmark, 'aria-label': '북마크', active: true, iconClassName: 'fill-current', size: 'icon' },
};

export const Disabled: Story = {
  name: 'Disabled — 준비 중 기능',
  args: { icon: Share2, 'aria-label': '공유', disabled: true, size: 'icon' },
};

export const Sizes: Story = {
  name: 'Sizes — 크기 비교',
  args: { icon: Heart, 'aria-label': '좋아요' },
  render: () => (
    <div className="flex items-center gap-3">
      {(['icon-sm', 'icon', 'icon-lg'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-1.5">
          <IconButton icon={Heart} aria-label="좋아요" size={size} />
          <span className="text-label-3 text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const ShareBookmarkPair: Story = {
  name: 'ShareBookmarkPair — 공유+북마크 조합 (상세 페이지)',
  args: { icon: Bookmark, 'aria-label': '북마크' },
  render: () => (
    <div className="flex items-center gap-1.5">
      <IconButton icon={Share2} aria-label="공유" disabled />
      <IconButton icon={Bookmark} aria-label="북마크" />
    </div>
  ),
};
