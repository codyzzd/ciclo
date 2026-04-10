import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DayActionPicker } from './DayActionPicker'

const meta: Meta<typeof DayActionPicker> = {
  title: 'Ciclo/Organismos/DayActionPicker',
  component: DayActionPicker,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'app' },
  },
  args: {
    open: true,
    date: '2026-04-10',
    onToggleMenstruou: () => {},
    onToggleSexo: () => {},
    onSetIntensidade: () => {},
    onClose: () => {},
  },
}

export default meta
type Story = StoryObj<typeof DayActionPicker>

export const DiaSemDados: Story = {
  name: 'Dia sem dados',
  args: { dayData: null },
}

export const ComPeriodo: Story = {
  name: 'Com período (intensidade: médio)',
  args: {
    dayData: { id: '1', profile_id: 'p1', date: '2026-04-10', menstruou: true, intensidade: 'medio', sexo: false },
  },
}

export const ComSexo: Story = {
  name: 'Com relação sexual',
  args: {
    dayData: { id: '2', profile_id: 'p1', date: '2026-04-10', menstruou: false, intensidade: null, sexo: true },
  },
}

export const ComAmbos: Story = {
  name: 'Período + relação',
  args: {
    dayData: { id: '3', profile_id: 'p1', date: '2026-04-10', menstruou: true, intensidade: 'leve', sexo: true },
  },
}
