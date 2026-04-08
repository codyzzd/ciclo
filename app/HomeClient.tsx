'use client'

import { useState } from 'react'
import { useCycleData } from '@/hooks/useCycleData'
import { ProfileHeader } from '@/components/ProfileHeader'
import { ProfileManager } from '@/components/ProfileManager'
import { BottomNav, type AppTab } from '@/components/BottomNav'
import { ModeToggle, type CalendarMode } from '@/components/ModeToggle'
import { HomeTab } from '@/components/views/HomeTab'
import { CalendarTab } from '@/components/views/CalendarTab'
import { InsightsTab } from '@/components/views/InsightsTab'

export function HomeClient() {
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
  const [tab, setTab] = useState<AppTab>('home')
  const [calendarMode, setCalendarMode] = useState<CalendarMode>('period')

  if (!mounted) {
    return (
      <div className="h-dvh flex flex-col bg-white w-full max-w-md mx-auto">
        {/* Header skeleton */}
        <div className="flex-shrink-0 px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <div className="w-9 h-9 rounded-full bg-[#F3F4F6] animate-pulse" />
          <div className="w-28 h-4 rounded-full bg-[#F3F4F6] animate-pulse" />
          <div className="w-9 h-9 rounded-full bg-[#F3F4F6] animate-pulse" />
        </div>

        {/* Conteúdo skeleton */}
        <div className="flex-1 flex flex-col items-center px-4 pt-6 gap-6">
          {/* Orb */}
          <div className="w-full h-[200px] rounded-3xl bg-[#FFF0F2] animate-pulse" />
          {/* Strip */}
          <div className="w-full flex gap-2 justify-center">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex-1 h-3 rounded-full bg-[#F3F4F6] animate-pulse" />
            ))}
          </div>
          {/* Cards */}
          <div className="w-full h-16 rounded-2xl bg-[#F3F4F6] animate-pulse" />
          <div className="w-full h-16 rounded-2xl bg-[#FFF0F2] animate-pulse" />
        </div>

        {/* Navbar skeleton */}
        <div className="flex-shrink-0 flex border-t border-gray-100 py-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#F3F4F6] animate-pulse" />
              <div className="w-10 h-2 rounded-full bg-[#F3F4F6] animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (profiles.length === 0) {
    return (
      <div className="h-dvh bg-white flex flex-col items-center justify-center px-8 gap-6">
        <div className="text-6xl">🩷</div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bem-vinda ao Meu Ciclo</h1>
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
    <div className="h-dvh flex flex-col bg-white w-full max-w-md mx-auto">

      {/* Header — nunca scrollar */}
      <div className="flex-shrink-0 z-20 anim-1">
        <ProfileHeader
          profile={currentProfile}
          onOpenManager={() => setShowManager(true)}
        />
      </div>

      {/* Conteúdo — scroll isolado */}
      <div className="flex-1 overflow-y-auto overscroll-contain overflow-x-hidden">
        {tab === 'home' && (
          <HomeTab prediction={prediction} markedDates={markedDates} />
        )}
        {tab === 'calendar' && (
          <CalendarTab
            mode={calendarMode}
            prediction={prediction}
            markedDates={markedDates}
            getDayData={getDayData}
            toggleMenstruou={toggleMenstruou}
            toggleSexo={toggleSexo}
            setIntensidade={setIntensidade}
            currentProfileId={currentProfileId}
            onOpenManager={() => setShowManager(true)}
          />
        )}
        {tab === 'insights' && (
          <InsightsTab
            markedDates={markedDates}
            profileName={currentProfile?.nome ?? null}
          />
        )}
      </div>

      {/* ModeToggle — grudado acima do navbar, só no calendário */}
      {tab === 'calendar' && (
        <div className="flex-shrink-0">
          <ModeToggle mode={calendarMode} onChange={setCalendarMode} />
        </div>
      )}

      {/* Navbar — nunca scrollar */}
      <div className="flex-shrink-0 z-30">
        <BottomNav active={tab} onChange={setTab} />
      </div>

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
