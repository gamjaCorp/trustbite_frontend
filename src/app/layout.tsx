import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import './globals.css';
import { auth } from '@/auth';
import { Providers } from '@/components/common/layout/providers';
import { Header } from '@/components/common/layout/header/index';

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'TrustBite',
  description: '믿을 수 있는 별점, 같이 모으는 맛집',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable} antialiased`}>
        <Providers session={session}>
          <Header />
          <main className="min-h-[calc(100vh-var(--header-height))] bg-background">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
