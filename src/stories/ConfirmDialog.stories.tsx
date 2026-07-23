'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Trash2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/core/confirm-dialog';

const meta = {
  title: 'Core/ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '확인·취소 다이얼로그 셸 — icon + title + description + 주요/보조 버튼',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: { control: false },
    title: { control: 'text', description: '제목' },
    description: { control: 'text', description: '설명 (선택)' },
    iconTone: {
      control: 'select',
      options: ['primary', 'success', 'destructive'],
      description: '아이콘 배경 톤',
    },
    icon: { control: false },
    primaryAction: { control: false },
    secondaryAction: { control: false },
    onOpenChange: { control: false },
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default — 기본 확인 다이얼로그',
  args: {
    open: false,
    onOpenChange: () => undefined,
    title: '맛집에 추가하시겠어요?',
    description: '내 맛집 목록에 저장됩니다.',
    iconTone: 'primary',
    primaryAction: { label: '추가하기' },
    secondaryAction: { label: '취소' },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>다이얼로그 열기</Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="맛집에 추가하시겠어요?"
          description="내 맛집 목록에 저장됩니다."
          iconTone="primary"
          primaryAction={{ label: '추가하기', onClick: () => setOpen(false) }}
          secondaryAction={{ label: '취소' }}
        />
      </>
    );
  },
};

export const Destructive: Story = {
  name: 'Destructive — 삭제 확인',
  args: {
    open: false,
    onOpenChange: () => undefined,
    title: '리뷰를 삭제할까요?',
    primaryAction: { label: '삭제하기', tone: 'destructive' },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>삭제 다이얼로그 열기</Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          icon={<Trash2 className="w-6 h-6" />}
          iconTone="destructive"
          title="리뷰를 삭제할까요?"
          description="삭제된 리뷰는 복구할 수 없습니다."
          primaryAction={{ label: '삭제하기', tone: 'destructive', onClick: () => setOpen(false) }}
          secondaryAction={{ label: '취소' }}
        />
      </>
    );
  },
};

export const WithSecondaryAction: Story = {
  name: 'WithSecondaryAction — 보조 버튼 포함',
  args: {
    open: false,
    onOpenChange: () => undefined,
    title: '로그아웃할까요?',
    primaryAction: { label: '로그아웃' },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>로그아웃 다이얼로그 열기</Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          icon={<LogOut className="w-6 h-6" />}
          iconTone="primary"
          title="로그아웃할까요?"
          primaryAction={{ label: '로그아웃', onClick: () => setOpen(false) }}
          secondaryAction={{ label: '취소' }}
        />
      </>
    );
  },
};

export const WithLinkAction: Story = {
  name: 'WithLinkAction — 링크 버튼',
  args: {
    open: false,
    onOpenChange: () => undefined,
    title: '리뷰하려면 로그인이 필요해요',
    primaryAction: { label: '로그인하기', href: '/login' },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>로그인 CTA 열기</Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="리뷰하려면 로그인이 필요해요"
          description="로그인 후 리뷰를 남겨보세요."
          iconTone="primary"
          primaryAction={{ label: '로그인하기', href: '/login' }}
          secondaryAction={{ label: '다음에 할게요' }}
        />
      </>
    );
  },
};

export const WithoutIcon: Story = {
  name: 'WithoutIcon — 아이콘 없음',
  args: {
    open: false,
    onOpenChange: () => undefined,
    title: '변경사항을 저장할까요?',
    primaryAction: { label: '저장하기' },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>저장 다이얼로그 열기</Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="변경사항을 저장할까요?"
          primaryAction={{ label: '저장하기', onClick: () => setOpen(false) }}
          secondaryAction={{ label: '취소' }}
        />
      </>
    );
  },
};
