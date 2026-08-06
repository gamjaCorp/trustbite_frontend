import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  PlaceListRow,
  toPlaceListRowData,
  toPlaceListRowDataFromDetail,
} from '@/components/common/restaurant/place-list-row/index';
import { mockRankList } from '@/data/mock-restaurant';
import { getRestaurantDetail } from '@/data/mock-restaurant-detail';

const regionalEntry = mockRankList[0];
const myEntry = { ...mockRankList[0], rank: 1 };
const wishlistDetail = getRestaurantDetail('1')!;

const meta: Meta<typeof PlaceListRow> = {
  title: 'Common/PlaceListRow',
  component: PlaceListRow,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <ul className="border-y border-border">
        <li>
          <Story />
        </li>
      </ul>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PlaceListRow>;

export const Regional: Story = {
  parameters: { docs: { description: { story: '기본' } } },
  args: {
    variant: 'regional',
    data: toPlaceListRowData(regionalEntry),
  },
};

export const RegionalNoBookmark: Story = {
  name: 'Regional',
  parameters: { docs: { description: { story: '북마크 없음 (타 유저 프로필)' } } },
  args: {
    variant: 'regional',
    data: toPlaceListRowData({ ...regionalEntry, rank: 1 }),
    hideBookmark: true,
    showVisitStats: true,
  },
};

export const RegionalVisitStats: Story = {
  name: 'Regional',
  parameters: { docs: { description: { story: '방문 통계 표시' } } },
  args: {
    variant: 'regional',
    data: toPlaceListRowData(regionalEntry),
    showVisitStats: true,
  },
};

export const RegionalActive: Story = {
  name: 'Regional',
  parameters: { docs: { description: { story: 'Active (지도 연동)' } } },
  args: {
    variant: 'regional',
    data: toPlaceListRowData(regionalEntry),
    active: true,
  },
};

export const My: Story = {
  parameters: { docs: { description: { story: '나의 맛집' } } },
  args: {
    variant: 'my',
    data: toPlaceListRowData(myEntry),
  },
};

export const Wishlist: Story = {
  parameters: { docs: { description: { story: '위시리스트' } } },
  args: {
    variant: 'wishlist',
    data: toPlaceListRowDataFromDetail(wishlistDetail, { addedAt: '2025-04-01T12:00:00Z' }),
    onRemoveFromWishlist: () => undefined,
  },
};
