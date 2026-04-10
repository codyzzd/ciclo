import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { IntensityPicker } from './IntensityPicker'

const meta: Meta<typeof IntensityPicker> = {
  title: 'Ciclo/Moléculas/IntensityPicker',
  component: IntensityPicker,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'app' },
  },
  args: {
    open: true,
    date: '2026-04-10',
    onSelect: () => {},
    onClose: () => {},
  },
}

export default meta
type Story = StoryObj<typeof IntensityPicker>

export const SemSelecao: Story = {
  name: 'Sem seleção',
  args: { current: null },
}

export const Leve: Story = {
  name: 'Selecionado: Leve',
  args: { current: 'leve' },
}

export const Medio: Story = {
  name: 'Selecionado: Médio',
  args: { current: 'medio' },
}

export const Intenso: Story = {
  name: 'Selecionado: Intenso',
  args: { current: 'intenso' },
}
