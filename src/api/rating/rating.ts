import { authedFetch } from '@/network/server';
import type { PageResponse } from '@/types/common';
import { RatingRequest, RatingResponse, UserRatingResponse } from '@/types/rating';

export function postRating(rating: RatingRequest): Promise<RatingResponse> {
  return authedFetch('/api/ratings', {
    method: 'POST',
    body: JSON.stringify(rating),
  });
}

// 특정 유저가 쓴 후기 목록 (page는 0-base)
// API_SPEC은 "인증 불필요"라 적혀 있으나 SecurityConfig permitAll에 /api/ratings/**가 없어 실제로는 인증 필요
// 정렬 파라미터는 백엔드가 무시한다 (PageRequest.of(page, size)) — 정렬은 화면에서 처리
export function getUserRatings(
  userId: number,
  page = 0,
  size = 20,
): Promise<PageResponse<UserRatingResponse>> {
  return authedFetch(`/api/ratings/user/${userId}?page=${page}&size=${size}`);
}
