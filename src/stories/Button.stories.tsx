import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PencilLine, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VARIANTS = ['default', 'secondary', 'outline', 'ghost', 'link', 'destructive'] as const;
const TEXT_SIZES = ['xs', 'sm', 'default', 'lg'] as const;
const ICON_SIZES = ['icon-xs', 'icon-sm', 'icon', 'icon-lg'] as const;

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '버튼 프리미티브. radius·타이포가 프로젝트 토큰에 맞춰져 있어 호출부에서 덮어쓸 필요가 없다. disabled는 투명도가 아니라 색 교체로 표현하고, loading 중에는 variant 색을 유지한 채 스피너만 돈다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    size: { control: 'select', options: [...TEXT_SIZES, ...ICON_SIZES] },
    loading: { control: 'boolean', description: '스피너 표시 + 클릭 차단 (너비 유지)' },
    disabled: { control: 'boolean' },
    asChild: { control: false, description: 'loading과 함께 쓸 수 없다 (타입으로 차단)' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { docs: { description: { story: '기본' } } },
  args: { children: '리뷰 등록하기' },
};

export const Variants: Story = {
  parameters: { docs: { description: { story: '6종' } } },
  args: { children: '버튼' },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  parameters: { docs: { description: { story: '높이·radius가 함께 스케일' } } },
  args: { children: '버튼' },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        {TEXT_SIZES.map((size) => (
          <div key={size} className="flex flex-col items-center gap-1.5">
            <Button size={size}>리뷰 쓰기</Button>
            <span className="text-label-3 text-muted-foreground">{size}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {ICON_SIZES.map((size) => (
          <div key={size} className="flex flex-col items-center gap-1.5">
            <Button size={size} aria-label="삭제">
              <Trash2 />
            </Button>
            <span className="text-label-3 text-muted-foreground">{size}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Matrix: Story = {
  parameters: { docs: { description: { story: 'variant × 상태 (회귀 확인용)' } } },
  args: { children: '버튼' },
  render: () => (
    <table className="border-separate border-spacing-3">
      <thead>
        <tr className="text-label-3 text-muted-foreground">
          <th />
          <th className="font-normal">기본</th>
          <th className="font-normal">disabled</th>
          <th className="font-normal">loading</th>
        </tr>
      </thead>
      <tbody>
        {VARIANTS.map((variant) => (
          <tr key={variant}>
            <td className="text-label-3 text-muted-foreground">{variant}</td>
            <td>
              <Button variant={variant}>등록하기</Button>
            </td>
            <td>
              <Button variant={variant} disabled>
                등록하기
              </Button>
            </td>
            <td>
              <Button variant={variant} loading>
                등록하기
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const Loading: Story = {
  args: { children: '리뷰 등록하기', loading: true },
  parameters: {
    docs: {
      description: {
        story:
          '너비 유지 — 스피너를 absolute로 얹고 children은 invisible로 남겨 버튼 너비가 그대로다. 같은 문구의 loading/기본 상태를 나란히 두면 폭이 일치한다.',
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="lg">리뷰 등록하기</Button>
      <Button size="lg" loading>
        리뷰 등록하기
      </Button>
    </div>
  ),
};

export const WithIcon: Story = {
  name: 'WithIcon',
  parameters: { docs: { description: { story: '아이콘 + 텍스트' } } },
  args: { children: '리뷰 쓰기' },
  render: () => (
    <div className="flex items-center gap-3">
      <Button>
        <PencilLine />
        리뷰 쓰기
      </Button>
      <Button variant="outline" size="lg">
        <PencilLine />
        리뷰 쓰기
      </Button>
    </div>
  ),
};
