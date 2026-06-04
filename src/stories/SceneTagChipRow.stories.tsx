import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { SceneTagChipRow } from '@/components/common/display/scene-tag-chip-row';
import { OCCASIONS } from '@/lib/domain/category';

const meta = {
  title: 'Common/Display/SceneTagChipRow',
  component: SceneTagChipRow,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '상황 태그 배열을 토글 칩 목록으로 렌더 — 레이아웃 래퍼는 부모가 담당. ToggleChip의 컬렉션 래퍼',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    tags: { control: false, description: '태그 문자열 배열' },
    isActive: { control: false },
    onToggle: { control: false },
    variant: {
      control: 'select',
      options: ['filter', 'form'],
      description: 'filter=상황 필터 | form=리뷰 작성',
    },
    size: { control: 'select', options: ['sm', 'md'] },
    checkPosition: {
      control: 'select',
      options: ['start', 'end', 'none'],
      description: '활성 시 Check 아이콘 위치',
    },
  },
} satisfies Meta<typeof SceneTagChipRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filter: Story = {
  name: 'Filter — 상황 필터 (일부 활성)',
  args: { tags: OCCASIONS, isActive: () => false, onToggle: () => undefined },
  render: () => {
    const [active, setActive] = useState(new Set(['데이트']));
    return (
      <div className="flex flex-wrap gap-2">
        <SceneTagChipRow
          tags={OCCASIONS}
          isActive={(t) => active.has(t)}
          onToggle={(t) => setActive((prev) => {
            const next = new Set(prev);
            if (next.has(t)) { next.delete(t); } else { next.add(t); }
            return next;
          })}
          variant="filter"
          checkPosition="start"
        />
      </div>
    );
  },
};

export const Form: Story = {
  name: 'Form — 리뷰 작성 (form variant)',
  args: { tags: OCCASIONS, isActive: () => false, onToggle: () => undefined },
  render: () => {
    const [active, setActive] = useState(new Set<string>());
    return (
      <div className="flex flex-wrap gap-2">
        <SceneTagChipRow
          tags={OCCASIONS}
          isActive={(t) => active.has(t)}
          onToggle={(t) => setActive((prev) => {
            const next = new Set(prev);
            if (next.has(t)) { next.delete(t); } else { next.add(t); }
            return next;
          })}
          variant="form"
          size="md"
          checkPosition="end"
        />
      </div>
    );
  },
};

export const WithHashPrefix: Story = {
  name: 'WithHashPrefix — # 접두사 라벨',
  args: { tags: OCCASIONS, isActive: () => false, onToggle: () => undefined },
  render: () => {
    const [active, setActive] = useState(new Set(['혼밥']));
    return (
      <div className="flex flex-wrap gap-2">
        <SceneTagChipRow
          tags={OCCASIONS}
          isActive={(t) => active.has(t)}
          onToggle={(t) => setActive((prev) => {
            const next = new Set(prev);
            if (next.has(t)) { next.delete(t); } else { next.add(t); }
            return next;
          })}
          formatLabel={(t) => `#${t}`}
          checkPosition="none"
        />
      </div>
    );
  },
};
