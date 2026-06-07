import { GoogleSessionResponse } from '@/lib/types/auth/response';
import { publicFetch } from '@/network/server';

export function postGoogleSession(idToken: string): Promise<GoogleSessionResponse> {
  return publicFetch('/api/auth/session/google', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  });
}

export function postRefreshToken(refreshToken: string): Promise<GoogleSessionResponse> {
  return publicFetch('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}
