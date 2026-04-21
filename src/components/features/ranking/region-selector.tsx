'use client';

import { useState } from 'react';
import { ChevronDown, MapPin, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface RegionOption {
  name: string;
  count: number;
}

interface Props {
  regions: RegionOption[];
  value: string | 'all';
  onChange: (v: string | 'all') => void;
}

export function RegionSelector({ regions, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredRegions = regions.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()),
  );

  const isSelected = value !== 'all';

  function handleSelect(v: string | 'all') {
    onChange(v);
    setOpen(false);
    setSearch('');
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange('all');
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'flex items-center gap-1.5 rounded-chip px-3 py-1.5 text-xs font-medium transition-colors shrink-0',
            isSelected
              ? 'bg-primary/10 text-primary border border-primary/30'
              : 'bg-muted text-muted-foreground hover:text-foreground',
          )}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{isSelected ? value : '전체 지역'}</span>
          {isSelected ? (
            <X className="w-3 h-3 ml-0.5" onClick={handleClear} />
          ) : (
            <ChevronDown className="w-3 h-3 ml-0.5" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-56 p-0" align="start">
        {/* 검색 */}
        <div className="p-2 border-b border-border">
          <Input
            placeholder="지역 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-xs"
            autoFocus
          />
        </div>

        {/* 목록 */}
        <div className="max-h-60 overflow-y-auto py-1">
          {/* 전체 */}
          {search === '' && (
            <button
              onClick={() => handleSelect('all')}
              className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted/60 transition-colors"
            >
              <span className={cn('font-medium', value === 'all' && 'text-primary')}>전체</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {regions.reduce((s, r) => s + r.count, 0)}곳
                </span>
                {value === 'all' && <Check className="w-3.5 h-3.5 text-primary" />}
              </div>
            </button>
          )}

          {/* 지역 목록 */}
          {filteredRegions.length === 0 ? (
            <p className="px-3 py-4 text-xs text-center text-muted-foreground">
              검색 결과가 없어요
            </p>
          ) : (
            filteredRegions.map((r) => (
              <button
                key={r.name}
                onClick={() => handleSelect(r.name)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted/60 transition-colors"
              >
                <span className={cn(value === r.name && 'text-primary font-medium')}>
                  {r.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{r.count}곳</span>
                  {value === r.name && <Check className="w-3.5 h-3.5 text-primary" />}
                </div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
