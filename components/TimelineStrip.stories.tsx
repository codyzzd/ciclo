import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TimelineStrip } from './TimelineStrip'

function dayOffset(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

// Builds 15 days centered on today (-7 to +7)
function makeDays(ovulationIn: number, periodDaysBack: number = 0) {
  const fertileDays = new Set(
    Array.from({ length: 7 }, (_, i) => dayOffset(ovulationIn - 5 + i))
  )
  const ovulationDays = new Set([dayOffset(ovulationIn)])
  const predictedDays = new Set(
    Array.from({ length: 5 }, (_, i) => dayOffset(ovulationIn + 14 + i))
  )
  const periodDays = new Set(
    Array.from({ length: periodDaysBack }, (_, i) => dayOffset(-i))
  )

  return Array.from({ length: 15 }, (_, i) => {
    const offset = i - 7
    const ds = dayOffset(offset)
    const isToday = offset === 0

    let phase = 'normal'
    if (periodDays.has(ds))       phase = 'period'
    else if (ovulationDays.has(ds)) phase = 'ovulation'
    else if (fertileDays.has(ds))   phase = 'fertile'
    else if (predictedDays.has(ds)) phase = 'predicted'

    return { dateStr: ds, isToday, phase }
  })
}

const meta: Meta<typeof TimelineStrip> = {
  title: 'Ciclo/Organismos/TimelineStrip',
  component: TimelineStrip,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'rosa', values: [{ name: 'rosa', value: '#f1f5f9' }] },
  },
}

export default meta
type Story = StoryObj<typeof TimelineStrip>

export const PeriodoAtual: Story = {
  name: 'No período',
  args: { days: makeDays(20, 3) },
}

export const FaseNormal: Story = {
  name: 'Fase normal (longe da janela)',
  args: { days: makeDays(15) },
}

export const ProximoJanela: Story = {
  name: 'Próximo da janela fértil',
  args: { days: makeDays(3) },
}

export const JanelaFertil: Story = {
  name: 'Na janela fértil',
  args: { days: makeDays(6) },
}

export const Ovulacao: Story = {
  name: 'Ovulação hoje',
  args: { days: makeDays(0) },
}
