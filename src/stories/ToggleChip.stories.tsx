import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { ToggleChip } from '@/components/common/toggle-chip';

const meta = {
  title: 'Common/ToggleChip',
  component: ToggleChip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '활성/비활성 토글 칩 — filter(상황 필터)·form(리뷰 작성) 두 variant, sm·md 두 크기',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    active: { control: 'boolean', description: '활성 상태' },
    variant: {
      control: 'select',
      options: ['filter', 'form'],
      description: 'filter=primary-subtle 배경 | form=ring + primary/10 배경',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'sm=label-3 | md=label-2',
    },
    onClick: { control: false },
    children: { control: 'text', description: '칩 라벨' },
  },
} satisfies Meta<typeof ToggleChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FilterInactive: Story = {
  name: 'Filter — 비활성',
  args: { active: false, variant: 'filter', size: 'sm', children: '데이트', onClick: () => undefined },
};

export const FilterActive: Story = {
  name: 'Filter — 활성',
  args: { active: true, variant: 'filter', size: 'sm', children: '데이트', onClick: () => undefined },
};

export const FormInactive: Story = {
  name: 'Form — 비활성',
  args: { active: false, variant: 'form', size: 'md', children: '혼밥', onClick: () => undefined },
};

export const FormActive: Story = {
  name: 'Form — 활성',
  args: { active: true, variant: 'form', size: 'md', children: '혼밥', onClick: () => undefined },
};

export const Interactive: Story = {
  name: 'Interactive — 실제 토글',
  args: { active: false, onClick: () => undefined, children: '태그' },
  render: () => {
    const tags = ['혼밥', '데이트', '회식', '다이어트'];
    const [active, setActive] = useState<Set<string>>(new Set());
    return (
      <div className="flex items-center gap-2">
        {tags.map((tag) => (
          <ToggleChip
            key={tag}
            active={active.has(tag)}
            onClick={() => setActive((prev) => {
              const next = new Set(prev);
              if (next.has(tag)) { next.delete(tag); } else { next.add(tag); }
              return next;
            })}
            variant="filter"
            size="sm"
          >
            {tag}
          </ToggleChip>
        ))}
      </div>
    );
  },
};
