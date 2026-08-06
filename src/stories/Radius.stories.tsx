// Foundation — 라운딩 토큰 카탈로그
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { cn } from '@/lib/utils';

const meta = {
  title: 'Foundation/Radius',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'TrustBite 라운딩 토큰. rounded-chip / rounded-card / rounded-modal 3종을 우선 사용한다.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ── 데이터 ──────────────────────────────────────────────────

const RADIUS_TOKENS = [
  {
    token: 'rounded-chip',
    cssVar: '--radius-chip',
    value: '9999px (pill)',
    usage: '태그, 배지, chip 버튼',
    className: 'rounded-chip',
  },
  {
    token: 'rounded-card',
    cssVar: '--radius-card',
    value: '16px',
    usage: '카드, 이미지 컨테이너',
    className: 'rounded-card',
  },
  {
    token: 'rounded-modal',
    cssVar: '--radius-modal',
    value: '24px',
    usage: '바텀시트, 모달, 다이얼로그',
    className: 'rounded-modal',
  },
  {
    token: 'rounded-xl',
    cssVar: '--radius-xl (calc)',
    value: '16px',
    usage: '입력 필드, textarea',
    className: 'rounded-xl',
  },
  {
    token: 'rounded-full',
    cssVar: '(Tailwind 기본)',
    value: '9999px',
    usage: '아바타, 아이콘 원형 버튼',
    className: 'rounded-full',
  },
];

// ── 스토리 ──────────────────────────────────────────────────

export const AllRadius: Story = {
  name: 'AllRadius',
  parameters: { docs: { description: { story: '5종 라운딩 시각 비교' } } },
  render: () => (
    <div className="space-y-6">
      <p className="text-body-2 text-muted-foreground">
        동일 크기 박스에 각 라운딩 토큰을 적용해 비교한다.
        <br />
        <span className="text-primary">rounded-chip / rounded-card / rounded-modal</span> 3종을 우선
        사용하고, 그 외는 예외적으로.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {RADIUS_TOKENS.map((r) => (
          <div key={r.token} className="flex flex-col gap-3">
            {/* 시각 박스 */}
            <div
              className={cn(
                'h-24 w-full border-2 border-primary bg-primary-subtle flex items-center justify-center',
                r.className,
              )}
            >
              <span className="text-label-3 text-primary">{r.value}</span>
            </div>
            {/* 메타 */}
            <div>
              <p className="text-title-2 text-foreground">{r.token}</p>
              <p className="text-caption-2 text-muted-foreground mt-0.5">{r.cssVar}</p>
              <p className="text-caption-2 text-muted-foreground mt-1">{r.usage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
