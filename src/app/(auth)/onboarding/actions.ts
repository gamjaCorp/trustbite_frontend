'use server';

import { unstable_update } from '@/auth';
import { authedFetch } from '@/network/server';

export async function completeOnboarding(nickname: string, picture?: string) {
  await authedFetch('/api/users/me/onboarding', {
    method: 'PATCH',
    body: JSON.stringify({ nickname, picture }),
  });
  await unstable_update({ needsOnboarding: false, user: { name: nickname } });
}
