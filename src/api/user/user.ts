import type { MyProfileResponse } from '@/types/user';
import { authedFetch } from '@/network/server';

export function getMyProfile(): Promise<MyProfileResponse> {
  return authedFetch('/api/users/me');
}
