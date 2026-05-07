import { redirect } from 'next/navigation';
import { signIn, providerMap } from '@/auth';
import { AuthError } from 'next-auth';
import { Button } from '@/components/ui/button';

const SIGNIN_ERROR_URL = '/error';

export default async function SignInPage(props: {
  searchParams: { callbackUrl: string | undefined };
}) {
  return (
    <div className="min-h-[calc(100vh-97px)] bg-gradient-to-b from-primary-subtle/60 via-background to-background flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-primary tracking-tight">TrustBite</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            믿을 수 있는 별점,
            <br />
            같이 모으는 맛집
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {Object.values(providerMap).map((provider) => (
            <form
              key={provider.id}
              action={async () => {
                'use server';
                try {
                  await signIn(provider.id, {
                    redirectTo: props.searchParams?.callbackUrl ?? '',
                  });
                } catch (error) {
                  if (error instanceof AuthError) {
                    return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
                  }
                  throw error;
                }
              }}
            >
              <Button type="submit" variant="outline" className="w-full h-11 rounded-xl">
                <span className="font-medium">{provider.name}로 시작하기</span>
              </Button>
            </form>
          ))}
        </div>

        <p className="text-center text-caption-2 text-muted-foreground leading-relaxed">
          로그인하면 TrustBite의 서비스 약관과 개인정보 처리방침에 동의하게 돼요.
        </p>
      </div>
    </div>
  );
}
