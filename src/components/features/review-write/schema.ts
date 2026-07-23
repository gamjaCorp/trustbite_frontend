import { z } from 'zod';

// 리뷰 작성 폼 검증 schema — 제출 게이트(useReviewIsValid)의 단일 출처
export const RATING_MAX = 5;
export const PHOTO_MAX = 4;

// 별점은 0.5점 단위 — 0보다 크면(=한 번이라도 매겼으면) 통과
const ratingField = z
  .number()
  .gt(0, '평점을 매겨주세요')
  .max(RATING_MAX, `평점은 ${RATING_MAX}점까지 가능해요`);

export const reviewSchema = z.object({
  restaurantId: z.string().min(1, '가게를 선택해주세요'),
  taste: ratingField,
  value: ratingField,
  vibe: ratingField,
  text: z.string(), // 텍스트는 제출 필수 아님 — 100자 이상은 신뢰도 보너스(LONG_TEXT_THRESHOLD) 기준일 뿐
  photos: z // 사진은 선택(0~4장). 첨부 시 최대 4장
    .array(z.object({ previewUrl: z.string() }))
    .max(PHOTO_MAX, `사진은 최대 ${PHOTO_MAX}장까지 첨부할 수 있어요`),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
