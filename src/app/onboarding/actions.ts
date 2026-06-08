'use server';

import { unstable_update } from '@/auth';
import { authedFetch } from '@/network/server';
import { redirect } from 'next/navigation';

export async function completeOnboarding(nickname: string) {
  await authedFetch('/api/users/me/onboarding', {
    method: 'PATCH',
    body: JSON.stringify({ nickname }),
  });
  await unstable_update({ needsOnboarding: false, user: { name: nickname } });
}
