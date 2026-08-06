import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import './globals.css';
import { getSession } from '@/auth';
import { Providers } from '@/components/common/layout/providers';

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
  const session = await getSession();

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable} antialiased`}>
        {/* 헤더와 <main>은 헤더 종류별 Route Group 레이아웃이 소유한다 — app/(main)·(sub)·(auth) */}
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
