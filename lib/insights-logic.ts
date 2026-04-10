import { detectPeriods } from './cycle-logic'

export interface CycleInsights {
  cycleStarts: string[]
  cycleLengths: number[]
  averageCycle: number | null
  variation: number | null
  variationLabel: 'regular' | 'moderado' | 'irregular' | null
  trend: 'estável' | 'encurtando' | 'aumentando' | null
  delayProbability: number | null
  confidence: number | null
  hasEnoughData: boolean
}

function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24))
}

export function getCycleInsights(markedDates: string[]): CycleInsights {
  const empty: CycleInsights = {
    cycleStarts: [],
    cycleLengths: [],
    averageCycle: null,
    variation: null,
    variationLabel: null,
    trend: null,
    delayProbability: null,
    confidence: null,
    hasEnoughData: false,
  }

  const periods = detectPeriods(markedDates)
  if (periods.length < 2) return empty

  const starts = periods.map(p => p.start)
  const recent = starts.slice(-7)

  const lengths: number[] = []
  for (let i = 1; i < recent.length; i++) {
    lengths.push(daysBetween(recent[i - 1], recent[i]))
  }

  if (lengths.length === 0) return empty

  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length
  const variation = lengths.reduce((a, b) => a + Math.abs(b - avg), 0) / lengths.length

  const variationLabel: CycleInsights['variationLabel'] =
    variation <= 2 ? 'regular' : variation <= 5 ? 'moderado' : 'irregular'

  let trend: CycleInsights['trend'] = 'estável'
  if (lengths.length >= 4) {
    const recent2 = lengths.slice(-2).reduce((a, b) => a + b, 0) / 2
    const prev2 = lengths.slice(-4, -2).reduce((a, b) => a + b, 0) / 2
    const diff = recent2 - prev2
    if (diff >= 2) trend = 'aumentando'
    else if (diff <= -2) trend = 'encurtando'
  }

  const rawDelay = (variation / avg) * 100
  const delayProbability = Math.min(60, Math.max(5, Math.round(rawDelay)))

  const rawConfidence = lengths.length * 15 - variation * 5
  const confidence = Math.min(100, Math.max(30, Math.round(rawConfidence)))

  return {
    cycleStarts: starts,
    cycleLengths: lengths,
    averageCycle: Math.round(avg),
    variation: Math.round(variation * 10) / 10,
    variationLabel,
    trend,
    delayProbability,
    confidence,
    hasEnoughData: true,
  }
}

export function getPregnancyProbability(
  fertileDays: Set<string>,
  ovulationDays: Set<string>,
  today: string,
  isOnPeriod: boolean
): 'improvável' | 'baixa' | 'possível' | 'certo' | 'alta' {
  if (isOnPeriod) return 'improvável'
  if (ovulationDays.has(today)) return 'alta'
  if (fertileDays.has(today)) return 'certo'

  const todayDate = new Date(today)
  for (let i = 1; i <= 3; i++) {
    const d = new Date(todayDate)
    d.setDate(d.getDate() + i)
    const ds = d.toISOString().split('T')[0]
    if (ovulationDays.has(ds) || fertileDays.has(ds)) return 'possível'
  }

  return 'baixa'
}
