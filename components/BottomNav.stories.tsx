import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { BottomNav } from './BottomNav'

const meta: Meta<typeof BottomNav> = {
  title: 'Ciclo/Moléculas/BottomNav',
  component: BottomNav,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'white', values: [{ name: 'white', value: '#ffffff' }] },
  },
  argTypes: {
    active: {
      control: 'radio',
      options: ['home', 'calendar', 'insights'],
    },
  },
  args: {
    onChange: () => {},
  },
}

export default meta
type Story = StoryObj<typeof BottomNav>

export const Home: Story = {
  name: 'Aba: Início',
  args: { active: 'home' },
}

export const Calendar: Story = {
  name: 'Aba: Calendário',
  args: { active: 'calendar' },
}

export const Insights: Story = {
  name: 'Aba: Insights',
  args: { active: 'insights' },
}
