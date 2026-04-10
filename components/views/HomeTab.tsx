'use client'

import type { CyclePrediction } from '@/types'
import { getPregnancyProbability } from '@/lib/insights-logic'
import { CountdownOrb } from '@/components/CountdownOrb'
import { PregnancyChanceCard } from '@/components/PregnancyChanceCard'
import { TimelineStrip } from '@/components/TimelineStrip'
import { CardInfo } from '@/components/CardInfo'

interface Props {
  prediction: CyclePrediction
  markedDates: string[]
}

function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0]
}

export function HomeTab({ prediction, markedDates }: Props) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = toDateStr(today)

  const daysUntil = prediction.daysUntilNextPeriod
  const avgCycle = prediction.averageCycleLength ?? 28

  // Strip: 7 days before + today + 7 days after = 15
  const markedSet = new Set(markedDates)
  const stripDays: { dateStr: string; isToday: boolean; phase: string }[] = []
  for (let i = -7; i <= 7; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    const ds = toDateStr(d)
    const isToday = ds === todayStr

    let phase = 'normal'
    if (markedSet.has(ds))                           phase = 'period'
    else if (prediction.ovulationDays.has(ds))       phase = 'ovulation'
    else if (prediction.fertileDays.has(ds))         phase = 'fertile'
    else if (prediction.predictedPeriodDays.has(ds)) phase = 'predicted'

    stripDays.push({ dateStr: ds, isToday, phase })
  }

  const isOnPeriod = markedSet.has(todayStr)
  const prob = getPregnancyProbability(prediction.fertileDays, prediction.ovulationDays, todayStr, isOnPeriod)

  const hasDates = prediction.nextPeriodStart || prediction.ovulationDate

  return (
    <div className="flex flex-col gap-2 px-[13px] pb-6">
      {/* Countdown orb */}
      <div className="anim-1">
        <CountdownOrb daysUntil={daysUntil} avgCycle={avgCycle} />
      </div>

      {/* Timeline strip */}
      <div className="anim-2">
        <TimelineStrip days={stripDays} />
      </div>

      {/* Pregnancy probability */}
      <div className="anim-3">
        <PregnancyChanceCard chance={prob} />
      </div>

      {/* Período / Ovulação — dois cards lado a lado */}
      {hasDates && (
        <div className="flex gap-2 anim-3">
          {prediction.nextPeriodStart && (
            <CardInfo
              title="Período"
              value={prediction.nextPeriodStart.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
              color="rose"
            />
          )}
          {prediction.ovulationDate && (
            <CardInfo
              title="Ovulação"
              value={prediction.ovulationDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
              color="teal"
            />
          )}
        </div>
      )}
    </div>
  )
}
