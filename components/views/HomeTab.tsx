'use client'

import type { CyclePrediction } from '@/types'
import { getPregnancyProbability } from '@/lib/insights-logic'

interface Props {
  prediction: CyclePrediction
  markedDates: string[]
}

function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0]
}

const PHASE_COLORS: Record<string, string> = {
  period:    'bg-[#FF385C]',
  predicted: 'bg-[#FFB3C0]',
  ovulation: 'bg-[#00A699]',
  fertile:   'bg-[#6EE7E2]',
  today:     'bg-white border-2 border-[#FF385C]',
  normal:    'bg-[#EBEBEB]',
}

export function HomeTab({ prediction, markedDates }: Props) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = toDateStr(today)

  const daysUntil = prediction.daysUntilNextPeriod
  const avgCycle = prediction.averageCycleLength ?? 28

  // --- Countdown ring ---
  const isLate = daysUntil !== null && daysUntil < 0
  const countLabel = daysUntil === null
    ? '—'
    : daysUntil === 0
    ? 'Hoje'
    : isLate
    ? `${Math.abs(daysUntil)}d atraso`
    : `${daysUntil}`

  const countSublabel = daysUntil === null
    ? 'Registre seus ciclos'
    : daysUntil === 0
    ? 'Período esperado hoje'
    : isLate
    ? 'Período esperado já passou'
    : 'dias para o período'

  // Progress 0–1 through cycle (days since last period / avg cycle)
  const progress = daysUntil !== null
    ? Math.max(0, Math.min(1, (avgCycle - daysUntil) / avgCycle))
    : 0

  const radius = 72
  const circumference = 2 * Math.PI * radius
  const strokeDash = circumference * progress
  const strokeGap = circumference - strokeDash

  // --- Strip: 7 days before + today + 7 days after = 15 ---
  const markedSet = new Set(markedDates)
  const stripDays: { dateStr: string; isToday: boolean; phase: keyof typeof PHASE_COLORS }[] = []
  for (let i = -7; i <= 7; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    const ds = toDateStr(d)
    const isToday = ds === todayStr

    let phase: keyof typeof PHASE_COLORS = 'normal'
    if (isToday)                                       phase = 'today'
    else if (markedSet.has(ds))                        phase = 'period'
    else if (prediction.ovulationDays.has(ds))         phase = 'ovulation'
    else if (prediction.fertileDays.has(ds))           phase = 'fertile'
    else if (prediction.predictedPeriodDays.has(ds))   phase = 'predicted'

    stripDays.push({ dateStr: ds, isToday, phase })
  }

  // --- Pregnancy probability ---
  const prob = getPregnancyProbability(prediction.fertileDays, prediction.ovulationDays, todayStr)
  const probConfig = {
    baixa:  { label: 'Baixa',  color: 'text-gray-600',   bg: 'bg-[#F7F7F7]',      bar: 'w-1/4  bg-[#EBEBEB]' },
    média:  { label: 'Média',  color: 'text-[#F59E0B]', bg: 'bg-[#FFFBEB]',      bar: 'w-2/4  bg-[#F59E0B]' },
    alta:   { label: 'Alta',   color: 'text-[#00A699]', bg: 'bg-[#E6F7F6]',      bar: 'w-3/4  bg-[#00A699]' },
  }[prob]

  const weekDayShort = (ds: string) => {
    const d = new Date(ds + 'T12:00:00')
    return d.toLocaleDateString('pt-BR', { weekday: 'short' }).charAt(0).toUpperCase()
  }

  return (
    <div className="flex flex-col bg-white pb-6">
      {/* Countdown circle */}
      <div className="flex flex-col items-center pt-6 pb-6 anim-1">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            {/* Track */}
            <circle cx="80" cy="80" r={radius} fill="none" stroke="#F0F0F0" strokeWidth="10" />
            {/* Progress */}
            <circle
              cx="80" cy="80" r={radius}
              fill="none"
              stroke="#FF385C"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${strokeDash} ${strokeGap}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-bold leading-none ${daysUntil !== null && Math.abs(daysUntil) >= 10 ? 'text-4xl' : 'text-5xl'}`}>
              {countLabel}
            </span>
            <span className="text-xs text-gray-600 text-center mt-1.5 px-4 leading-tight">
              {countSublabel}
            </span>
          </div>
        </div>
      </div>

      {/* Strip */}
      <div className="px-4 mb-5 anim-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Próximos 15 dias</p>
        <div className="flex items-end">
          {stripDays.map(({ dateStr, isToday, phase }) => (
            <div key={dateStr} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[8px] text-gray-500 font-semibold">{weekDayShort(dateStr)}</span>
              <div className={`rounded-full ${
                isToday
                  ? 'w-4 h-4 ring-2 ring-[#FF385C] ring-offset-1 bg-[#FF385C]'
                  : `w-3 h-3 ${PHASE_COLORS[phase]}`
              }`} />
            </div>
          ))}
        </div>

        {/* Strip legend */}
        <div className="flex gap-3 mt-4 flex-wrap">
          {[
            { color: 'bg-[#FF385C]', label: 'Período' },
            { color: 'bg-[#FFB3C0]', label: 'Previsão' },
            { color: 'bg-[#6EE7E2]', label: 'Fértil' },
            { color: 'bg-[#00A699]', label: 'Ovulação' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
              <span className="text-xs text-gray-600 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pregnancy probability */}
      <div className="mx-4 anim-3">
        <div className={`rounded-2xl px-4 py-4 ${probConfig.bg}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Chance de engravidar
            </p>
            <span className={`text-sm font-bold ${probConfig.color}`}>{probConfig.label}</span>
          </div>
          <div className="h-2 bg-white/60 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${probConfig.bar}`} />
          </div>
        </div>
      </div>

      {/* Next period info */}
      {prediction.nextPeriodStart && (
        <div className="mx-4 mt-3">
          <div className="rounded-2xl px-4 py-4 bg-[#FFF5F7]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#FF385C] uppercase tracking-wide mb-0.5">
                  Próximo período
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {prediction.nextPeriodStart.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                </p>
              </div>
              {prediction.ovulationDate && (
                <div className="text-right">
                  <p className="text-xs font-semibold text-[#00A699] uppercase tracking-wide mb-0.5">
                    Ovulação
                  </p>
                  <p className="text-base font-bold text-gray-700">
                    {prediction.ovulationDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
