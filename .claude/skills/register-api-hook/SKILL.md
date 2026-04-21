---
name: Register API Hook
description: Triggered when the user's message contains "API" or "api" — e.g. "API 등록", "API 함수 추가", "API 훅 만들어줘", "register API". Do NOT trigger on generic hook requests without the API keyword.
version: 0.1.0
---

# Backend API 등록 & React Query Hook 생성

백엔드 엔드포인트를 받아서 이 레포의 컨벤션에 맞게 (1) `src/api/<feature>/<feature>.ts` 에 axios 래퍼 함수를 등록하고, (2) GET이면 `useQuery` 훅, POST/PATCH/PUT/DELETE면 `useMutation` 훅을 `src/hooks/<feature>/` 에 생성한다. 함수명은 요청 이름(PascalCase verb-first) 과 반드시 일치시킨다.

## When to apply

- 사용자가 백엔드 스펙(메서드 + 경로 + 파라미터/바디/응답)을 제시하며 "등록", "추가", "훅 만들어줘", "연결" 을 요청할 때 적용한다.
- GET 요청 → `src/api/<feature>/<feature>.ts` 의 axios 함수 + `src/hooks/<feature>/use-<entity>.ts` (useQuery) 를 생성.
- 비-GET(POST/PATCH/PUT/DELETE) → axios 함수 + `src/hooks/<feature>/use-<action>-<entity>.ts` (useMutation) 를 생성.
- 단순 axios 호출만 필요하고 훅이 불필요하다고 사용자가 명시할 때는 API 함수만 생성한다.
- 이미 존재하는 API 함수/훅을 수정하는 요청에도 동일한 규칙을 적용한다.

## Input the user provides

다음 정보를 모두 확보한 뒤 작업한다. 빠진 항목은 스킬이 먼저 물어본다.

1. **HTTP 메서드**: GET / POST / PATCH / PUT / DELETE
2. **경로**: 예) `/restaurants/{restaurantId}/reviews`
3. **Path 파라미터**: 있으면 이름/타입
4. **Query 파라미터**: 있으면 이름/타입/선택여부
5. **요청 바디(Request)**: POST/PATCH/PUT 인 경우 필드 스키마
6. **응답(Response)**: 주요 필드 스키마 (페이지네이션이면 `content` + pageable 필드 포함)
7. **함수명**: 백엔드 요청 이름과 동일하게. 모르면 경로+메서드에서 verb-first로 제안
8. **피처명(`<feature>`)**: 예) `restaurants`, `reviews`, `auth`. 모르면 사용자에게 확인
9. **(선택) 스펙 번호/한국어 설명**: 있으면 함수 위 주석에 추가

## Output files

항상 확인/생성/수정하는 파일:

1. `src/api/<feature>/<feature>.ts` — 기존 파일이면 함수 append, 없으면 새 파일
2. `src/hooks/<feature>/use-<...>.ts` — 훅 신규 생성
3. (필요 시) `src/lib/types/<feature>/{request.ts,response.ts,type.ts}` — 재사용 가능한 타입이 없을 때만 추가

## Canonical templates

### 1) GET — API 함수 + useQuery 훅

**API 함수** (`src/api/restaurants/restaurants.ts` 에 append)

```ts
import axios from '@/lib/axios';

// 레스토랑 상세 조회
export function GetRestaurantDetail(params: { restaurantId: string }) {
  return axios.get('/restaurants/details', { params });
}
```

**useQuery 훅** (`src/hooks/restaurants/use-restaurant-detail.ts`)

```ts
import { GetRestaurantDetail } from '@/api/restaurants/restaurants';
import { useQuery } from '@tanstack/react-query';

export function useRestaurantDetail({ restaurantId }: { restaurantId?: string }) {
  const {
    data: restaurantDetailData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['restaurants', 'detail', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return null;
      const response = await GetRestaurantDetail({ restaurantId });
      return response?.data?.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    enabled: !!restaurantId,
  });

  return {
    restaurantDetailData,
    isLoading,
    isError,
    error,
  };
}
```

**리스트/페이지네이션 변형** — `content` / pageable 가공은 아래 패턴을 따른다.

```ts
import { GetRestaurantList } from '@/api/restaurants/restaurants';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

interface UseRestaurantListProps {
  currentPage?: number;
  sortOrder?: string;
  keyword?: string;
  active?: boolean;
  size?: number;
}

export function useRestaurantList({ currentPage = 0, sortOrder = '', keyword = '', active, size = 10 }: UseRestaurantListProps) {
  const { data: restaurantData, isError, error, isPending } = useQuery({
    queryKey: ['restaurants', 'list', currentPage, sortOrder, keyword, active],
    queryFn: async () => {
      const response = await GetRestaurantList({
        page: currentPage,
        size,
        sort: sortOrder,
        ...(keyword ? { keyword } : {}),
        ...(active !== undefined ? { active } : {}),
      });
      const data = response?.data?.data;
      return {
        restaurantList: data?.content || [],
        pageableInfo: {
          pageNumber: data?.number || 0,
          pageSize: data?.size || 10,
          totalElements: data?.totalElements || 0,
          totalPages: data?.totalPages || 0,
          first: data?.first ?? true,
          last: data?.last ?? true,
        },
      };
    },
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });

  return { restaurantData, isError, error: error as any, isPending };
}
```

### 2) POST/PATCH/PUT/DELETE — API 함수 + useMutation 훅

**API 함수** (`src/api/reviews/reviews.ts` 에 append)

```ts
import axios from '@/lib/axios';
import { ReviewRequest } from '@/lib/types/reviews/request';

// 리뷰 생성
export function CreateReview(data: ReviewRequest) {
  return axios.post('/reviews', data);
}

// 리뷰 수정
export function UpdateReview(reviewId: string, data: ReviewRequest) {
  return axios.patch(`/reviews/${reviewId}`, data);
}

// 리뷰 삭제
export function DeleteReview(reviewId: string) {
  return axios.delete(`/reviews/${reviewId}`);
}
```

**useMutation 훅 (생성)** (`src/hooks/reviews/use-create-review.ts`)

```ts
import { CreateReview } from '@/api/reviews/reviews';
import { ReviewRequest } from '@/lib/types/reviews/request';
import { toast } from '@/components/ui/sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateReview() {
  const queryClient = useQueryClient();

  const {
    mutate: createReview,
    isPending: isCreateReviewPending,
    isError: isCreateReviewError,
    error: createReviewError,
  } = useMutation({
    mutationFn: async (review: ReviewRequest) => {
      const response = await CreateReview(review);
      return response?.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({
        title: '리뷰 생성이 완료되었습니다.',
        variant: 'success',
      });
    },
  });

  return {
    createReview,
    isCreateReviewPending,
    isCreateReviewError,
    createReviewError,
  };
}
```

**useMutation 훅 (path param + body 조합)**

```ts
mutationFn: async ({ reviewId, data }: { reviewId: string; data: ReviewRequest }) => {
  const response = await UpdateReview(reviewId, data);
  return response?.data?.data;
},
```

**useMutation 훅 (검증/특수 — 로컬 state + onError)**

```ts
import { CheckValidateReview } from '@/api/reviews/reviews';
import { CreateReviewDataType } from '@/lib/types/reviews/type';
import { toast } from '@/components/ui/sonner';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export function useCheckValidateReview() {
  const [isValidate, setIsValidate] = useState(false);
  const [isValidateError, setIsValidateError] = useState(false);

  const {
    mutate: checkValidateReview,
    isPending: isCheckValidateReviewPending,
    isError: isCheckValidateReviewError,
    error: checkValidateReviewError,
  } = useMutation({
    mutationFn: async (data: CreateReviewDataType) => {
      const response = await CheckValidateReview(data);
      return response?.data?.data;
    },
    onSuccess: (data: any) => {
      if (data === true) {
        setIsValidate(true);
        setIsValidateError(false);
      } else {
        setIsValidate(false);
        setIsValidateError(true);
      }
    },
    onError: (error: any) => {
      setIsValidateError(true);
      setIsValidate(false);
      toast({
        variant: 'error',
        title: `${error?.response?.data?.message}. 잠시후 다시 시도해주세요.`,
      });
    },
  });

  return {
    checkValidateReview,
    isCheckValidateReviewPending,
    isCheckValidateReviewError,
    checkValidateReviewError,
    isValidate,
    isValidateError,
  };
}
```

## Naming rules

### API 함수 (PascalCase, verb-first)

| 메서드 | 패턴 | 예시 |
| --- | --- | --- |
| GET (단건) | `Get<Entity>Detail` / `Get<Entity>` | `GetRestaurantDetail`, `GetReviewSummary` |
| GET (목록) | `Get<Entity>List` | `GetRestaurantList`, `GetReviewList` |
| POST (생성) | `Create<Entity>` 또는 도메인 동사 | `CreateReview`, `PostOAuth2Token`, `CheckValidateReview` |
| PATCH/PUT | `Update<Entity>` / `Patch<Entity>` | `UpdateReview`, `UpdateRestaurantActive` |
| DELETE | `Delete<Entity>` | `DeleteReview` |

- 백엔드 스펙에 명시된 요청 이름이 있으면 그 이름을 **그대로** 사용한다. (케이스 통일 목적의 사소한 변경은 허용)

### 훅 파일명 & 훅명

| 종류 | 파일명(kebab-case) | export 이름(camelCase) |
| --- | --- | --- |
| useQuery | `use-<entity>.ts`, `use-<entity>-list.ts`, `use-<entity>-detail.ts` | `useRestaurantList`, `useReviewDetail` |
| useMutation | `use-<action>-<entity>.ts` | `useCreateReview`, `useUpdateReview`, `useDeleteReview`, `useCheckValidateReview` |

- 훅은 **named export**. 기본 export 금지.

### Mutation 반환 키 매트릭스 (엄격)

액션 이름이 `createReview` 이면:

| useMutation key | return key |
| --- | --- |
| `mutate` | `createReview` |
| `isPending` | `isCreateReviewPending` |
| `isError` | `isCreateReviewError` |
| `error` | `createReviewError` |

### Query 반환 키

- 데이터: `<entity>Data` (예: `reviewDetailData`, `restaurantData`)
- 상태: `isLoading` 또는 `isPending`, `isError`, `error`

## Rules

- **함수명은 요청 이름과 동일하게.** verb-first PascalCase. 임의 변형 금지.
- **API 함수는 raw axios promise를 return 한다.** `res.data` 언래핑은 함수 내부에서 하지 않는다. 언래핑은 훅의 `queryFn` / `mutationFn` 에서 `response?.data?.data` 로 수행한다.
- axios 임포트는 `import axios from '@/lib/axios';` 한 곳만 사용한다.
- `src/api/<feature>/<feature>.ts` 파일이 이미 있으면 **append** 하고, 인근 스펙 번호/관련 함수 곁에 배치한다. 새 파일은 기존이 없을 때만 생성한다.
- `queryKey` 는 **배열**이며 `['<feature>', '<entity>', '<action>', ...deps]` 처럼 hierarchical 하게 구성한다. 문자열 단일 키는 피한다.
- useQuery 기본 옵션: `refetchOnWindowFocus: false`, `staleTime: 1000 * 60 * 5`, `gcTime: 1000 * 60 * 5`. 조건부 실행은 `enabled: !!param` 과 내부 `if (!param) return null;` 를 모두 사용한다.
- 리스트 훅은 `content` + `pageableInfo` 로 가공해 반환하고 `placeholderData: keepPreviousData` 를 설정한다.
- useMutation 은 **반드시** `useQueryClient` 를 받아 `onSuccess` 에서 관련 queryKey 를 `invalidateQueries` 한다. 필요 시 `removeQueries` 도 사용한다.
- useMutation 의 `onSuccess` 에는 한국어 성공 toast 를 추가한다: `toast({ title: '<엔티티> <동작>이 완료되었습니다.', variant: 'success' });`
- toast import 는 `import { toast } from '@/components/ui/sonner';` 한 곳만 사용한다.
- 검증/특수 mutation은 `useState` 로 로컬 플래그를 관리하고 `onError` 에서 `error?.response?.data?.message` 를 토스트로 노출한다.
- 훅은 **named export**. 파일명/폴더는 kebab-case.
- Request/Response 타입은 `src/lib/types/<feature>/{request,response,type}.ts` 에 둔다. 기존 타입이 있으면 import 재사용, 없으면 추가한다. `any` 는 명시적으로 허용된 경우 외에는 지양한다.
- 확장자는 `.ts` (훅/ API). `.tsx` 는 JSX 가 필요한 경우에만.
