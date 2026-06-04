import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CategoryBadge } from '@/components/common/category/category-badge';
import type { Category } from '@/lib/types/restaurant';

const CATEGORIES: Category[] = ['한식', '일식', '중식', '양식', '카페', '술집', '기타'];

const meta = {
  title: 'Common/Category/CategoryBadge',
  component: CategoryBadge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '식당 카테고리를 색상 배지로 표시',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    category: {
      control: 'select',
      options: CATEGORIES,
      description: '식당 카테고리',
    },
  },
} satisfies Meta<typeof CategoryBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default — 한식',
  args: { category: '한식' },
};

export const AllCategories: Story = {
  name: 'AllCategories — 전체 카테고리 쇼케이스',
  args: { category: '한식' },
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => (
        <CategoryBadge key={cat} category={cat} />
      ))}
    </div>
  ),
};
