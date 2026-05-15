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

export function SearchInput({ value, onValueChange, placeholder, className, ...rest }: Props) {
  return (
    <InputGroup className={cn('h-9', className)}>
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
