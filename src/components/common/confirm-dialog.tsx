'use client';

// 확인·취소 다이얼로그 셸 — icon + title + description + 주요/보조 버튼
import type { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

interface ActionProps {
  label: string;
  // href가 있으면 Link로 렌더 (로그인 CTA 등), 없으면 Button onClick
  href?: string;
  onClick?: () => void;
  tone?: 'primary' | 'destructive';
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon?: ReactNode;
  iconTone?: 'primary' | 'success' | 'destructive';
  title: string;
  description?: string;
  primaryAction: ActionProps;
  secondaryAction?: { label: string; onClick?: () => void };
}

const ICON_TONE_CLS: Record<NonNullable<Props['iconTone']>, string> = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/15 text-success',
  destructive: 'bg-destructive/10 text-destructive',
};

export function ConfirmDialog({
  open,
  onOpenChange,
  icon,
  iconTone = 'primary',
  title,
  description,
  primaryAction,
  secondaryAction,
}: Props) {
  const primaryVariant =
    primaryAction.tone === 'destructive' ? 'destructive' : 'default';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 gap-0 rounded-3xl overflow-hidden">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        {description && (
          <DialogDescription className="sr-only">{description}</DialogDescription>
        )}

        <div className="px-6 pt-8 pb-6 flex flex-col items-center gap-6">
          {icon && (
            <div
              className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center',
                ICON_TONE_CLS[iconTone],
              )}
            >
              {icon}
            </div>
          )}
          <div className="text-center space-y-1.5">
            <p className="text-headline-3 text-foreground">{title}</p>
            {description && (
              <p className="text-body-2 text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="w-full flex flex-col gap-2.5">
            {primaryAction.href ? (
              <Button asChild variant={primaryVariant} className="w-full h-12 text-title-2 rounded-xl">
                <Link href={primaryAction.href}>{primaryAction.label}</Link>
              </Button>
            ) : (
              <Button
                variant={primaryVariant}
                className="w-full h-12 text-title-2 rounded-xl"
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="w-full h-12 text-title-2 rounded-xl text-muted-foreground"
                  onClick={secondaryAction.onClick}
                >
                  {secondaryAction.label}
                </Button>
              </DialogClose>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
