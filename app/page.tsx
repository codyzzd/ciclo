'use client'

import { useState } from 'react'
import { useCycleData } from '@/hooks/useCycleData'
import { ProfileHeader } from '@/components/ProfileHeader'
import { CalendarView } from '@/components/CalendarView'
import { ProfileManager } from '@/components/ProfileManager'
import { IntensityPicker } from '@/components/IntensityPicker'
import { ModeToggle, type CalendarMode } from '@/components/ModeToggle'

export default function Home() {
  const {
    mounted,
    profiles,
    currentProfile,
    currentProfileId,
    prediction,
    markedDates,
    switchProfile,
    createProfile,
    renameProfile,
    deleteProfile,
    toggleMenstruou,
    toggleSexo,
    setIntensidade,
    getDayData,
  } = useCycleData()

  const [showManager, setShowManager] = useState(false)
  const [mode, setMode] = useState<CalendarMode>('period')
  const [intensityDate, setIntensityDate] = useState<string | null>(null)

  function handleDayPress(date: string) {
    if (!currentProfileId) { setShowManager(true); return }
    if (mode === 'period') toggleMenstruou(date)
    else toggleSexo(date)
  }

  function handleLongPress(date: string) {
    if (!currentProfileId) return
    // Long press on period mode opens intensity for period days
    if (mode === 'period' && getDayData(date)?.menstruou) {
      setIntensityDate(date)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#c2185b] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (profiles.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8 gap-6">
        <div className="text-6xl">🩷</div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bem-vinda ao Ciclo</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Acompanhe seu ciclo menstrual de forma simples e inteligente
          </p>
        </div>
        <button
          onClick={() => setShowManager(true)}
          className="w-full max-w-xs bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold py-4 rounded-full active:scale-95 transition-all"
        >
          Criar perfil
        </button>
        <ProfileManager
          open={showManager}
          profiles={profiles}
          currentProfileId={currentProfileId}
          onSwitch={switchProfile}
          onCreate={createProfile}
          onRename={renameProfile}
          onDelete={deleteProfile}
          onClose={() => setShowManager(false)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto">

        {/* Sticky top block: header + prediction banner */}
        <div className="sticky top-0 z-20">
          <ProfileHeader
            profile={currentProfile}
            onOpenManager={() => setShowManager(true)}
          />

          {prediction.nextPeriodStart && (
            <div className="bg-white border-b border-[#EBEBEB] px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] text-[#FF385C] font-semibold uppercase tracking-wide leading-none mb-0.5">
                  Próximo período
                </p>
                <p className="text-xl font-bold text-gray-900 leading-tight">
                  {prediction.nextPeriodStart.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                </p>
                {prediction.cyclesDetected === 1 && (
                  <p className="text-xs text-[#717171] mt-0.5">Ciclo estimado de {prediction.averageCycleLength ?? 28} dias</p>
                )}
              </div>
              {prediction.ovulationDate && (
                <div className="text-right flex-shrink-0">
                  <p className="text-[11px] text-[#00A699] font-semibold uppercase tracking-wide leading-none mb-0.5">
                    Ovulação
                  </p>
                  <p className="text-base font-bold text-gray-700 leading-tight">
                    {prediction.ovulationDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <main className="pb-32">
          <CalendarView
            mode={mode}
            prediction={prediction}
            markedDates={markedDates}
            getDayData={getDayData}
            onDayPress={handleDayPress}
            onLongPress={handleLongPress}
          />
        </main>

        <ModeToggle mode={mode} onChange={setMode} />

        <ProfileManager
          open={showManager}
          profiles={profiles}
          currentProfileId={currentProfileId}
          onSwitch={switchProfile}
          onCreate={createProfile}
          onRename={renameProfile}
          onDelete={deleteProfile}
          onClose={() => setShowManager(false)}
        />
        <IntensityPicker
          open={intensityDate !== null}
          date={intensityDate}
          current={intensityDate ? getDayData(intensityDate)?.intensidade ?? null : null}
          onSelect={(i) => { if (intensityDate) setIntensidade(intensityDate, i); setIntensityDate(null) }}
          onClose={() => setIntensityDate(null)}
        />
      </div>
    </div>
  )
}
