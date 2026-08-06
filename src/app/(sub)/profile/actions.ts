'use server';

import { authedFetch } from '@/network/server';
import { revalidatePath } from 'next/cache';

export async function updateMyProfile(nickname: string, picture?: string) {
  await authedFetch('/api/users/me', {
    method: 'PATCH',
    body: JSON.stringify({ nickname, picture }),
  });
  revalidatePath('/profile');
}
