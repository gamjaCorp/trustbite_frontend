// Foundation — 타이포그래피 토큰 카탈로그
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { cn } from '@/lib/utils';

const meta = {
  title: 'Foundation/Typography',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'raw `text-3xl font-bold` 조합 금지. globals.css @utility 시맨틱 유틸만 사용한다.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ── 데이터 ──────────────────────────────────────────────────

const UTILITIES = [
  { util: 'text-headline-1', px: '24px', weight: '600', lh: '32px', category: 'Headline' },
  { util: 'text-headline-2', px: '20px', weight: '600', lh: '28px', category: 'Headline' },
  { util: 'text-headline-3', px: '16px', weight: '600', lh: '24px', category: 'Headline' },
  { util: 'text-title-1', px: '16px', weight: '600', lh: '24px', category: 'Title' },
  { util: 'text-title-2', px: '14px', weight: '600', lh: '20px', category: 'Title' },
  { util: 'text-title-3', px: '14px', weight: '500', lh: '20px', category: 'Title' },
  { util: 'text-body-1', px: '16px', weight: '400', lh: '24px', category: 'Body' },
  { util: 'text-body-2', px: '14px', weight: '500', lh: '20px', category: 'Body' },
  { util: 'text-body-3', px: '12px', weight: '400', lh: '16px', category: 'Body' },
  { util: 'text-label-1', px: '16px', weight: '500', lh: '24px', category: 'Label' },
  { util: 'text-label-2', px: '14px', weight: '600', lh: '20px', category: 'Label' },
  { util: 'text-label-3', px: '12px', weight: '500', lh: '16px', category: 'Label' },
  { util: 'text-caption-1', px: '14px', weight: '400', lh: '20px', category: 'Caption' },
  { util: 'text-caption-2', px: '12px', weight: '400', lh: '18px', category: 'Caption' },
];

const CATEGORY_COLOR: Record<string, string> = {
  Headline: 'bg-primary-subtle text-primary',
  Title: 'bg-success-subtle text-success',
  Body: 'bg-palette-blue-subtle text-info',
  Label: 'bg-palette-amber-subtle text-warning',
  Caption: 'bg-muted text-muted-foreground',
};

const DEFAULTS = [
  {
    context: '일반 본문',
    util: 'text-body-1',
    meta: '16px / 400',
    ref: 'Toss 송금/홈 본문 15-17px',
  },
  {
    context: '리스트 1차 텍스트 (매장명·카드 제목)',
    util: 'text-title-1',
    meta: '16px / 600',
    ref: '당근 매물 카드 제목 ~17px',
  },
  {
    context: '리스트 2차 텍스트 (주소·메타)',
    util: 'text-body-2',
    meta: '14px / 500',
    ref: '당근 카드 보조 라인',
  },
  { context: '폼 라벨', util: 'text-title-2', meta: '14px / 600', ref: 'Toss 입력 라벨' },
  {
    context: '1차 CTA 버튼 텍스트',
    util: 'text-label-1',
    meta: '16px / 500',
    ref: 'Toss "송금하기" 버튼',
  },
  { context: '보조 버튼·작은 칩 라벨', util: 'text-label-2', meta: '14px / 600', ref: '—' },
  {
    context: '메타·타임스탬프·꼬리표',
    util: 'text-caption-2',
    meta: '12px / 400',
    ref: '(캡션 한정)',
  },
];

// ── 스토리 ──────────────────────────────────────────────────

export const AllUtilities: Story = {
  name: 'AllUtilities',
  parameters: { docs: { description: { story: '14종 유틸 쇼케이스' } } },
  render: () => {
    const categories = ['Headline', 'Title', 'Body', 'Label', 'Caption'];
    return (
      <div className="space-y-8">
        {categories.map((cat) => (
          <div key={cat}>
            <p className="text-caption-2 text-muted-foreground uppercase tracking-widest mb-3">
              {cat}
            </p>
            <div className="divide-y divide-border rounded-card border border-border overflow-hidden">
              {UTILITIES.filter((u) => u.category === cat).map((u) => (
                <div key={u.util} className="flex items-baseline gap-4 px-5 py-4">
                  <div className="w-40 shrink-0">
                    <code className="text-caption-2 text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {u.util}
                    </code>
                    <p className="text-caption-2 text-muted-foreground mt-1">
                      {u.px} / {u.weight} / lh {u.lh}
                    </p>
                  </div>
                  <p className={cn(u.util, 'text-foreground flex-1')}>신뢰할 수 있는 맛집 정보</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

export const Defaults: Story = {
  parameters: { docs: { description: { story: 'Toss·당근 기준 매핑 표' } } },
  render: () => (
    <div>
      <p className="text-body-2 text-muted-foreground mb-6">
        어떤 맥락에 어떤 유틸을 쓸지 한 화면에서 결정한다. 추측 없이 이 표에서 선택.
      </p>
      <div className="divide-y divide-border rounded-card border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 bg-muted text-caption-2 text-muted-foreground">
          <span>맥락</span>
          <span className="w-32 text-right">유틸</span>
          <span className="w-24 text-right">px / weight</span>
          <span className="w-32 text-right">레퍼런스</span>
        </div>
        {DEFAULTS.map((d) => (
          <div
            key={d.util}
            className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-4"
          >
            <p className="text-body-2 text-foreground">{d.context}</p>
            <span
              className={cn(
                'w-32 text-right text-label-3 px-2 py-0.5 rounded-chip',
                CATEGORY_COLOR[UTILITIES.find((u) => u.util === d.util)?.category ?? 'Caption'],
              )}
            >
              {d.util}
            </span>
            <p className="text-caption-2 text-muted-foreground w-24 text-right">{d.meta}</p>
            <p className="text-caption-2 text-muted-foreground w-32 text-right">{d.ref}</p>
          </div>
        ))}
      </div>
    </div>
  ),
};
