import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import '../src/app/globals.css';

import type { Preview } from '@storybook/nextjs-vite';
import { SessionProvider } from 'next-auth/react';

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['Foundation', 'Core', 'Common', '*'],
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
