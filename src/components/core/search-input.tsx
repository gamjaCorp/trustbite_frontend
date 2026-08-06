'use client';

import type { ComponentProps, ReactNode } from 'react';
import { Combobox as BaseCombobox } from '@base-ui/react';
import { Search, X } from 'lucide-react';
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { cn } from '@/lib/utils';

type ComboboxInputProps = ComponentProps<typeof BaseCombobox.Input>;

export interface SearchInputProps<T> {
  query: string; // 입력창 텍스트 (controlled)
  onQueryChange: (query: string) => void; // 한글 조합 중인 음절까지 매 입력마다 호출된다
  placeholder: string;
  variant?: 'outline' | 'filled'; // 테두리형 / 채움형 — 크기는 동일
  onClear?: () => void; // 주면 query가 있을 때만 X 버튼 노출
  inputProps?: Omit<ComboboxInputProps, 'render' | 'onInput' | 'placeholder'>; // onFocus·onKeyDown 등 탈출구
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (value: T) => void;
  itemLabel: (value: T) => string; // 항목 확정 시 입력창에 채울 문자열
  listLabel?: string; // 목록 위 소제목
  children?: ReactNode; // SearchInputItem 목록
  className?: string;
}

const SIZE = 'h-11 rounded-xl';

const VARIANTS = {
  outline:
    'has-[[data-slot=input-group-control]:focus-visible]:border-primary has-[[data-slot=input-group-control]:focus-visible]:ring-primary/50',
  filled: 'border-transparent bg-muted shadow-none dark:bg-muted',
} as const;

// 검색 입력 + 자동완성 드롭다운 — 항목은 SearchInputItem으로 children에 넣는다
export function SearchInput<T>({
  query,
  onQueryChange,
  placeholder,
  variant = 'outline',
  onClear,
  inputProps,
  open,
  onOpenChange,
  onSelect,
  itemLabel,
  listLabel,
  children,
  className,
}: SearchInputProps<T>) {
  const anchorRef = useComboboxAnchor();

  return (
    <Combobox
      open={open}
      onOpenChange={onOpenChange}
      inputValue={query}
      onInputValueChange={(value: string, details: BaseCombobox.Root.ChangeEventDetails) => {
        if (details.reason !== 'input-change') return;
        onQueryChange(value);
      }}
      onValueChange={(value: unknown) => {
        if (value != null) onSelect(value as T);
      }}
      itemToStringLabel={itemLabel}
      autoHighlight
      modal={false}
    >
      <InputGroup ref={anchorRef} className={cn(SIZE, VARIANTS[variant], className)}>
        <InputGroupAddon>
          <Search className="text-muted-foreground" />
        </InputGroupAddon>

        <BaseCombobox.Input
          render={<InputGroupInput />}
          placeholder={placeholder}
          aria-label={placeholder}
          // 지우면 한글 조합 중인 마지막 글자가 누락된다
          onInput={(e: React.FormEvent<HTMLInputElement>) => onQueryChange(e.currentTarget.value)}
          {...inputProps}
        />

        {onClear && query && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              variant="ghost"
              aria-label="검색어 지우기"
              onClick={onClear}
            >
              <X className="pointer-events-none" />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>

      {open && (
        <ComboboxContent
          anchor={anchorRef}
          sideOffset={12}
          className="rounded-2xl bg-card p-2 shadow-card ring-border"
        >
          {listLabel && (
            <p className="mb-1 px-1 text-caption-2 text-muted-foreground">{listLabel}</p>
          )}
          <ComboboxList>{children}</ComboboxList>
        </ComboboxContent>
      )}
    </Combobox>
  );
}

// 드롭다운 항목 한 줄 — value가 그대로 SearchInput의 onSelect로 올라간다
export function SearchInputItem<T>({
  value,
  children,
  className,
}: {
  value: T;
  children: ReactNode;
  className?: string;
}) {
  return (
    <ComboboxItem value={value} className={cn('cursor-pointer gap-3 rounded-xl p-3', className)}>
      {children}
    </ComboboxItem>
  );
}
