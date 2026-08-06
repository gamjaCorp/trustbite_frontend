/* shadcn 원본에서 수정한 파일 — `npx shadcn add` 로 덮어써지면 아래를 복원할 것
 * 1. radius: rounded-md → rounded-xl (사이즈별 스케일). 2. 타이포: text-sm font-medium → text-title-*
 * 3. 높이 사다리 32/36/40/44. 4. disabled: opacity → 색 교체(로딩 중 제외). 5. loading prop + Spinner */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

const buttonVariants = cva(
  "press-scale relative inline-flex shrink-0 items-center justify-center gap-2 rounded-xl text-title-3 whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:not-data-loading:border-transparent disabled:not-data-loading:bg-muted disabled:not-data-loading:text-muted-foreground disabled:not-data-loading:shadow-none aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        // 배경이 없는 두 variant는 색 교체 대신 텍스트만 죽인다 — 없던 회색 박스가 생기지 않도록
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 disabled:not-data-loading:bg-transparent',
        link: 'text-primary underline-offset-4 hover:underline disabled:not-data-loading:bg-transparent',
      },
      size: {
        default: 'h-10 rounded-lg px-4 text-title-2 has-[>svg]:px-3',
        xs: "h-8 gap-1 rounded-md px-3 text-label-3 has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-9 gap-1.5 rounded-lg px-3.5 text-title-3 has-[>svg]:px-3',
        lg: 'h-11 px-4 text-title-1 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-xs': "size-6 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8 rounded-lg',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const SPINNER_SIZE: Record<NonNullable<VariantProps<typeof buttonVariants>['size']>, string> = {
  default: 'size-4',
  xs: 'size-3',
  sm: 'size-4',
  lg: 'size-5', // 16px 텍스트에 맞춰 한 단계 키운다
  icon: 'size-4',
  'icon-xs': 'size-3',
  'icon-sm': 'size-4',
  'icon-lg': 'size-4',
};

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean; // 클릭이 막히고 너비를 유지한 채 스피너만 보인다. asChild와 함께 쓰면 무시된다
  };

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';
  const isLoading = !asChild && loading;

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={isLoading || undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="absolute inset-0 inline-flex items-center justify-center">
            <Spinner className={SPINNER_SIZE[size ?? 'default']} />
          </span>
          <span aria-hidden className="invisible inline-flex items-center gap-2">
            {children}
          </span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
