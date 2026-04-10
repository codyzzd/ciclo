import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ModeToggle } from './ModeToggle'

const meta: Meta<typeof ModeToggle> = {
  title: 'Ciclo/Átomos/ModeToggle',
  component: ModeToggle,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'white' },
  },
  args: { onChange: () => {} },
}

export default meta
type Story = StoryObj<typeof ModeToggle>

export const Periodo: Story = {
  name: 'Modo: Menstruação',
  args: { mode: 'period' },
}

export const Sexo: Story = {
  name: 'Modo: Relação',
  args: { mode: 'sex' },
}
