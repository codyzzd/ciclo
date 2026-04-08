'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Profile, CycleDay, Intensidade } from '@/types'
import { calculatePredictions } from '@/lib/cycle-logic'
import { createClient } from '@/lib/supabase/client'

const CURRENT_PROFILE_KEY = 'ciclo_current_profile'

export function useCycleData() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null)
  const [allDays, setAllDays] = useState<CycleDay[]>([])
  const [mounted, setMounted] = useState(false)

  // Ref para ler allDays de forma síncrona sem causar re-renders
  const allDaysRef = useRef(allDays)
  useEffect(() => { allDaysRef.current = allDays }, [allDays])

  const currentProfileIdRef = useRef(currentProfileId)
  useEffect(() => { currentProfileIdRef.current = currentProfileId }, [currentProfileId])

  const supabase = createClient()

  // ── Carregamento inicial ────────────────────────────────────
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setMounted(true); return }

      const [{ data: ps }, { data: ds }] = await Promise.all([
        supabase.from('profiles').select('id, nome, created_at').order('created_at'),
        supabase.from('cycle_days').select('id, profile_id, date, menstruou, intensidade, sexo'),
      ])

      const loadedProfiles: Profile[] = ps ?? []
      const loadedDays: CycleDay[] = (ds ?? []).map(d => ({
        ...d,
        date: d.date as string,
        intensidade: d.intensidade as Intensidade | null,
        sexo: d.sexo ?? false,
      }))

      setProfiles(loadedProfiles)
      setAllDays(loadedDays)
      allDaysRef.current = loadedDays

      const saved = localStorage.getItem(CURRENT_PROFILE_KEY)
      const nextId = (saved && loadedProfiles.find(p => p.id === saved))
        ? saved
        : loadedProfiles[0]?.id ?? null
      setCurrentProfileId(nextId)
      currentProfileIdRef.current = nextId

      setMounted(true)
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const currentProfile = profiles.find(p => p.id === currentProfileId) ?? null
  const profileDays = allDays.filter(d => d.profile_id === currentProfileId)
  const markedDates = profileDays.filter(d => d.menstruou).map(d => d.date)
  const prediction = calculatePredictions(markedDates)

  // ── Navegação de perfil ─────────────────────────────────────
  const switchProfile = useCallback((id: string) => {
    setCurrentProfileId(id)
    currentProfileIdRef.current = id
    localStorage.setItem(CURRENT_PROFILE_KEY, id)
  }, [])

  // ── Criar perfil ────────────────────────────────────────────
  const createProfile = useCallback((nome: string) => {
    async function run() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .insert({ nome, user_id: user.id })
        .select('id, nome, created_at')
        .single()

      if (error || !data) return

      const newProfile: Profile = data
      setProfiles(prev => [...prev, newProfile])
      setCurrentProfileId(newProfile.id)
      currentProfileIdRef.current = newProfile.id
      localStorage.setItem(CURRENT_PROFILE_KEY, newProfile.id)
    }
    void run()
    return { id: '', nome, created_at: new Date().toISOString() } as Profile
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Deletar perfil ──────────────────────────────────────────
  const deleteProfile = useCallback((id: string) => {
    const updatedProfiles = profiles.filter(p => p.id !== id)
    const updatedDays = allDaysRef.current.filter(d => d.profile_id !== id)

    setProfiles(updatedProfiles)
    setAllDays(updatedDays)
    allDaysRef.current = updatedDays

    if (currentProfileIdRef.current === id) {
      const next = updatedProfiles[0]?.id ?? null
      setCurrentProfileId(next)
      currentProfileIdRef.current = next
      if (next) localStorage.setItem(CURRENT_PROFILE_KEY, next)
      else localStorage.removeItem(CURRENT_PROFILE_KEY)
    }

    void supabase.from('profiles').delete().eq('id', id)
  }, [profiles]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Upsert day (interno) ────────────────────────────────────
  const upsertDay = useCallback((date: string, patch: Partial<CycleDay>) => {
    const profileId = currentProfileIdRef.current
    if (!profileId) return

    const days = allDaysRef.current
    const existing = days.find(d => d.profile_id === profileId && d.date === date)

    let updated: CycleDay[]

    if (existing) {
      const merged: CycleDay = { ...existing, ...patch }
      if (!merged.menstruou && !merged.sexo) {
        updated = days.filter(d => !(d.profile_id === profileId && d.date === date))
        void supabase.from('cycle_days').delete()
          .eq('profile_id', profileId).eq('date', date)
      } else {
        updated = days.map(d =>
          d.profile_id === profileId && d.date === date ? merged : d
        )
        void supabase.from('cycle_days').upsert(
          { profile_id: profileId, date, menstruou: merged.menstruou, intensidade: merged.intensidade ?? null, sexo: merged.sexo },
          { onConflict: 'profile_id,date' }
        )
      }
    } else {
      const newDay: CycleDay = {
        id: crypto.randomUUID(),
        profile_id: profileId,
        date,
        menstruou: false,
        intensidade: null,
        sexo: false,
        ...patch,
      }
      if (newDay.menstruou || newDay.sexo) {
        updated = [...days, newDay]
        void supabase.from('cycle_days').upsert(
          { profile_id: profileId, date, menstruou: newDay.menstruou, intensidade: newDay.intensidade ?? null, sexo: newDay.sexo },
          { onConflict: 'profile_id,date' }
        )
      } else {
        updated = days
      }
    }

    setAllDays(updated)
    allDaysRef.current = updated
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Toggle menstruou ────────────────────────────────────────
  const toggleMenstruou = useCallback((date: string) => {
    const profileId = currentProfileIdRef.current
    if (!profileId) return
    const existing = allDaysRef.current.find(d => d.profile_id === profileId && d.date === date)
    const wasOn = existing?.menstruou ?? false
    upsertDay(date, { menstruou: !wasOn, intensidade: wasOn ? null : existing?.intensidade ?? null })
  }, [upsertDay])

  // ── Toggle sexo ─────────────────────────────────────────────
  const toggleSexo = useCallback((date: string) => {
    const profileId = currentProfileIdRef.current
    if (!profileId) return
    const existing = allDaysRef.current.find(d => d.profile_id === profileId && d.date === date)
    upsertDay(date, { sexo: !(existing?.sexo ?? false) })
  }, [upsertDay])

  // ── Set intensidade ─────────────────────────────────────────
  const setIntensidade = useCallback((date: string, intensidade: Intensidade | null) => {
    upsertDay(date, { menstruou: true, intensidade })
  }, [upsertDay])

  // ── Get day data ────────────────────────────────────────────
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
    toggleDay: toggleMenstruou,
    toggleMenstruou,
    toggleSexo,
    setIntensidade,
    getDayData,
  }
}
