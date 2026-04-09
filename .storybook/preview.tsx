import type { Preview } from '@storybook/nextjs-vite'
import React from 'react'
import '../app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app',   value: '#fdf6f7' },
        { name: 'white', value: '#ffffff' },
        { name: 'dark',  value: '#1a1a1a' },
      ],
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
    a11y: {
      test: 'todo',
    },
    options: {
      storySort: {
        order: ['Design System', ['Overview', 'Colors', 'Typography', 'Tokens'], 'UI', 'Ciclo'],
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: '100%' }}>
        <Story />
      </div>
    ),
  ],
}

export default preview
