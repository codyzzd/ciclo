'use client'

import { useState } from 'react'
import { CalendarView } from '@/components/CalendarView'
import { IntensityPicker } from '@/components/IntensityPicker'
import type { CalendarMode } from '@/components/ModeToggle'
import type { CyclePrediction, CycleDay } from '@/types'

interface Props {
  mode: CalendarMode
  prediction: CyclePrediction
  markedDates: string[]
  getDayData: (date: string) => CycleDay | null
  toggleMenstruou: (date: string) => void
  toggleSexo: (date: string) => void
  setIntensidade: (date: string, i: import('@/types').Intensidade | null) => void
  currentProfileId: string | null
  onOpenManager: () => void
}

export function CalendarTab({
  mode,
  prediction,
  markedDates,
  getDayData,
  toggleMenstruou,
  toggleSexo,
  setIntensidade,
  currentProfileId,
  onOpenManager,
}: Props) {
  const [intensityDate, setIntensityDate] = useState<string | null>(null)

  function handleDayPress(date: string) {
    if (!currentProfileId) { onOpenManager(); return }
    if (mode === 'period') toggleMenstruou(date)
    else toggleSexo(date)
  }

  function handleLongPress(date: string) {
    if (!currentProfileId) return
    if (mode === 'period' && getDayData(date)?.menstruou) {
      setIntensityDate(date)
    }
  }

  return (
    <div className="pb-28 anim-1">
      <CalendarView
        mode={mode}
        prediction={prediction}
        markedDates={markedDates}
        getDayData={getDayData}
        onDayPress={handleDayPress}
        onLongPress={handleLongPress}
      />

      <IntensityPicker
        open={intensityDate !== null}
        date={intensityDate}
        current={intensityDate ? getDayData(intensityDate)?.intensidade ?? null : null}
        onSelect={(i) => { if (intensityDate) setIntensidade(intensityDate, i); setIntensityDate(null) }}
        onClose={() => setIntensityDate(null)}
      />
    </div>
  )
}
