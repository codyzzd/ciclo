import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CalendarMonth } from './CalendarMonth'
import type { CyclePrediction, CycleDay } from '@/types'

const meta: Meta<typeof CalendarMonth> = {
  title: 'Ciclo/Organismos/CalendarMonth',
  component: CalendarMonth,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'rosa', values: [{ name: 'rosa', value: '#fdf6f7' }] },
  },
}

export default meta
type Story = StoryObj<typeof CalendarMonth>

const emptyPrediction: CyclePrediction = {
  nextPeriodStart: null,
  nextPeriodEnd: null,
  ovulationDate: null,
  fertileWindowStart: null,
  fertileWindowEnd: null,
  daysUntilNextPeriod: null,
  averageCycleLength: null,
  cyclesDetected: 0,
  predictedPeriodDays: new Set(),
  fertileDays: new Set(),
  ovulationDays: new Set(),
}

// Abril 2026 com período nos dias 1–5 e previsão de próximo período
const withPeriod: CyclePrediction = {
  ...emptyPrediction,
  cyclesDetected: 3,
  daysUntilNextPeriod: 23,
  averageCycleLength: 28,
  predictedPeriodDays: new Set(['2026-05-04', '2026-05-05', '2026-05-06', '2026-05-07', '2026-05-08']),
  fertileDays: new Set(['2026-04-17', '2026-04-18', '2026-04-19', '2026-04-20', '2026-04-21', '2026-04-22']),
  ovulationDays: new Set(['2026-04-20']),
}

const markedApril = ['2026-04-01', '2026-04-02', '2026-04-03', '2026-04-04', '2026-04-05']

const dayDataMap: Record<string, CycleDay> = {
  '2026-04-01': { id: '1', profile_id: 'p1', date: '2026-04-01', menstruou: true, intensidade: 'intenso', sexo: false },
  '2026-04-02': { id: '2', profile_id: 'p1', date: '2026-04-02', menstruou: true, intensidade: 'medio', sexo: false },
  '2026-04-03': { id: '3', profile_id: 'p1', date: '2026-04-03', menstruou: true, intensidade: 'medio', sexo: false },
  '2026-04-04': { id: '4', profile_id: 'p1', date: '2026-04-04', menstruou: true, intensidade: 'leve', sexo: false },
  '2026-04-05': { id: '5', profile_id: 'p1', date: '2026-04-05', menstruou: true, intensidade: 'leve', sexo: false },
}

export const Vazio: Story = {
  args: {
    year: 2026,
    month: 3, // abril (0-indexed)
    mode: 'period',
    prediction: emptyPrediction,
    markedDates: [],
    getDayData: () => null,
    onDayPress: () => {},
    onLongPress: () => {},
  },
}

export const ComPeriodoEPrevisao: Story = {
  args: {
    year: 2026,
    month: 3,
    mode: 'period',
    prediction: withPeriod,
    markedDates: markedApril,
    getDayData: (date) => dayDataMap[date] ?? null,
    onDayPress: () => {},
    onLongPress: () => {},
  },
}

export const ModoRelacao: Story = {
  args: {
    year: 2026,
    month: 3,
    mode: 'sex',
    prediction: withPeriod,
    markedDates: markedApril,
    getDayData: (date) => {
      const base = dayDataMap[date] ?? null
      if (date === '2026-04-08' || date === '2026-04-12' || date === '2026-04-19') {
        return { id: date, profile_id: 'p1', date, menstruou: false, intensidade: null, sexo: true }
      }
      return base
    },
    onDayPress: () => {},
    onLongPress: () => {},
  },
}
