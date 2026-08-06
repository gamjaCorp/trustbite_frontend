import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import '../src/app/globals.css';

import type { Preview } from '@storybook/nextjs-vite';
import { SessionProvider } from 'next-auth/react';

const preview: Preview = {
  parameters: {
    // App Router 전용 저장소 — useRouter/usePathname을 쓰는 컴포넌트가 스토리마다
    // 이걸 빠뜨리면 렌더가 통째로 실패한다. 개별 스토리는 navigation.pathname만 덮어쓰면 된다.
    nextjs: {
      appDirectory: true,
    },
    options: {
      storySort: {
        order: ['Foundation', 'UI', 'Core', 'Common', '*'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  decorators: [
    (Story) => (
      <SessionProvider>
        <div className="font-sans antialiased bg-background text-foreground">
          <Story />
        </div>
      </SessionProvider>
    ),
  ],
};

export default preview;
