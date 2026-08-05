'use server';

import { postRating } from '@/api/rating/rating';
import { RatingRequest, RatingResponse } from '@/types/rating';

export async function submitReview(rating: RatingRequest): Promise<RatingResponse> {
  return postRating(rating);
}
