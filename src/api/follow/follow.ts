import { authedFetch } from '@/network/server';
import { PageResponse } from '@/types/common';
import { FollowedUser } from '@/types/follow';

export function postFollow(userId: number) {
  return authedFetch(`/api/users/${userId}/followers`, {
    method: 'POST',
  });
}

export function DeleteFollow(userId: number) {
  return authedFetch(`/api/users/${userId}/followers`, {
    method: 'DELETE',
  });
}

export function getFollowings(userId: number): Promise<PageResponse<FollowedUser>> {
  return authedFetch(`/api/users/${userId}/following`);
}

export function getFollowers(userId: number): Promise<PageResponse<FollowedUser>> {
  return authedFetch(`/api/users/${userId}/followers`);
}
