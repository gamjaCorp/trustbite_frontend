'use client';

import { useState } from 'react';
import { Combobox as BaseCombobox } from '@base-ui/react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { useRankActions, useRankQuery } from '@/stores/region-rank-store';
import { useSearchSuggest, type SuggestItem } from './hooks/use-search-suggest';

interface Props {
  onAreaConfirm?: () => void; // area 확정(Enter/클릭)으로 지도가 이동할 때 부모의 pendingArea 초기화용
  className?: string;
}

// area(지역·역)와 keyword(가게·음식) 항목을 구분하기 위한 내부 값 타입
type SuggestValue =
  | { type: 'area'; label: string; center: { lat: number; lng: number } }
  | { type: 'keyword'; item: SuggestItem };

// 검색창 + 지역어 한 줄 힌트 / 가게 자동완성 드롭다운 통합 컴포넌트
export function SearchAutocomplete({ onAreaConfirm, className }: Props) {
  const query = useRankQuery();
  const action = useRankActions();
  const suggest = useSearchSuggest(query);

  // 사용자가 ESC / 바깥 클릭으로 명시적으로 닫은 상태 추적
  const [dismissed, setDismissed] = useState(false);

  // suggest 결과가 새로 바뀌면 dismissal 초기화 — render-phase derived state 패턴
  const [prevSuggestKind, setPrevSuggestKind] = useState(suggest.kind);
  if (suggest.kind !== prevSuggestKind) {
    setPrevSuggestKind(suggest.kind);
    if (suggest.kind === 'area' || suggest.kind === 'keyword') {
      setDismissed(false); // 새 결과 = 다시 열림
    }
  }

  // 결과가 있고 사용자가 닫지 않은 경우에만 드롭다운 열림
  const open = !dismissed && (suggest.kind === 'area' || suggest.kind === 'keyword');

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) setDismissed(true);
  }

  // 항목 확정: area → 지도 이동, keyword → 목록 키워드 필터
  function handleConfirm(value: SuggestValue) {
    if (value.type === 'area') {
      action.navigateToArea(value.center, value.label);
      onAreaConfirm?.();
    } else {
      // keyword 확정: 입력창에 가게명, 키워드 필터로 목록 갱신
      // TODO: 1차 MVP 제외 — focus 모드(핀 1개·1행) 진입, 다음 task(line 72)에서 구현
      action.setQuery(value.item.name);
      action.setResolvedKeyword({ query: value.item.name, keyword: value.item.name });
    }
    setDismissed(true);
  }

  const areaValue: SuggestValue | null =
    suggest.kind === 'area'
      ? { type: 'area', label: suggest.label, center: suggest.center }
      : null;

  const keywordValues: SuggestValue[] =
    suggest.kind === 'keyword'
      ? suggest.items.map((item) => ({ type: 'keyword', item }))
      : [];

  return (
    // Combobox = BaseCombobox.Root (ui/combobox.tsx 재수출)
    <Combobox
      open={open}
      onOpenChange={handleOpenChange}
      inputValue={query}
      onInputValueChange={(v: string) => action.setQuery(v)}
      onValueChange={(val: unknown) => {
        if (val) handleConfirm(val as SuggestValue);
      }}
      autoHighlight
      modal={false}
    >
      <InputGroup
        className={cn(
          'h-10',
          'has-[[data-slot=input-group-control]:focus-visible]:border-primary',
          'has-[[data-slot=input-group-control]:focus-visible]:ring-primary/50',
          className,
        )}
      >
        {/* 왼쪽 검색 아이콘 */}
        <InputGroupAddon>
          <Search className="text-muted-foreground" />
        </InputGroupAddon>

        {/* 검색 입력 필드 — base-ui Input이 InputGroupInput을 렌더 대상으로 사용 */}
        <BaseCombobox.Input
          render={<InputGroupInput />}
          placeholder="맛집, 지역, 메뉴 검색"
          onFocus={() => {
            // 포커스 시 기존 결과가 있으면 다시 열기 (ESC 후 재포커스 대응)
            if (suggest.kind === 'area' || suggest.kind === 'keyword') setDismissed(false);
          }}
        />

        {/* 오른쪽 X(지우기) 버튼 — 입력이 있을 때만 표시 */}
        {query && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              variant="ghost"
              aria-label="검색어 지우기"
              onClick={() => {
                action.resetSearch();
                setDismissed(true);
              }}
            >
              <X className="pointer-events-none" />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>

      {/* 드롭다운 — area 케이스: 한 줄 이동 힌트, keyword 케이스: 가게 목록 */}
      {open && (
        <ComboboxContent>
          <ComboboxList>
            {/* 케이스 A: 지역·역·관광지 → 이동 힌트 단일 항목 */}
            {suggest.kind === 'area' && areaValue && (
              <ComboboxItem value={areaValue}>
                <span className="text-primary mr-1" aria-hidden>↵</span>
                <span className="text-label-3 text-muted-foreground">
                  {suggest.label}로 이동
                </span>
              </ComboboxItem>
            )}

            {/* 케이스 B: 가게·음식 키워드 → 가게 목록 */}
            {suggest.kind === 'keyword' &&
              keywordValues.map((v) => {
                if (v.type !== 'keyword') return null;
                const { item } = v;
                return (
                  <ComboboxItem key={item.id} value={v}>
                    <div className="flex flex-col min-w-0 gap-0.5">
                      <span className="text-label-2 truncate">{item.name}</span>
                      <span className="text-caption-2 text-muted-foreground truncate">
                        {item.address}
                        {item.category ? ` · ${item.category}` : ''}
                      </span>
                    </div>
                  </ComboboxItem>
                );
              })}
          </ComboboxList>
        </ComboboxContent>
      )}
    </Combobox>
  );
}
