import Link from 'next/link';
import { Sparkles, Star, Users } from 'lucide-react';

import { AuthLayout } from '@/components/features/auth/auth-layout';

const FEATURES = [
  {
    icon: Star,
    title: '신뢰도가 보이는 별점',
    description: '검증된 평가가 더 크게 반영돼요',
  },
  {
    icon: Users,
    title: '함께 만드는 맛집 리스트',
    description: '친구·동료와 가고 싶은 곳을 모아요',
  },
  {
    icon: Sparkles,
    title: 'AI 미식 성향 분석',
    description: '리뷰가 쌓이면 자동으로 정리해요',
  },
] as const;

// 브랜드 고정 컬러 — 토큰 대체 금지
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <AuthLayout
      step={1}
      left={
        <div className="flex-1 flex flex-col justify-center w-full max-w-md mx-auto space-y-10">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-foreground">
              믿을 수 있는 별점,
              <br />
              같이 모으는 맛집
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              검증된 리뷰어의 신뢰도 기반 평가로 진짜 맛집을 발견하고,
              <br className="hidden md:block" />
              친구·동료와 우리만의 맛집 지도를 만들어보세요
            </p>
          </div>
          <ul className="space-y-3.5">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-foreground/10 text-foreground">
                  <Icon className="w-3.5 h-3.5" strokeWidth={2.25} />
                </span>
                <div className="min-w-0">
                  <p className="text-title-2 text-foreground">{title}</p>
                  <p className="text-caption-2 text-muted-foreground mt-0.5">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      }
      right={
        <div className="flex-1 flex flex-col w-full max-w-md mx-auto">
          <div className="flex-1 flex flex-col justify-center space-y-7">
            <div>
              <h2 className="text-headline-1 tracking-tight text-foreground">
                1초만에 시작하기
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Google 계정으로 간편하게 시작하세요.
                <br />
                이메일·비밀번호 입력은 필요 없어요.
              </p>
            </div>

            <Link
              href="/onboarding"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-card border border-border px-4 py-3.5 text-title-2 text-foreground shadow-sm hover:bg-muted/40 transition-colors"
            >
              <GoogleLogo className="w-4 h-4" />
              Google로 계속하기
            </Link>

            <p className="text-center text-caption-2 text-muted-foreground leading-relaxed">
              처음 가입이라면 다음 단계에서
              <br />
              닉네임과 활동 지역을 선택하게 돼요
            </p>
          </div>

          <p className="pt-5 border-t border-border text-center text-caption-2 text-muted-foreground leading-relaxed">
            계속 진행하면{' '}
            <button type="button" className="underline-offset-2 hover:underline">
              이용약관
            </button>
            과{' '}
            <button type="button" className="underline-offset-2 hover:underline">
              개인정보처리방침
            </button>
            에 동의하게 됩니다
          </p>
        </div>
      }
    />
  );
}
