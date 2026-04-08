'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CalendarMonth } from './CalendarMonth'
import type { CyclePrediction, CycleDay } from '@/types'
import type { CalendarMode } from './ModeToggle'

interface Props {
  mode: CalendarMode
  prediction: CyclePrediction
  markedDates: string[]
  getDayData: (date: string) => CycleDay | null
  onDayPress: (date: string) => void
  onLongPress: (date: string) => void
}

export function CalendarView({ mode, prediction, markedDates, getDayData, onDayPress, onLongPress }: Props) {
  const today = new Date()
  const [offset, setOffset] = useState(0) // offset in months from current

  const firstYear = today.getFullYear()
  const firstMonth = today.getMonth() + offset
  const normalizedFirst = new Date(firstYear, firstMonth, 1)
  const normalizedSecond = new Date(firstYear, firstMonth + 1, 1)

  const y1 = normalizedFirst.getFullYear()
  const m1 = normalizedFirst.getMonth()
  const y2 = normalizedSecond.getFullYear()
  const m2 = normalizedSecond.getMonth()

  return (
    <div className="flex flex-col">
      {/* Navigation */}
      <div className="flex items-center justify-between px-6 py-3">
        <button
          onClick={() => setOffset(o => o - 1)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-[#F7F7F7] active:scale-90 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setOffset(0)}
          className="text-sm font-medium text-gray-600 hover:text-[#FF385C] transition-colors px-3 py-1 rounded-full hover:bg-[#F7F7F7]"
        >
          Hoje
        </button>
        <button
          onClick={() => setOffset(o => o + 1)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-[#F7F7F7] active:scale-90 transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Two months */}
      <CalendarMonth
        year={y1} month={m1}
        mode={mode}
        prediction={prediction}
        markedDates={markedDates}
        getDayData={getDayData}
        onDayPress={onDayPress}
        onLongPress={onLongPress}
      />
      <CalendarMonth
        year={y2} month={m2}
        mode={mode}
        prediction={prediction}
        markedDates={markedDates}
        getDayData={getDayData}
        onDayPress={onDayPress}
        onLongPress={onLongPress}
      />

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 px-4 py-4 flex-wrap">
        <LegendItem color="bg-[#FF385C]" label="Período" />
        <LegendItem color="bg-[#FFF0F2] border border-[#FFB3C0]" label="Previsão" />
        <LegendItem color="bg-[#E6F7F6] border border-[#00A699]" label="Fértil" icon="♡" iconColor="text-[#007A73]" />
        <LegendItem color="bg-[#00A699] border border-[#007A73]" label="Ovulação" icon="○" iconColor="text-white" />
      </div>

      {prediction.cyclesDetected === 0 && (
        <div className="mx-4 mb-6 p-4 rounded-2xl bg-[#F7F7F7] text-center">
          <p className="text-sm text-[#717171]">
            Toque nos dias para registrar sua menstruação
          </p>
        </div>
      )}

      {prediction.cyclesDetected >= 2 && prediction.averageCycleLength && (
        <p className="text-center text-xs text-[#717171] mb-6">
          Ciclo médio: {prediction.averageCycleLength} dias · {prediction.cyclesDetected} ciclos detectados
        </p>
      )}
    </div>
  )
}

function LegendItem({ color, label, icon, iconColor }: { color: string; label: string; icon?: string; iconColor?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-5 h-5 rounded-full ${color} flex items-center justify-center`}>
        {icon && <span className={`text-[9px] ${iconColor ?? 'text-[#007A73]'}`}>{icon}</span>}
      </div>
      <span className="text-xs text-[#717171]">{label}</span>
    </div>
  )
}
