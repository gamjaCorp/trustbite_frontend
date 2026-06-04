// TODO: 1차 MVP 제외 — 백엔드 프로필 API 연동 시 교체 (현재 유저 레벨·신뢰도 점수 목 값)
import { getLevelDef, getNextLevelDef } from '@/lib/domain/grade-levels';
import type { GradeLevel } from '@/lib/domain/grade-levels';

export const CURRENT_LEVEL: GradeLevel = 3;
export const BASE_TRUST_SCORE = 72;
export const REMAINING_REVIEWS_FOR_NEXT_GRADE = 19;
export const CURRENT_GRADE_REVIEW_COUNT = 11;
export const CURRENT_GRADE_REVIEW_TARGET = getNextLevelDef(CURRENT_LEVEL)?.reviewMin ?? getLevelDef(CURRENT_LEVEL).reviewMin;
export const NEXT_GRADE_NAME = getNextLevelDef(CURRENT_LEVEL)?.label ?? '';
