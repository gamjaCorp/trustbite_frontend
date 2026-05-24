'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';

interface Props extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> {
  value: string;
  onValueChange: (next: string) => void;
  className?: string;
}

// 검색 입력 필드 — 포커스 시 primary ring
export function SearchInput({ value, onValueChange, placeholder, className, ...rest }: Props) {
  return (
    <InputGroup
      className={cn(
        'h-10',
        'has-[[data-slot=input-group-control]:focus-visible]:border-primary',
        'has-[[data-slot=input-group-control]:focus-visible]:ring-primary/50',
        className,
      )}
    >
      <InputGroupAddon>
        <Search className="text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupInput
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        {...rest}
      />
    </InputGroup>
  );
}
