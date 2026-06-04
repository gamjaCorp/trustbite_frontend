import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface SelectListItem {
  value: string;
  label: string;
}

interface Props {
  value: string;
  onValueChange: (next: string) => void;
  items: SelectListItem[];
  placeholder?: string;
  icon?: LucideIcon;
  align?: 'start' | 'center' | 'end';
  className?: string;
  disabled?: boolean;
}

// 드롭다운 선택 목록 — Select 프리미티브 래퍼
export function SelectList({
  value,
  onValueChange,
  items,
  placeholder,
  icon: Icon,
  align = 'end',
  className,
  disabled,
}: Props) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={cn('w-fit rounded-chip gap-2 shrink-0', className)}>
        {Icon ? <Icon className="w-4 h-4 text-muted-foreground" /> : null}
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent align={align}>
        {items.map((it) => (
          <SelectItem key={it.value} value={it.value}>
            {it.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
