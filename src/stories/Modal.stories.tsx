'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Check, Lock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/core/modal';

const meta = {
  title: 'Core/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '반응형 모달 — 데스크톱은 중앙 카드, 모바일(<768px)은 바텀시트. 제목·설명·아이콘·버튼을 prop으로 내려준다. 창 폭을 줄이면 전환을 확인할 수 있다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: { control: false, description: '열림 상태 — 항상 controlled로 쓴다' },
    onOpenChange: {
      control: false,
      description: 'X·오버레이·ESC·보조 버튼으로 닫힐 때 상태를 되돌려준다',
    },
    title: {
      control: 'text',
      description: '제목 — radix 접근성 이름을 겸하므로 hideHeader여도 반드시 채운다',
    },
    description: { control: 'text', description: '제목 아래 보조 설명 (없으면 제목만 렌더)' },
    hideHeader: {
      control: 'boolean',
      description: '제목·설명을 sr-only로만 남긴다 — 사진 뷰어처럼 헤더가 방해될 때',
    },
    icon: {
      control: false,
      description:
        '원형 배경 위에 놓이는 아이콘 — 좌측 정렬은 제목 옆, 가운데 정렬은 제목 위. 크기는 Modal이 정하므로 <Lock /> 처럼 그대로 넘긴다',
    },
    iconTone: {
      control: 'select',
      options: ['primary', 'success', 'destructive'],
      description: '아이콘 원의 배경·글자 색 (icon이 있을 때만 의미 있음)',
    },
    align: {
      control: 'inline-radio',
      options: ['left', 'center'],
      description: 'left는 제목 좌측 + 버튼 우측 하단, center는 제목 가운데 + 버튼 균등 분할',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description:
        '데스크톱 최대 너비 (sm 384 / md 448 / lg 512 / xl 768) — 바텀시트에는 영향 없음',
    },
    mobileSheet: {
      control: 'boolean',
      description: '모바일(<768px)에서 바텀시트로 전환할지 — 중앙 고정이 필요하면 false',
    },
    primaryAction: {
      control: false,
      description: '주요 버튼 — href를 주면 Link로 렌더. 누른다고 자동으로 닫히지는 않는다',
    },
    secondaryAction: { control: false, description: '보조 버튼 — 누르면 자동으로 닫힌다' },
    footer: {
      control: false,
      description:
        '버튼이 폼 상태에 의존할 때의 탈출구 — 주면 primaryAction·secondaryAction을 대체한다',
    },
    children: { control: false, description: '본문 — 넣으면 헤더·푸터 사이의 스크롤 영역이 된다' },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

const BASE_ARGS = {
  open: false,
  onOpenChange: () => undefined,
  title: '맛집에 추가하시겠어요?',
  description: '내 맛집 목록에 저장됩니다.',
} satisfies Partial<Meta<typeof Modal>['args']> & { title: string };

// title·description·align·size 컨트롤이 실제로 반영되는 유일한 스토리
export const Default: Story = {
  parameters: { docs: { description: { story: '확인 다이얼로그 (컨트롤 연결)' } } },
  args: BASE_ARGS,
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>모달 열기</Button>
        <Modal
          {...args}
          open={open}
          onOpenChange={setOpen}
          primaryAction={{ label: '추가하기', onClick: () => setOpen(false) }}
          secondaryAction={{ label: '취소' }}
        />
      </>
    );
  },
};

export const Destructive: Story = {
  parameters: { docs: { description: { story: '삭제 확인' } } },
  args: BASE_ARGS,
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          삭제 모달 열기
        </Button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          icon={<Trash2 />}
          iconTone="destructive"
          title="리뷰를 삭제할까요?"
          description="삭제된 리뷰는 복구할 수 없어요."
          primaryAction={{ label: '삭제하기', tone: 'destructive', onClick: () => setOpen(false) }}
          secondaryAction={{ label: '취소' }}
        />
      </>
    );
  },
};

export const LinkAction: Story = {
  name: 'LinkAction',
  parameters: { docs: { description: { story: '가운데 정렬 + 링크 CTA' } } },
  args: { ...BASE_ARGS, align: 'center', description: undefined },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          로그인 CTA 열기
        </Button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          // 가운데 정렬 — 아이콘이 제목 위로 올라가고 버튼은 폭을 반씩 나눈다
          align="center"
          icon={<Lock />}
          title="로그인이 필요해요"
          primaryAction={{ label: '로그인하기', href: '/signin' }}
          secondaryAction={{ label: '나중에' }}
        >
          {/* align은 헤더만 정렬한다 — 본문 정렬은 children이 직접 정한다 */}
          <p className="text-center text-body-2 text-muted-foreground">
            로그인하면 모든 리뷰를 볼 수 있어요
          </p>
        </Modal>
      </>
    );
  },
};

export const WithBody: Story = {
  name: 'WithBody',
  parameters: { docs: { description: { story: '높이 제한 + 본문 스크롤' } } },
  args: BASE_ARGS,
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>결과 모달 열기</Button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          icon={<Check strokeWidth={2.5} />}
          iconTone="success"
          title="리뷰 잘 올라갔어요"
          description="신뢰도가 +4%P 올랐어요"
          // 기본 max-h-[85dvh]를 className으로 덮으면 그만큼만 차지하고 본문이 스크롤된다
          className="max-h-[60dvh]"
          primaryAction={{ label: '내가 쓴 리뷰 확인하기', onClick: () => setOpen(false) }}
          secondaryAction={{ label: '리뷰 하나 더 쓰기' }}
        >
          <div className="space-y-4">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="rounded-card bg-muted/40 p-5">
                <p className="text-title-2 text-foreground">본문 카드 {i + 1}</p>
                <p className="text-body-2 text-muted-foreground">
                  본문이 길어지면 이 영역만 스크롤되고 헤더·버튼은 고정된다.
                </p>
              </div>
            ))}
          </div>
        </Modal>
      </>
    );
  },
};

export const CustomFooter: Story = {
  name: 'CustomFooter',
  parameters: { docs: { description: { story: 'footer 탈출구' } } },
  args: BASE_ARGS,
  render: () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          폼 모달 열기
        </Button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          title="프로필 편집"
          footer={
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                취소
              </Button>
              {/* 버튼이 폼 상태에 의존하면 primaryAction 대신 footer로 직접 채운다 */}
              <Button disabled={value.trim().length < 2} onClick={() => setOpen(false)}>
                저장
              </Button>
            </>
          }
        >
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="닉네임 2자 이상"
            className="h-12 w-full rounded-xl border border-border px-4 text-body-1"
          />
        </Modal>
      </>
    );
  },
};
