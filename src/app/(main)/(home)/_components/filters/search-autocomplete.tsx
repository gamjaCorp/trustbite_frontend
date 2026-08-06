'use client';

import { useState } from 'react';
import { SearchInput, SearchInputItem } from '@/components/core/search-input';
import { RestaurantIdentityRow } from '@/components/common/restaurant/restaurant-identity-row';
import { RestaurantThumbnail } from '@/components/common/restaurant/restaurant-thumbnail';
import { synthesizeEntryFromSuggest } from '@/lib/mock/synthesize-restaurant';
import { useRankActions, useRankFocusedEntry, useRankQuery } from '../../_lib/region-rank-store';
import { useSearchSuggest, type SuggestItem } from '../../_hooks/use-search-suggest';

interface Props {
  className?: string;
}

// area(지역·역)와 keyword(가게·음식) 항목을 구분하기 위한 내부 값 타입
type SuggestValue =
  | { type: 'area'; label: string; center: { lat: number; lng: number } }
  | { type: 'keyword'; item: SuggestItem };

// 검색창 + 지역어 한 줄 힌트 / 가게 자동완성 드롭다운 통합 컴포넌트
export function SearchAutocomplete({ className }: Props) {
  const query = useRankQuery();
  const action = useRankActions();
  const focusedEntry = useRankFocusedEntry();
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

  // 항목 확정: area → 지도 이동(store가 pendingArea를 함께 초기화), keyword → focus 모드 진입
  function handleConfirm(value: SuggestValue) {
    if (value.type === 'area') {
      action.navigateToArea(value.center, value.label);
    } else {
      // keyword 확정: focus 모드 진입 — 그 가게 1개만 핀·행에 표시
      action.enterFocus(synthesizeEntryFromSuggest(value.item));
    }
    setDismissed(true);
  }

  const areaValue: SuggestValue | null =
    suggest.kind === 'area' ? { type: 'area', label: suggest.label, center: suggest.center } : null;

  const keywordValues: SuggestValue[] =
    suggest.kind === 'keyword' ? suggest.items.map((item) => ({ type: 'keyword', item })) : [];

  return (
    <SearchInput<SuggestValue>
      className={className}
      query={query}
      onQueryChange={(value) => {
        action.setQuery(value);
        // 타이핑 = 결과를 다시 보겠다는 의도 → 선택 후 닫힌 드롭다운 재오픈
        setDismissed(false);
      }}
      placeholder="맛집, 지역, 메뉴 검색"
      onClear={() => {
        action.resetSearch();
        setDismissed(true);
      }}
      open={open}
      onOpenChange={(next) => {
        if (!next) setDismissed(true);
      }}
      onSelect={handleConfirm}
      itemLabel={(value) => (value.type === 'keyword' ? value.item.name : value.label)}
      inputProps={{
        onFocus: () => {
          // 포커스 시 기존 결과가 있으면 다시 열기 (ESC 후 재포커스 대응)
          if (suggest.kind === 'area' || suggest.kind === 'keyword') setDismissed(false);
        },
        onKeyDown: (e) => {
          // focus 모드 중 ESC → resetSearch로 해제 (드롭다운이 닫혀 있어 popup이 ESC를 소비하지 않음)
          if (e.key === 'Escape' && focusedEntry) {
            e.preventDefault();
            action.resetSearch();
          }
        },
      }}
    >
      {/* 케이스 A: 지역·역·관광지 → 이동 힌트 단일 항목 */}
      {suggest.kind === 'area' && areaValue && (
        <SearchInputItem value={areaValue}>
          <span className="mr-1 text-primary" aria-hidden>
            ↵
          </span>
          <span className="text-label-3 text-muted-foreground">{suggest.label}로 이동</span>
        </SearchInputItem>
      )}

      {/* 케이스 B: 가게·음식 키워드 → 가게 목록 */}
      {suggest.kind === 'keyword' &&
        keywordValues.map((value) => {
          if (value.type !== 'keyword') return null;
          const { item } = value;
          return (
            <SearchInputItem key={item.id} value={value}>
              {/* 썸네일 — 이미지가 없으면 카테고리 아이콘 placeholder(텍스트 없음) */}
              <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                <RestaurantThumbnail
                  src=""
                  alt={item.name}
                  category={item.categoryType}
                  showLabel={false}
                  className="absolute inset-0"
                />
              </div>

              <RestaurantIdentityRow
                name={item.name}
                category={item.categoryType}
                subtitle={item.address}
                className="flex-1 text-left"
              />
            </SearchInputItem>
          );
        })}
    </SearchInput>
  );
}
