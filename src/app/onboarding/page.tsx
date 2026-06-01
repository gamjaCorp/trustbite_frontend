'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Camera } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CutleryRain } from '@/components/features/auth/index';
import { useAuthStatus } from '@/hooks/use-auth-status';
import { cn } from '@/lib/utils';

const NICKNAME_MIN = 2;
const NICKNAME_MAX = 12;

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuthStatus();

  // 닉네임: 직접 입력하면 그 값을, 아직 안 건드렸으면 구글 이름으로 파생
  const [nickname, setNickname] = useState<string | undefined>(undefined);
  const displayNickname = nickname ?? user?.name ?? '';

  // 아바타: 사용자가 직접 고른 파일이 있으면 우선, 없으면 구글 기본 이미지
  const [draftAvatarUrl, setDraftAvatarUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingBlobRef = useRef<string | undefined>(undefined);

  const revokePending = useCallback(() => {
    if (pendingBlobRef.current) {
      URL.revokeObjectURL(pendingBlobRef.current);
      pendingBlobRef.current = undefined;
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    revokePending();
    const url = URL.createObjectURL(file);
    pendingBlobRef.current = url;
    setDraftAvatarUrl(url);
    e.target.value = '';
  };

  const trimmedLength = displayNickname.trim().length;
  const isValid = trimmedLength >= NICKNAME_MIN && trimmedLength <= NICKNAME_MAX;

  const handleStart = () => {
    if (!isValid) return;
    // TODO: 1차 MVP 제외 — 닉네임·아바타 백엔드 저장 (W4 연동)
    router.push('/');
  };

  // 표시 아바타: 직접 선택 > 구글 기본 이미지 > 이니셜 fallback
  const displayAvatarSrc = draftAvatarUrl ?? user?.image ?? undefined;
  const avatarInitial = displayNickname.trim().charAt(0) || '?';
  const firstName = user?.name?.split(' ')[0];
  const heading = firstName ? `환영해요, ${firstName}님!` : '환영해요!';

  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-var(--header-height))] bg-gradient-to-b from-primary-subtle/60 via-background to-background flex flex-col items-center justify-center px-6 py-16">
      <CutleryRain />

      {/* form 살짝 위로 */}
      <div className="relative z-10 w-full max-w-sm space-y-8 -translate-y-4">
        {/* Google 인증 완료 배지 */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-success-subtle text-success">
            <Check className="w-3 h-3" strokeWidth={3} />
          </span>
          <span className="text-caption-1 text-muted-foreground">Google 인증 완료</span>
        </div>

        {/* 헤딩 */}
        <div className="space-y-2">
          <h1 className="text-display-1 text-foreground">{heading}</h1>
          <p className="text-caption-1 text-muted-foreground leading-relaxed">
            프로필만 확인하면 끝이에요
          </p>
        </div>

        {/* 폼 */}
        <div className="space-y-6">
          {/* 프로필 사진 */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <Avatar className="h-20 w-20">
                {displayAvatarSrc && (
                  <AvatarImage src={displayAvatarSrc} alt="프로필 이미지" />
                )}
                <AvatarFallback className="bg-primary-subtle text-primary text-2xl">
                  {avatarInitial}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="프로필 이미지 변경"
                className={cn(
                  'absolute bottom-0 right-0 w-7 h-7 rounded-full',
                  'bg-primary text-primary-foreground flex items-center justify-center',
                  'ring-2 ring-background hover:bg-primary/80 transition-colors',
                )}
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* 닉네임 */}
          <div className="space-y-1.5">
            <label
              htmlFor="nickname"
              className="block text-title-2 text-foreground"
            >
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              value={displayNickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={NICKNAME_MAX}
              placeholder="닉네임을 입력해 주세요"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-label-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
            <p className="text-caption-2 text-muted-foreground">
              {NICKNAME_MIN}~{NICKNAME_MAX}자 · 중복 불가 · 나중에 변경 가능
            </p>
          </div>
        </div>

        {/* CTA */}
        <div>
          <button
            type="button"
            onClick={handleStart}
            disabled={!isValid}
            className="w-full rounded-xl bg-primary text-primary-foreground px-4 py-3.5 text-title-2 hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            시작하기
          </button>
          <p className="mt-3 text-center text-title-3 text-primary">
            믿을 수 있는 별점, 같이 모으는 맛집
          </p>
        </div>
      </div>
    </div>
  );
}
