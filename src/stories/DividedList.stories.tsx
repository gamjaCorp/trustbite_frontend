import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DividedList } from '@/components/common/display/divided-list';

const meta = {
  title: 'Common/DividedList',
  component: DividedList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '구분선 목록 — li 사이 border-t를 자동 적용하는 제네릭 리스트 래퍼',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: { control: false, description: '렌더링할 항목 배열' },
    renderItem: { control: false, description: '항목 렌더 함수' },
    keyFn: { control: false, description: '항목 key 추출 함수' },
    listClassName: { control: 'text', description: '<ul> 추가 클래스' },
  },
} satisfies Meta<typeof DividedList>;

export default meta;
type Story = StoryObj<typeof meta>;

const STRING_ITEMS = ['한식 맛집 A', '일식 맛집 B', '카페 C', '중식 맛집 D'];

export const Default: Story = {
  name: 'Default — 문자열 목록',
  args: {
    items: STRING_ITEMS,
    renderItem: (s: unknown) => <div className="py-3 px-1 text-body-2">{s as string}</div>,
    keyFn: (s: unknown) => s as string,
  },
  render: () => (
    <div className="w-80 border-y border-border">
      <DividedList
        items={STRING_ITEMS}
        keyFn={(s) => s}
        renderItem={(s) => (
          <div className="py-3 px-1 text-body-2">{s}</div>
        )}
      />
    </div>
  ),
};

const ICON_ITEMS = [
  { id: '1', label: '리뷰 작성', count: 12 },
  { id: '2', label: '맛집 추가', count: 5 },
  { id: '3', label: '팔로우', count: 3 },
];

export const WithIcons: Story = {
  name: 'WithIcons — 아이콘 포함 행',
  args: {
    items: ICON_ITEMS,
    renderItem: (i: unknown) => {
      const item = i as { id: string; label: string; count: number };
      return (
        <div className="py-3 px-1 flex justify-between text-body-2">
          <span>{item.label}</span>
          <span className="text-muted-foreground">{item.count}회</span>
        </div>
      );
    },
    keyFn: (i: unknown) => (i as { id: string }).id,
  },
  render: () => (
    <div className="w-80 border-y border-border">
      <DividedList
        items={ICON_ITEMS}
        keyFn={(i) => i.id}
        renderItem={(i) => (
          <div className="py-3 px-1 flex justify-between text-body-2">
            <span>{i.label}</span>
            <span className="text-muted-foreground">{i.count}회</span>
          </div>
        )}
      />
    </div>
  ),
};
