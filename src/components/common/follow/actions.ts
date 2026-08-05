'use server';

import { deleteFollow, postFollow } from '@/api/follow/follow';
import { revalidatePath } from 'next/cache';

export async function toggleFollow(targetUserId: number, isFollowing: boolean) {
  if (isFollowing) {
    await deleteFollow(targetUserId);
  } else {
    await postFollow(targetUserId);
  }
  revalidatePath('/profile');
  revalidatePath('/follow/me');
  revalidatePath(`/user/${targetUserId}`);
  revalidatePath(`/follow/${targetUserId}`);
}
