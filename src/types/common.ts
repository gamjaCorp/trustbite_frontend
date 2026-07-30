interface SortState {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}

interface Pageable {
  offset: number;
  sort: SortState;
  pageNumber: number; // 0-base
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

// 백엔드 Page(Spring Data) 응답 공통 포맷 — 페이지네이션이 필요한 목록 API가 공유
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // 현재 페이지 번호 (0-base)
  sort: SortState;
  pageable: Pageable;
  numberOfElements: number; // 현재 페이지에 실제로 담긴 원소 수
  first: boolean;
  last: boolean;
  empty: boolean;
}
