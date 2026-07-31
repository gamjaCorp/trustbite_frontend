import type { MyProfileResponse, UserProfile } from '@/types/user';
import { authedFetch, publicFetch } from '@/network/server';

export function getMyProfile(): Promise<MyProfileResponse> {
  return authedFetch('/api/users/me');
}

export function getUserProfile(userId: number): Promise<UserProfile> {
  return publicFetch(`/api/users/${userId}`, { next: { revalidate: 60 } });
}
