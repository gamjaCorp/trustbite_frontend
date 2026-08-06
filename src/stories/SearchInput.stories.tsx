'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import {
  SearchInput,
  SearchInputItem,
  type SearchInputProps,
} from '@/components/core/search-input';

interface Place {
  id: string;
  name: string;
  address: string;
}

const PLACES: Place[] = [
  { id: '1', name: '을지로 골뱅이', address: '서울 중구 을지로 12길' },
  { id: '2', name: '연남동 소금집', address: '서울 마포구 연남로 21' },
  { id: '3', name: '성수 대림창고', address: '서울 성동구 성수이로 78' },
];

const meta = {
  title: 'Core/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '검색 입력 + 자동완성 드롭다운 껍데기. base-ui Combobox를 감싸 화살표·Enter·ESC 키보드 조작과 한글 조합 입력을 처리한다. 호출부는 데이터 조회와 항목 JSX만 맡는다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    query: { control: false, description: '입력창 텍스트 — 항상 controlled로 쓴다' },
    onQueryChange: {
      control: false,
      description: '조합 중인 한글 음절까지 포함해 매 입력마다 호출된다',
    },
    placeholder: { control: 'text', description: '입력창 안내 문구 — aria-label 기본값도 겸한다' },
    variant: {
      control: 'inline-radio',
      options: ['outline', 'filled'],
      description: '테두리형 outline / 채움형 filled — 높이·radius는 동일',
    },
    onClear: { control: false, description: '주면 query가 있을 때만 X 지우기 버튼이 노출된다' },
    inputProps: {
      control: false,
      description:
        'onFocus·onKeyDown·aria-label 등 입력 필드 탈출구 (render·onInput·placeholder는 제외)',
    },
    open: {
      control: false,
      description: '드롭다운 열림 상태 — 결과 유무·닫힘 정책은 호출부가 정한다',
    },
    onOpenChange: { control: false, description: 'ESC·바깥 클릭으로 닫힐 때 호출' },
    onSelect: {
      control: false,
      description: '항목 확정 — SearchInputItem의 value가 그대로 올라온다',
    },
    itemLabel: { control: false, description: '확정된 항목을 입력창에 채울 문자열로 바꾼다' },
    listLabel: { control: 'text', description: '목록 위 소제목 — 없으면 렌더하지 않는다' },
    children: {
      control: false,
      description: 'SearchInputItem 목록 — 로딩·빈 상태 문구도 여기에 직접 넣는다',
    },
  },
  // 제네릭 컴포넌트라 typeof SearchInput으로는 T가 unknown으로 풀린다 — props 타입으로 직접 고정
} satisfies Meta<SearchInputProps<Place>>;

export default meta;
type Story = StoryObj<SearchInputProps<Place>>;

const BASE_ARGS: SearchInputProps<Place> = {
  query: '',
  onQueryChange: () => undefined,
  placeholder: '음식점 이름 또는 지역을 검색해주세요',
  open: false,
  onOpenChange: () => undefined,
  onSelect: () => undefined,
  itemLabel: (place) => place.name,
};

function Demo({
  variant,
  listLabel,
  withClear = true,
}: {
  variant?: 'outline' | 'filled';
  listLabel?: string;
  withClear?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [dismissed, setDismissed] = useState(false);
  const [picked, setPicked] = useState<Place | null>(null);

  const results = PLACES.filter((p) => p.name.includes(query.trim()));
  const open = !dismissed && query.trim().length > 0;

  return (
    <div className="max-w-md space-y-3">
      <SearchInput<Place>
        variant={variant}
        query={query}
        onQueryChange={(value) => {
          setQuery(value);
          setDismissed(false);
        }}
        placeholder="음식점 이름 또는 지역을 검색해주세요"
        onClear={withClear ? () => setQuery('') : undefined}
        open={open}
        onOpenChange={(next) => {
          if (!next) setDismissed(true);
        }}
        onSelect={(place) => {
          setPicked(place);
          setDismissed(true);
        }}
        itemLabel={(place) => place.name}
        listLabel={listLabel}
      >
        {results.length === 0 ? (
          <p className="px-3 py-6 text-center text-body-2 text-muted-foreground">
            검색 결과가 없어요
          </p>
        ) : (
          results.map((place) => (
            <SearchInputItem key={place.id} value={place}>
              <div className="size-10 shrink-0 rounded-lg bg-muted" />
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-label-2 truncate">{place.name}</span>
                <span className="text-caption-2 text-muted-foreground truncate">
                  {place.address}
                </span>
              </div>
            </SearchInputItem>
          ))
        )}
      </SearchInput>

      <p className="text-caption-2 text-muted-foreground">선택: {picked ? picked.name : '없음'}</p>
    </div>
  );
}

export const Outline: Story = {
  parameters: { docs: { description: { story: '단독 배치 (홈 검색창)' } } },
  args: BASE_ARGS,
  render: () => <Demo variant="outline" />,
};

export const Filled: Story = {
  parameters: { docs: { description: { story: '채움형 (리뷰 작성)' } } },
  args: BASE_ARGS,
  render: () => <Demo variant="filled" listLabel="검색 결과" withClear={false} />,
};

export const StatusText: Story = {
  name: 'StatusText',
  parameters: { docs: { description: { story: '로딩·빈 상태 (children으로 직접)' } } },
  args: BASE_ARGS,
  render: () => (
    <div className="max-w-md">
      <SearchInput<Place> {...BASE_ARGS} query="을지로" open listLabel="검색 결과">
        <p className="px-3 py-6 text-center text-body-2 text-muted-foreground">검색 중이에요...</p>
      </SearchInput>
    </div>
  ),
};
