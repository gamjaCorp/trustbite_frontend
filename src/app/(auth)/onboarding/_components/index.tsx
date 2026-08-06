'use client';

import { useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Check, Camera } from 'lucide-react';
import { completeOnboarding } from '../actions';

import { UserAvatar } from '@/components/core/user-avatar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuthStatus } from '@/hooks/use-auth-status';
import { useImagePreview } from '@/hooks/use-image-preview';
import { cn } from '@/lib/utils';
import { CutleryRain } from '@/components/common/cutlery-rain';
import {
  onboardingSchema,
  NICKNAME_MIN,
  NICKNAME_MAX,
  type OnboardingValues,
} from '../_lib/schema';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// 온보딩 프로필 설정 폼 — 닉네임·프로필 사진 입력, 제출 시 홈으로 이동 (백엔드 저장은 W4)
export function OnboardingForm() {
  const { user } = useAuthStatus();
  const { update } = useSession();
  const router = useRouter();

  const form = useForm<OnboardingValues>({
    resolver: standardSchemaResolver(onboardingSchema),
    mode: 'onChange',
    // values: 세션 도착 후 닉네임 기본값을 채우되, 사용자가 이미 입력한 값은 keepDirtyValues로 보존
    values: {
      nickname: user?.name ?? '',
      avatar: undefined,
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  // 아바타: 사용자가 직접 고른 파일의 object URL 미리보기
  const { previewUrl: draftAvatarUrl, handleFileChange } = useImagePreview(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onValid = async (data: OnboardingValues) => {
    // TODO: 임시로 google 이미지 전송
    await completeOnboarding(data.nickname, user?.image ?? undefined);
    await update(); // 클라이언트 세션 갱신
    router.refresh();
    router.push('/');
  };

  // 버튼 활성: RHF isValid는 첫 렌더 직후 false일 수 있어 useWatch로 직접 계산
  const watchedNickname = useWatch({ control: form.control, name: 'nickname' });
  const trimmedLen = (watchedNickname ?? '').trim().length;
  const canSubmit = trimmedLen >= NICKNAME_MIN && trimmedLen <= NICKNAME_MAX;

  // 표시 아바타: 직접 선택 > 구글 기본 이미지 > 이니셜 fallback
  const displayAvatarSrc = draftAvatarUrl ?? user?.image ?? undefined;
  const avatarInitial = (watchedNickname ?? '').trim().charAt(0) || '?';
  const firstName = user?.name?.split(' ')[0];
  const heading = firstName ? `환영해요, ${firstName}님!` : '환영해요!';

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-b from-primary-subtle/60 via-background to-background flex flex-col items-center justify-center px-6 py-16">
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onValid)} className="space-y-6">
            {/* 프로필 사진 */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <UserAvatar initial={avatarInitial} imageUrl={displayAvatarSrc} size="xl" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="프로필 이미지 변경"
                  className={cn(
                    'absolute bottom-0 right-0 w-9 h-9 rounded-full',
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
                  onChange={(e) =>
                    handleFileChange(e, (file) =>
                      form.setValue('avatar', file, { shouldDirty: true }),
                    )
                  }
                />
              </div>
            </div>

            {/* 닉네임 */}
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-title-2 text-foreground">닉네임</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="text"
                      maxLength={NICKNAME_MAX}
                      placeholder="닉네임을 입력해 주세요"
                      className="w-full rounded-xl border border-border bg-card px-4 py-3 text-label-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </FormControl>
                  <FormDescription>
                    {NICKNAME_MIN}~{NICKNAME_MAX}자 · 중복 불가 · 나중에 변경 가능
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CTA */}
            <div>
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full rounded-xl bg-primary text-primary-foreground px-4 py-3.5 text-title-2 hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                시작하기
              </button>
              <p className="mt-3 text-center text-title-3 text-primary">
                믿을 수 있는 별점, 같이 모으는 맛집
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
