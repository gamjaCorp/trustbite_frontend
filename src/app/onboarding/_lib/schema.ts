import { z } from 'zod';
import { NICKNAME_MIN, NICKNAME_MAX } from '@/lib/domain/profile';

// 온보딩 닉네임·프로필 사진 검증 schema
export { NICKNAME_MIN, NICKNAME_MAX };

export const onboardingSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(NICKNAME_MIN, `닉네임은 ${NICKNAME_MIN}자 이상이어야 해요`)
    .max(NICKNAME_MAX, `닉네임은 ${NICKNAME_MAX}자까지 가능해요`),
  // 저장은 W4 연동 시 처리 — 클라이언트에서만 File이 존재하므로 SSR-safe custom 검증 사용
  avatar: z
    .custom<File>((v) => typeof File !== 'undefined' && v instanceof File)
    .optional(),
});

export type OnboardingValues = z.infer<typeof onboardingSchema>;
