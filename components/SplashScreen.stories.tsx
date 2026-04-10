import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SplashScreen } from './SplashScreen'

const meta: Meta<typeof SplashScreen> = {
  title: 'Ciclo/Átomos/SplashScreen',
  component: SplashScreen,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'app' },
    docs: {
      description: {
        component: 'Splash screen PWA. Aparece por 1.2s e faz fade-out em 400ms.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof SplashScreen>

export const Default: Story = {
  name: 'Splash (auto-fade)',
}
