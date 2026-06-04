import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { RestaurantIdentityRow } from '@/components/common/restaurant/restaurant-identity-row';

const meta = {
  title: 'Common/Restaurant/RestaurantIdentityRow',
  component: RestaurantIdentityRow,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '음식점 이름 + 카테고리 뱃지 + 부제(지역/주소) 한 쌍 — 리스트 행·카드에서 공통으로 사용',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text', description: '음식점 이름' },
    category: {
      control: 'select',
      options: ['한식', '일식', '중식', '양식', '분식', '치킨', '패스트푸드', '카페', '술집', '기타'],
      description: '카테고리',
    },
    subtitle: { control: 'text', description: '부제 — 지역, 주소 등' },
    className: { control: 'text', description: '추가 클래스' },
  },
} satisfies Meta<typeof RestaurantIdentityRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default — 한식 + 지역',
  args: {
    name: '을지로 할머니 국밥',
    category: '한식',
    subtitle: '을지로 · 서울 중구',
  },
  render: (args) => (
    <div className="w-64">
      <RestaurantIdentityRow {...args} />
    </div>
  ),
};

export const LongName: Story = {
  name: 'LongName — 긴 이름 truncate',
  args: {
    name: '이름이 아주 길어서 넘칠 수도 있는 레스토랑의 이름입니다',
    category: '양식',
    subtitle: '강남구 · 서울',
  },
  render: (args) => (
    <div className="w-48">
      <RestaurantIdentityRow {...args} />
    </div>
  ),
};

export const Categories: Story = {
  name: 'Categories — 카테고리별',
  args: { name: '예시', category: '한식', subtitle: '지역' },
  render: () => (
    <div className="space-y-4 w-72">
      {(
        [
          { name: '스시 오마카세 료칸', category: '일식', subtitle: '청담동' },
          { name: '홍콩반점 0410', category: '중식', subtitle: '홍대' },
          { name: '블루보틀 커피', category: '카페', subtitle: '성수동' },
          { name: '이태원 클럽', category: '술집', subtitle: '이태원' },
        ] as const
      ).map((item) => (
        <RestaurantIdentityRow key={item.name} {...item} />
      ))}
    </div>
  ),
};
