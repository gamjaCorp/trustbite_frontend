'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

import { AuthLayout } from '@/components/features/auth/index';
import { cn } from '@/lib/utils';

const PRIMARY_REGIONS = ['강남', '홍대', '을지로', '성수', '한남'] as const;
const MORE_REGIONS = [
  '광장시장',
  '서촌',
  '망원',
  '합정',
  '이태원',
  '압구정',
  '신촌',
  '종로',
  '명동',
] as const;

const MAX_REGIONS = 3;
const NICKNAME_MIN = 2;
const NICKNAME_MAX = 12;

export default function OnboardingPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState('함사먹은 햄찌');
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['강남', '성수']);
  const [showMore, setShowMore] = useState(false);

  const toggleRegion = (region: string) => {
    setSelectedRegions((prev) => {
      if (prev.includes(region)) return prev.filter((r) => r !== region);
      if (prev.length >= MAX_REGIONS) return prev;
      return [...prev, region];
    });
  };

  const trimmedLength = nickname.trim().length;
  const isValid =
    trimmedLength >= NICKNAME_MIN &&
    trimmedLength <= NICKNAME_MAX &&
    selectedRegions.length > 0;

  const handleStart = () => {
    if (!isValid) return;
    router.push('/');
  };

  const visibleRegions = showMore
    ? [...PRIMARY_REGIONS, ...MORE_REGIONS]
    : PRIMARY_REGIONS;

  return (
    <AuthLayout
      step={2}
      left={
        <div className="flex-1 flex flex-col w-full max-w-md mx-auto">
          <div className="flex-1 flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-display-1 text-foreground">
                잘 오셨어요, 햄찌님
              </h1>
              <p className="text-caption-1 text-muted-foreground leading-relaxed">
                마지막 한 단계만 남았어요.
                <br />
                곧 만나볼 수 있어요.
              </p>
            </div>

            <blockquote className="pl-4 border-l-2 border-primary">
              <p className="text-body-2 text-foreground leading-relaxed">
                &ldquo;리뷰는 단순한 평가가 아니라,
                <br />
                다른 사람의 신중한 선택을 만드는 거예요.&rdquo;
              </p>
              <footer className="mt-2 text-caption-2 text-muted-foreground">
                — TrustBite의 약속
              </footer>
            </blockquote>
          </div>

          <div className="pt-8 border-t border-border flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-foreground text-background">
              <Check className="w-3 h-3" strokeWidth={3} />
            </span>
            <span className="text-caption-1 text-muted-foreground">Google 인증 완료</span>
          </div>
        </div>
      }
      right={
        <div className="flex-1 flex flex-col w-full max-w-md mx-auto">
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div>
              <h2 className="text-headline-1 tracking-tight text-foreground">
                두 가지만 알려주시면 시작해요
              </h2>
              <p className="mt-2 text-caption-1 text-muted-foreground">
                언제든 나중에 변경할 수 있어요
              </p>
            </div>

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
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={NICKNAME_MAX}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-label-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
              <p className="text-caption-2 text-muted-foreground">
                {NICKNAME_MIN}~{NICKNAME_MAX}자 · 나중에 변경 가능
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-title-2 text-foreground">자주 가는 지역</p>
              <div className="flex flex-wrap gap-2">
                {visibleRegions.map((region) => {
                  const selected = selectedRegions.includes(region);
                  const disabled =
                    !selected && selectedRegions.length >= MAX_REGIONS;
                  return (
                    <button
                      key={region}
                      type="button"
                      onClick={() => toggleRegion(region)}
                      disabled={disabled}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full border px-3 py-1.5 transition-colors',
                        selected
                          ? 'bg-primary-subtle text-primary border-primary/40 text-title-3'
                          : 'text-body-2 bg-card text-foreground border-border hover:bg-muted/40',
                        disabled && 'opacity-40 cursor-not-allowed hover:bg-card',
                      )}
                    >
                      {region}
                      {selected && (
                        <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                      )}
                    </button>
                  );
                })}
                {!showMore && (
                  <button
                    type="button"
                    onClick={() => setShowMore(true)}
                    className="inline-flex items-center rounded-full border border-dashed border-border px-3 py-1.5 text-label-2 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                  >
                    + 더보기
                  </button>
                )}
              </div>
              <p className="text-caption-2 text-muted-foreground">
                최대 {MAX_REGIONS}개 · 검색 시 우선 노출
              </p>
            </div>
          </div>

          <div className="pt-8">
            <button
              type="button"
              onClick={handleStart}
              disabled={!isValid}
              className="w-full rounded-xl bg-foreground text-background px-4 py-3.5 text-title-2 hover:bg-foreground/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              시작하기
            </button>
            <p className="mt-3 text-center text-title-3 text-primary">
              리뷰를 쓸수록 내 신뢰도가 올라가요
            </p>
          </div>
        </div>
      }
    />
  );
}
