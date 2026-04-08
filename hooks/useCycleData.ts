'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Profile, CycleDay, Intensidade } from '@/types'
import { calculatePredictions } from '@/lib/cycle-logic'

const STORAGE_KEY_PROFILES = 'ciclo_profiles'
const STORAGE_KEY_DAYS = 'ciclo_days'

function loadProfiles(): Profile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function loadDays(): CycleDay[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DAYS)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveProfiles(profiles: Profile[]) {
  localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles))
}

function saveDays(days: CycleDay[]) {
  localStorage.setItem(STORAGE_KEY_DAYS, JSON.stringify(days))
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function useCycleData() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null)
  const [allDays, setAllDays] = useState<CycleDay[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const ps = loadProfiles()
    const ds = loadDays()
    setProfiles(ps)
    setAllDays(ds)

    const savedCurrent = localStorage.getItem('ciclo_current_profile')
    if (savedCurrent && ps.find(p => p.id === savedCurrent)) {
      setCurrentProfileId(savedCurrent)
    } else if (ps.length > 0) {
      setCurrentProfileId(ps[0].id)
    }
    setMounted(true)
  }, [])

  const currentProfile = profiles.find(p => p.id === currentProfileId) ?? null

  const profileDays = allDays.filter(d => d.profile_id === currentProfileId)
  const markedDates = profileDays.filter(d => d.menstruou).map(d => d.date)
  const prediction = calculatePredictions(markedDates)

  const switchProfile = useCallback((id: string) => {
    setCurrentProfileId(id)
    localStorage.setItem('ciclo_current_profile', id)
  }, [])

  const createProfile = useCallback((nome: string) => {
    const newProfile: Profile = {
      id: generateId(),
      nome,
      created_at: new Date().toISOString(),
    }
    const updated = [...loadProfiles(), newProfile]
    saveProfiles(updated)
    setProfiles(updated)
    setCurrentProfileId(newProfile.id)
    localStorage.setItem('ciclo_current_profile', newProfile.id)
    return newProfile
  }, [])

  const deleteProfile = useCallback((id: string) => {
    const ps = loadProfiles().filter(p => p.id !== id)
    const ds = loadDays().filter(d => d.profile_id !== id)
    saveProfiles(ps)
    saveDays(ds)
    setProfiles(ps)
    setAllDays(ds)
    if (currentProfileId === id) {
      const next = ps[0]?.id ?? null
      setCurrentProfileId(next)
      if (next) localStorage.setItem('ciclo_current_profile', next)
      else localStorage.removeItem('ciclo_current_profile')
    }
  }, [currentProfileId])

  function upsertDay(date: string, patch: Partial<CycleDay>): CycleDay[] {
    const ds = loadDays()
    const existing = ds.find(d => d.profile_id === currentProfileId && d.date === date)
    let updated: CycleDay[]
    if (existing) {
      const merged = { ...existing, ...patch }
      // Remove record only if nothing is marked
      if (!merged.menstruou && !merged.sexo) {
        updated = ds.filter(d => !(d.profile_id === currentProfileId && d.date === date))
      } else {
        updated = ds.map(d => d.profile_id === currentProfileId && d.date === date ? merged : d)
      }
    } else {
      const newDay: CycleDay = {
        id: generateId(),
        profile_id: currentProfileId!,
        date,
        menstruou: false,
        intensidade: null,
        sexo: false,
        ...patch,
      }
      updated = [...ds, newDay]
    }
    saveDays(updated)
    setAllDays(updated)
    return updated
  }

  const toggleMenstruou = useCallback((date: string) => {
    if (!currentProfileId) return
    const ds = loadDays()
    const existing = ds.find(d => d.profile_id === currentProfileId && d.date === date)
    upsertDay(date, { menstruou: !existing?.menstruou, intensidade: existing?.menstruou ? null : existing?.intensidade ?? null })
  }, [currentProfileId]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSexo = useCallback((date: string) => {
    if (!currentProfileId) return
    const ds = loadDays()
    const existing = ds.find(d => d.profile_id === currentProfileId && d.date === date)
    upsertDay(date, { sexo: !existing?.sexo })
  }, [currentProfileId]) // eslint-disable-line react-hooks/exhaustive-deps

  // kept for compat
  const toggleDay = toggleMenstruou

  const setIntensidade = useCallback((date: string, intensidade: Intensidade | null) => {
    if (!currentProfileId) return
    const ds = loadDays()
    const existing = ds.find(d => d.profile_id === currentProfileId && d.date === date)

    let updated: CycleDay[]
    if (existing) {
      updated = ds.map(d =>
        d.profile_id === currentProfileId && d.date === date
          ? { ...d, intensidade }
          : d
      )
    } else {
      const newDay: CycleDay = {
        id: generateId(),
        profile_id: currentProfileId,
        date,
        menstruou: true,
        intensidade,
        sexo: false,
      }
      updated = [...ds, newDay]
    }
    saveDays(updated)
    setAllDays(updated)
  }, [currentProfileId])

  const getDayData = useCallback((date: string): CycleDay | null => {
    return allDays.find(d => d.profile_id === currentProfileId && d.date === date) ?? null
  }, [allDays, currentProfileId])

  return {
    mounted,
    profiles,
    currentProfile,
    currentProfileId,
    prediction,
    markedDates,
    switchProfile,
    createProfile,
    deleteProfile,
    toggleDay,
    toggleMenstruou,
    toggleSexo,
    setIntensidade,
    getDayData,
  }
}
