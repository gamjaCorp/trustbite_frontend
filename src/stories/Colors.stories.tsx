// Foundation — 컬러 토큰 카탈로그 (Primitive Palette + Semantic)
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { cn } from '@/lib/utils';

const meta = {
  title: 'Foundation/Colors',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '2-tier 컬러 시스템. Tier 1 Primitive는 직접 참조 금지 — 컴포넌트에선 Tier 2 Semantic만 사용한다.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ── 헬퍼 컴포넌트 ──────────────────────────────────────────

function Swatch({
  bgClass,
  token,
  cssVar,
  note,
}: {
  bgClass: string;
  token: string;
  cssVar?: string;
  note?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className={cn('h-10 w-full border border-border/60', bgClass)} />
      <div>
        <p className="text-title-2 text-foreground">{token}</p>
        {cssVar && <p className="text-caption-2 text-muted-foreground">{cssVar}</p>}
        {note && <p className="text-caption-2 text-muted-foreground mt-0.5">{note}</p>}
      </div>
    </div>
  );
}

function SwatchGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">{children}</div>;
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-headline-3 text-foreground mt-8 mb-4 first:mt-0">{children}</p>;
}

// ── 데이터 ──────────────────────────────────────────────────

const PRIMITIVES = [
  { bgClass: 'bg-palette-brand', token: 'palette-brand', cssVar: '--palette-brand', note: '#ff7a00 — 주 브랜드 오렌지' },
  { bgClass: 'bg-palette-brand-subtle', token: 'palette-brand-subtle', cssVar: '--palette-brand-subtle', note: '브랜드 배경 틴트' },
  { bgClass: 'bg-palette-green', token: 'palette-green', cssVar: '--palette-green', note: '긍정·성공' },
  { bgClass: 'bg-palette-green-subtle', token: 'palette-green-subtle', cssVar: '--palette-green-subtle', note: '성공 배경 틴트' },
  { bgClass: 'bg-palette-amber', token: 'palette-amber', cssVar: '--palette-amber', note: '경고' },
  { bgClass: 'bg-palette-amber-subtle', token: 'palette-amber-subtle', cssVar: '--palette-amber-subtle', note: '경고 배경 틴트' },
  { bgClass: 'bg-palette-blue', token: 'palette-blue', cssVar: '--palette-blue', note: '정보' },
  { bgClass: 'bg-palette-blue-subtle', token: 'palette-blue-subtle', cssVar: '--palette-blue-subtle', note: '정보 배경 틴트' },
  { bgClass: 'bg-palette-red', token: 'palette-red', cssVar: '--palette-red', note: '오류·위험' },
  { bgClass: 'bg-palette-red-subtle', token: 'palette-red-subtle', cssVar: '--palette-red-subtle', note: '오류 배경 틴트' },
  { bgClass: 'bg-palette-gray', token: 'palette-gray', cssVar: '--palette-gray', note: '비활성' },
  { bgClass: 'bg-palette-gray-subtle', token: 'palette-gray-subtle', cssVar: '--palette-gray-subtle', note: '비활성 배경 틴트' },
  { bgClass: 'bg-palette-gold', token: 'palette-gold', cssVar: '--palette-gold', note: '랭킹 금메달' },
  { bgClass: 'bg-palette-silver', token: 'palette-silver', cssVar: '--palette-silver', note: '랭킹 은메달' },
  { bgClass: 'bg-palette-bronze', token: 'palette-bronze', cssVar: '--palette-bronze', note: '랭킹 동메달' },
];

const SEMANTICS = [
  { bgClass: 'bg-primary', token: 'primary', note: '주요 CTA, 강조 요소 (= palette-brand)' },
  { bgClass: 'bg-primary-subtle', token: 'primary-subtle', note: '주요 배경 틴트 (= palette-brand-subtle)' },
  { bgClass: 'bg-success', token: 'success', note: '성공 상태 (= palette-green)' },
  { bgClass: 'bg-success-subtle', token: 'success-subtle', note: '성공 배경 틴트' },
  { bgClass: 'bg-warning', token: 'warning', note: '경고 상태 (= palette-amber)' },
  { bgClass: 'bg-info', token: 'info', note: '정보 메시지 (= palette-blue)' },
  { bgClass: 'bg-error', token: 'error', note: '오류 상태 (= palette-red)' },
  { bgClass: 'bg-muted', token: 'muted', note: '보조 배경' },
  { bgClass: 'bg-muted-foreground', token: 'muted-foreground', note: '보조 텍스트' },
  { bgClass: 'bg-card', token: 'card', note: '카드 표면' },
  { bgClass: 'bg-border', token: 'border', note: '일반 구분선' },
  { bgClass: 'bg-paper', token: 'paper', note: 'warm off-white — 사이드바·시트 배경' },
  { bgClass: 'bg-paper-edge', token: 'paper-edge', note: 'paper 경계 그림자 틴트' },
  { bgClass: 'bg-ink', token: 'ink', note: 'warm gray — 마이크로 텍스트' },
];

const DARK_PRIMITIVES = [
  { bgClass: 'bg-palette-brand', token: 'palette-brand', note: '#ff8c1a (다크 변형)' },
  { bgClass: 'bg-palette-green', token: 'palette-green', note: '#4ade80 (다크 변형)' },
  { bgClass: 'bg-palette-amber', token: 'palette-amber', note: '#fbb740 (다크 변형)' },
  { bgClass: 'bg-palette-blue', token: 'palette-blue', note: '#60a5fa (다크 변형)' },
  { bgClass: 'bg-palette-red', token: 'palette-red', note: '#f87171 (다크 변형)' },
  { bgClass: 'bg-palette-gray', token: 'palette-gray', note: '#d1d5db (다크 변형)' },
  { bgClass: 'bg-palette-gold', token: 'palette-gold', note: '#fbcb47 (다크 변형)' },
  { bgClass: 'bg-palette-silver', token: 'palette-silver', note: '#c8d0db (다크 변형)' },
  { bgClass: 'bg-palette-bronze', token: 'palette-bronze', note: '#d9925a (다크 변형)' },
];

// ── 스토리 ──────────────────────────────────────────────────

export const Primitives: Story = {
  name: 'Primitives — Tier 1 팔레트 (직접 참조 금지)',
  render: () => (
    <div>
      <p className="text-body-2 text-muted-foreground mb-6">
        Tier 1 원색 정의. 컴포넌트에서는 <span className="text-primary">직접 참조 금지</span> — Semantic 토큰(Tier 2)을 통해서만 사용.
      </p>
      <SwatchGrid>
        {PRIMITIVES.map((s) => (
          <Swatch key={s.token} {...s} />
        ))}
      </SwatchGrid>
    </div>
  ),
};

export const Semantic: Story = {
  name: 'Semantic — Tier 2 (컴포넌트에서 사용)',
  render: () => (
    <div>
      <p className="text-body-2 text-muted-foreground mb-6">
        컴포넌트에서는 이 토큰만 사용한다. Tier 1 Primitive를 var()로 참조하므로 다크모드 전환 시 자동 반영.
      </p>
      <SwatchGrid>
        {SEMANTICS.map((s) => (
          <Swatch key={s.token} {...s} />
        ))}
      </SwatchGrid>
    </div>
  ),
};

export const LightVsDark: Story = {
  name: 'LightVsDark — 라이트·다크 비교 (Primitive 변형 9종)',
  parameters: { layout: 'padded' },
  render: () => (
    <div className="space-y-6">
      <p className="text-body-2 text-muted-foreground">
        다크에서 값이 바뀌는 Primitive 9종. subtle 값들은 라이트·다크 동일.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 라이트 */}
        <div className="rounded-card border border-border p-5 space-y-4 bg-background">
          <p className="text-title-1 text-foreground">라이트 모드</p>
          <SwatchGrid>
            {DARK_PRIMITIVES.map((s) => (
              <Swatch key={`light-${s.token}`} bgClass={s.bgClass} token={s.token} note={s.note} />
            ))}
          </SwatchGrid>
        </div>
        {/* 다크 */}
        <div className="dark rounded-card border border-border p-5 space-y-4 bg-background">
          <p className="text-title-1 text-foreground">다크 모드</p>
          <SwatchGrid>
            {DARK_PRIMITIVES.map((s) => (
              <Swatch key={`dark-${s.token}`} bgClass={s.bgClass} token={s.token} note={s.note} />
            ))}
          </SwatchGrid>
        </div>
      </div>
    </div>
  ),
};
