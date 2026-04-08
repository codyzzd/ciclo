import type { DetectedPeriod, CyclePrediction } from '@/types'

function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0]
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

export function detectPeriods(markedDates: string[]): DetectedPeriod[] {
  if (markedDates.length === 0) return []

  const sorted = [...markedDates].sort()
  const periods: DetectedPeriod[] = []
  let current: string[] = [sorted[0]]

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1])
    const curr = new Date(sorted[i])
    const diff = daysBetween(prev, curr)

    if (diff <= 2) {
      current.push(sorted[i])
    } else {
      periods.push({ start: current[0], end: current[current.length - 1], days: current })
      current = [sorted[i]]
    }
  }
  periods.push({ start: current[0], end: current[current.length - 1], days: current })

  return periods
}

export function calculatePredictions(markedDates: string[]): CyclePrediction {
  const empty: CyclePrediction = {
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

  const DEFAULT_CYCLE_LENGTH = 28

  const periodDates = markedDates.filter(Boolean)
  const periods = detectPeriods(periodDates)

  if (periods.length === 0) return empty

  // Use last 6 cycles to compute average length; fall back to 28-day default with 1 cycle
  const recent = periods.slice(-7)
  const lengths: number[] = []
  for (let i = 1; i < recent.length; i++) {
    const prev = new Date(recent[i - 1].start)
    const curr = new Date(recent[i].start)
    lengths.push(daysBetween(prev, curr))
  }
  const avgCycleLength = lengths.length > 0
    ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
    : DEFAULT_CYCLE_LENGTH

  // Average period duration
  const avgDuration = Math.max(3, Math.round(
    periods.map(p => p.days.length).reduce((a, b) => a + b, 0) / periods.length
  ))

  const lastPeriodStart = new Date(periods[periods.length - 1].start)
  const nextPeriodStart = addDays(lastPeriodStart, avgCycleLength)
  const nextPeriodEnd = addDays(nextPeriodStart, avgDuration - 1)
  const ovulationDate = addDays(nextPeriodStart, -14)
  const fertileWindowStart = addDays(ovulationDate, -5)
  const fertileWindowEnd = addDays(ovulationDate, 1)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const daysUntil = daysBetween(today, nextPeriodStart)

  // Build sets for fast lookup
  const predictedPeriodDays = new Set<string>()
  const fertileDays = new Set<string>()
  const ovulationDays = new Set<string>()

  function addFertileWindow(ov: Date) {
    const fStart = addDays(ov, -5)
    const fEnd = addDays(ov, 1)
    ovulationDays.add(toDateStr(ov))
    for (let d = new Date(fStart); d <= fEnd; d = addDays(d, 1)) {
      if (!ovulationDays.has(toDateStr(d))) fertileDays.add(toDateStr(d))
    }
  }

  // Historical cycles: ovulation = next period start - 14 days
  for (let i = 1; i < periods.length; i++) {
    const ov = addDays(new Date(periods[i].start), -14)
    addFertileWindow(ov)
  }

  // Future cycles (next 3)
  for (let cycle = 0; cycle < 3; cycle++) {
    const pStart = addDays(nextPeriodStart, cycle * avgCycleLength)
    const pEnd = addDays(pStart, avgDuration - 1)
    const ov = addDays(pStart, -14)

    for (let d = new Date(pStart); d <= pEnd; d = addDays(d, 1)) {
      predictedPeriodDays.add(toDateStr(d))
    }
    addFertileWindow(ov)
  }

  return {
    nextPeriodStart,
    nextPeriodEnd,
    ovulationDate,
    fertileWindowStart,
    fertileWindowEnd,
    daysUntilNextPeriod: daysUntil,
    averageCycleLength: avgCycleLength,
    cyclesDetected: periods.length,
    predictedPeriodDays,
    fertileDays,
    ovulationDays,
  }
}
