'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { SearchInput } from '@/components/core/search-input';

const meta = {
  title: 'Core/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '검색 아이콘이 포함된 검색 입력 필드',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text', description: '플레이스홀더 텍스트' },
    value: { control: false },
    onValueChange: { control: false },
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default — 기본',
  args: { value: '', onValueChange: () => undefined },
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-80">
        <SearchInput value={value} onValueChange={setValue} placeholder="맛집 검색" />
      </div>
    );
  },
};

export const WithValue: Story = {
  name: 'WithValue — 값 입력 상태',
  args: { value: '강남 삼겹살', onValueChange: () => undefined },
  render: () => {
    const [value, setValue] = useState('강남 삼겹살');
    return (
      <div className="w-80">
        <SearchInput value={value} onValueChange={setValue} placeholder="맛집 검색" />
      </div>
    );
  },
};

export const WithPlaceholder: Story = {
  name: 'WithPlaceholder — 긴 플레이스홀더',
  args: { value: '', onValueChange: () => undefined },
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-80">
        <SearchInput
          value={value}
          onValueChange={setValue}
          placeholder="음식점 이름이나 지역명을 입력해보세요"
        />
      </div>
    );
  },
};
