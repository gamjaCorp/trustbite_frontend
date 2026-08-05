import { authedFetch } from '@/network/server';
import { RatingRequest, RatingResponse } from '@/types/rating';

export function postRating(rating: RatingRequest): Promise<RatingResponse> {
  return authedFetch('/api/ratings', {
    method: 'POST',
    body: JSON.stringify(rating),
  });
}
