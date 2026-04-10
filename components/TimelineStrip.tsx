'use client'

import { useState } from 'react'

// Cores exatas do Figma — não mapeiam para classes Tailwind padrão
const PHASE_COLORS: Record<string, string> = {
  period:    '#f43f5e', // rose/500
  predicted: '#fecdd3', // rose/200
  fertile:   '#5eead4', // teal/300
  ovulation: '#14b8a6', // teal/500
  normal:    '#e2e8f0', // slate/200
}

interface StripDay {
  dateStr: string
  isToday: boolean
  phase: keyof typeof PHASE_COLORS
}

interface Props {
  days: StripDay[]
}

function toDateNum(ds: string) {
  return new Date(ds + 'T12:00:00').getDate()
}

function toWeekLetter(ds: string) {
  return new Date(ds + 'T12:00:00')
    .toLocaleDateString('pt-BR', { weekday: 'short' })
    .charAt(0)
    .toUpperCase()
}

export function TimelineStrip({ days }: Props) {
  const [showWeekday, setShowWeekday] = useState(false)

  return (
    <div
      className="rounded-[8px] bg-white border border-slate-200 px-4 pt-4 pb-4 cursor-pointer select-none"
      onClick={() => setShowWeekday(v => !v)}
    >
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Timeline</p>

      {/* Labels row */}
      <div className="flex mb-1.5">
        {days.map(({ dateStr, isToday }) => (
          <div key={dateStr} className="flex-1 flex justify-center">
            <span className={`text-[10px] font-semibold ${isToday ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>
              {showWeekday ? toWeekLetter(dateStr) : toDateNum(dateStr)}
            </span>
          </div>
        ))}
      </div>

      {/* Pills row */}
      <div className="flex gap-1.5">
        {days.map(({ dateStr, isToday, phase }) => (
          <div
            key={dateStr}
            className={`flex-1 h-2 rounded-full transition-colors ${
              isToday ? 'ring-2 ring-slate-700 ring-offset-1' : ''
            }`}
            style={{ backgroundColor: PHASE_COLORS[phase] }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-3 mt-3 flex-wrap">
        {[
          { color: PHASE_COLORS.period,    label: 'Período' },
          { color: PHASE_COLORS.predicted, label: 'Previsão' },
          { color: PHASE_COLORS.fertile,   label: 'Fértil' },
          { color: PHASE_COLORS.ovulation, label: 'Ovulação' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[10px] text-slate-500 font-bold">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
