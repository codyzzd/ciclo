import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CountdownOrb } from './CountdownOrb'

const meta: Meta<typeof CountdownOrb> = {
  title: 'Ciclo/Átomos/CountdownOrb',
  component: CountdownOrb,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'rosa', values: [{ name: 'rosa', value: '#fdf6f7' }] },
  },
  argTypes: {
    daysUntil: { control: { type: 'number', min: -10, max: 35 } },
    avgCycle: { control: { type: 'number', min: 21, max: 35 } },
  },
}

export default meta
type Story = StoryObj<typeof CountdownOrb>

export const SemDados: Story = {
  args: { daysUntil: null, avgCycle: 28 },
}

export const EmBreve: Story = {
  args: { daysUntil: 7, avgCycle: 28 },
}

export const Hoje: Story = {
  args: { daysUntil: 0, avgCycle: 28 },
}

export const Atrasado: Story = {
  args: { daysUntil: -3, avgCycle: 28 },
}

export const LongeAinda: Story = {
  args: { daysUntil: 25, avgCycle: 28 },
}

export const CicloLongo: Story = {
  args: { daysUntil: 14, avgCycle: 35 },
}
