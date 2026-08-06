'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { SelectList, type SelectListItem } from '@/components/core/select-list';

const REGION_ITEMS: SelectListItem[] = [
  { value: '강남', label: '강남' },
  { value: '홍대', label: '홍대' },
  { value: '종로', label: '종로' },
  { value: '이태원', label: '이태원' },
];

const SORT_ITEMS: SelectListItem[] = [
  { value: 'score', label: '별점순' },
  { value: 'recent', label: '최근순' },
  { value: 'review', label: '리뷰순' },
];

const meta = {
  title: 'Core/SelectList',
  component: SelectList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '칩 형태의 선택 드롭다운 — Radix Select를 칩 스타일로 래핑',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text', description: '미선택 시 플레이스홀더' },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: '드롭다운 정렬',
    },
    icon: { control: false, description: '좌측 아이콘 (LucideIcon)' },
    items: { control: false, description: '선택 항목 배열' },
    value: { control: false },
    onValueChange: { control: false },
  },
} satisfies Meta<typeof SelectList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { docs: { description: { story: '기본 정렬 선택' } } },
  args: { value: 'score', onValueChange: () => undefined, items: SORT_ITEMS },
  render: () => {
    const [value, setValue] = useState('score');
    return <SelectList value={value} onValueChange={setValue} items={SORT_ITEMS} />;
  },
};

export const WithIcon: Story = {
  name: 'WithIcon',
  parameters: { docs: { description: { story: '아이콘 포함' } } },
  args: { value: '강남', onValueChange: () => undefined, items: REGION_ITEMS },
  render: () => {
    const [value, setValue] = useState('강남');
    return (
      <SelectList
        value={value}
        onValueChange={setValue}
        items={REGION_ITEMS}
        icon={MapPin}
        placeholder="지역 선택"
      />
    );
  },
};

export const AlignStart: Story = {
  name: 'AlignStart',
  parameters: { docs: { description: { story: '드롭다운 왼쪽 정렬' } } },
  args: { value: 'score', onValueChange: () => undefined, items: SORT_ITEMS },
  render: () => {
    const [value, setValue] = useState('score');
    return <SelectList value={value} onValueChange={setValue} items={SORT_ITEMS} align="start" />;
  },
};

export const WithPlaceholder: Story = {
  name: 'WithPlaceholder',
  parameters: { docs: { description: { story: '미선택 상태' } } },
  args: { value: '', onValueChange: () => undefined, items: REGION_ITEMS },
  render: () => {
    const [value, setValue] = useState('');
    return (
      <SelectList
        value={value}
        onValueChange={setValue}
        items={REGION_ITEMS}
        placeholder="지역을 선택하세요"
      />
    );
  },
};
