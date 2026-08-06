'use client';

/* 반응형 모달 — 기본은 데스크톱(≥768px) 중앙 카드 + 모바일 바텀시트.
 * ui/dialog와 ui/sheet가 같은 radix Dialog 프리미티브라 루트·타이틀·클로즈는 공유하고
 * Content만 분기한다. 호출부는 슬롯을 조립하지 않고 prop만 내려주면 된다. */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Button, type ButtonProps } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { SheetContent } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export interface ModalAction {
  label: string;
  href?: string; // 있으면 Button 대신 Link로 렌더 (로그인 CTA 등)
  onClick?: () => void;
  tone?: 'primary' | 'destructive';
  disabled?: boolean;
  loading?: boolean;
}

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string; // radix가 요구하는 접근성 이름 — hideHeader여도 반드시 채운다
  description?: string;
  hideHeader?: boolean; // 제목·설명을 sr-only로만 남긴다 (사진 뷰어처럼 헤더가 방해될 때)
  icon?: ReactNode;
  iconTone?: 'primary' | 'success' | 'destructive';
  align?: 'center' | 'left'; // 확인형은 center, 콘텐츠형은 left
  size?: keyof typeof SIZES; // 데스크톱 최대 너비
  mobileSheet?: boolean; // 모바일에서 바텀시트로 전환할지
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction; // 누르면 자동으로 닫힌다
  footer?: ReactNode; // 버튼이 폼 상태를 써야 할 때의 탈출구 — action prop보다 우선
  children?: ReactNode; // 본문 — 있으면 스크롤 영역이 된다
  className?: string;
}

const SIZES = {
  sm: 'sm:max-w-sm', // 384 — 확인/알림류 기본
  md: 'sm:max-w-md', // 448
  lg: 'sm:max-w-lg', // 512
  xl: 'sm:max-w-3xl', // 768 — 이미지·표처럼 넓은 콘텐츠
} as const;

const ICON_TONES = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/15 text-success',
  destructive: 'bg-destructive/10 text-destructive',
} as const;

const CLOSE_BUTTON =
  '[&>button]:flex [&>button]:size-8 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:hover:bg-muted [&>button>svg]:size-5';

const FOOTER_LAYOUTS = {
  left: 'justify-end *:min-w-28',
  center: '*:flex-1',
} as const;

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  hideHeader = false,
  icon,
  iconTone = 'primary',
  align = 'left',
  size = 'sm',
  mobileSheet = true,
  primaryAction,
  secondaryAction,
  footer,
  children,
  className,
}: ModalProps) {
  const isMobile = useIsMobile();
  const isCentered = align === 'center';

  // 가운데 정렬은 버튼이 폭을 반씩 차지해 면적이 커진다 — 높이·타이포도 한 단계 올린다
  const footerContent =
    footer ?? renderActions(primaryAction, secondaryAction, isCentered ? 'lg' : 'default', onOpenChange);

  const body = (
    <>
      {hideHeader ? (
        <>
          <DialogTitle className="sr-only">{title}</DialogTitle>
          {description && <DialogDescription className="sr-only">{description}</DialogDescription>}
        </>
      ) : (
        <div
          className={cn(
            'flex gap-3 px-5 pt-6 pb-3',
            // 가운데 정렬은 아이콘을 제목 위에, 좌측 정렬은 제목 옆에 둔다
            isCentered
              ? 'flex-col items-center pt-8 text-center'
              : 'flex-row items-start text-left',
          )}
        >
          {icon && (
            <div
              className={cn(
                // 원 크기가 정렬에 따라 바뀌므로 아이콘 크기도 여기서 함께 정한다
                'flex shrink-0 items-center justify-center rounded-full',
                isCentered ? 'size-14 [&_svg]:size-6' : 'size-10 [&_svg]:size-5',
                ICON_TONES[iconTone],
              )}
            >
              {icon}
            </div>
          )}
          <div className="space-y-1.5">
            <DialogTitle className="text-headline-2 text-foreground">{title}</DialogTitle>
            {description && (
              <DialogDescription className="text-body-2 text-muted-foreground">
                {description}
              </DialogDescription>
            )}
          </div>
        </div>
      )}

      {children && <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-2">{children}</div>}

      {footerContent && (
        <div className={cn('flex flex-row gap-2 px-5 pt-4 pb-5', FOOTER_LAYOUTS[align])}>
          {footerContent}
        </div>
      )}
    </>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {mobileSheet && isMobile ? (
        <SheetContent
          side="bottom"
          className={cn(
            'max-h-[90dvh] gap-0 rounded-t-modal border-t-0 bg-card pb-[env(safe-area-inset-bottom)]',
            CLOSE_BUTTON,
            className,
          )}
        >
          {body}
        </SheetContent>
      ) : (
        <DialogContent
          className={cn(
            'flex max-h-[85dvh] flex-col gap-0 overflow-hidden rounded-modal border-0 bg-card p-0 shadow-xl',
            SIZES[size],
            CLOSE_BUTTON,
            className,
          )}
        >
          {body}
        </DialogContent>
      )}
    </Dialog>
  );
}

// 보조 → 주요 순서로 렌더한다 — 주요 동작이 항상 오른쪽 끝
function renderActions(
  primary: ModalAction | undefined,
  secondary: ModalAction | undefined,
  size: ButtonProps['size'],
  onOpenChange: (open: boolean) => void,
) {
  if (!primary && !secondary) return null;

  const primaryNode = primary && (
    <Button
      key="primary"
      asChild={Boolean(primary.href)}
      size={size}
      variant={primary.tone === 'destructive' ? 'destructive' : 'default'}
      onClick={primary.href ? undefined : primary.onClick}
      disabled={primary.disabled}
      loading={primary.loading}
    >
      {primary.href ? (
        // 링크 이동만으로는 open이 true로 남는다 — 헤더처럼 라우트 전환에도 살아있는 곳에서
        // 띄우면 이동 후에도 모달이 계속 떠 있어, 이동과 함께 직접 닫는다
        <Link href={primary.href} onClick={() => onOpenChange(false)}>
          {primary.label}
        </Link>
      ) : (
        primary.label
      )}
    </Button>
  );

  const secondaryNode = secondary && (
    // 채워진 primary 옆이라 ghost보다 연회색 채움이 짝이 맞는다
    <DialogClose key="secondary" asChild>
      <Button
        variant="secondary"
        size={size}
        onClick={secondary.onClick}
        disabled={secondary.disabled}
      >
        {secondary.label}
      </Button>
    </DialogClose>
  );

  return (
    <>
      {secondaryNode}
      {primaryNode}
    </>
  );
}
