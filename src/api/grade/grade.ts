import { authedFetch } from '@/network/server';
import type { Grade } from '@/types/grade.ts';

export function getGrades(): Promise<Grade[]> {
  return authedFetch('/api/grades');
}
