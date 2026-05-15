import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import './globals.css';
import { Providers } from '@/components/common/providers';
import { Header } from '@/components/common/header';
import { AuthMockToggle } from '@/components/common/auth-mock-toggle';

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'TrustBite',
  description: '믿을 수 있는 별점, 같이 모으는 맛집',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable} antialiased`}>
        <Providers>
          <Header />
          <main className="min-h-screen bg-background">{children}</main>
          <AuthMockToggle />
        </Providers>
      </body>
    </html>
  );
}
