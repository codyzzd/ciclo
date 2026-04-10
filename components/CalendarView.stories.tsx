import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CalendarView } from './CalendarView'
import type { CyclePrediction, CycleDay } from '@/types'

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

const withPrediction: CyclePrediction = {
  ...emptyPrediction,
  cyclesDetected: 3,
  averageCycleLength: 28,
  daysUntilNextPeriod: 18,
  nextPeriodStart: new Date('2026-04-28'),
  nextPeriodEnd: new Date('2026-05-02'),
  ovulationDate: new Date('2026-04-14'),
  fertileWindowStart: new Date('2026-04-09'),
  fertileWindowEnd: new Date('2026-04-15'),
  predictedPeriodDays: new Set(['2026-04-28','2026-04-29','2026-04-30','2026-05-01','2026-05-02']),
  fertileDays: new Set(['2026-04-09','2026-04-10','2026-04-11','2026-04-12','2026-04-13','2026-04-15']),
  ovulationDays: new Set(['2026-04-14']),
}

const markedApril = ['2026-04-01','2026-04-02','2026-04-03','2026-04-04','2026-04-05']

const dayDataMap: Record<string, CycleDay> = {
  '2026-04-01': { id:'1', profile_id:'p1', date:'2026-04-01', menstruou:true, intensidade:'intenso', sexo:false },
  '2026-04-02': { id:'2', profile_id:'p1', date:'2026-04-02', menstruou:true, intensidade:'medio',  sexo:false },
  '2026-04-03': { id:'3', profile_id:'p1', date:'2026-04-03', menstruou:true, intensidade:'medio',  sexo:false },
  '2026-04-04': { id:'4', profile_id:'p1', date:'2026-04-04', menstruou:true, intensidade:'leve',   sexo:false },
  '2026-04-05': { id:'5', profile_id:'p1', date:'2026-04-05', menstruou:true, intensidade:'leve',   sexo:false },
}

const meta: Meta<typeof CalendarView> = {
  title: 'Ciclo/Organismos/CalendarView',
  component: CalendarView,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'app' },
  },
  args: {
    markedDates: markedApril,
    getDayData: (date) => dayDataMap[date] ?? null,
    onDayPress: () => {},
    onLongPress: () => {},
  },
}

export default meta
type Story = StoryObj<typeof CalendarView>

export const SemDados: Story = {
  name: 'Sem dados',
  args: { mode: 'period', prediction: emptyPrediction, markedDates: [], getDayData: () => null },
}

export const ComPrevisoes: Story = {
  name: 'Com previsões (modo período)',
  args: { mode: 'period', prediction: withPrediction },
}

export const ModoRelacao: Story = {
  name: 'Modo relação',
  args: {
    mode: 'sex',
    prediction: withPrediction,
    getDayData: (date) => {
      if (['2026-04-08','2026-04-12','2026-04-18'].includes(date))
        return { id: date, profile_id: 'p1', date, menstruou: false, intensidade: null, sexo: true }
      return dayDataMap[date] ?? null
    },
  },
}
