'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Profile, CycleDay, Intensidade } from '@/types'
import { calculatePredictions } from '@/lib/cycle-logic'
import { createClient } from '@/lib/supabase/client'

const CURRENT_PROFILE_KEY = 'ciclo_current_profile'

export function useCycleData() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null)
  const [allDays, setAllDays] = useState<CycleDay[]>([])
  const [mounted, setMounted] = useState(false)

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

      const saved = localStorage.getItem(CURRENT_PROFILE_KEY)
      if (saved && loadedProfiles.find(p => p.id === saved)) {
        setCurrentProfileId(saved)
      } else if (loadedProfiles.length > 0) {
        setCurrentProfileId(loadedProfiles[0].id)
      }

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
      localStorage.setItem(CURRENT_PROFILE_KEY, newProfile.id)
    }
    void run()
    // Retorna um placeholder síncrono para compatibilidade com ProfileManager
    return { id: '', nome, created_at: new Date().toISOString() } as Profile
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Deletar perfil ──────────────────────────────────────────
  const deleteProfile = useCallback((id: string) => {
    setProfiles(prev => {
      const updated = prev.filter(p => p.id !== id)
      if (currentProfileId === id) {
        const next = updated[0]?.id ?? null
        setCurrentProfileId(next)
        if (next) localStorage.setItem(CURRENT_PROFILE_KEY, next)
        else localStorage.removeItem(CURRENT_PROFILE_KEY)
      }
      return updated
    })
    setAllDays(prev => prev.filter(d => d.profile_id !== id))
    void supabase.from('profiles').delete().eq('id', id)
  }, [currentProfileId]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Upsert day (interno) ────────────────────────────────────
  function upsertDay(date: string, patch: Partial<CycleDay>) {
    if (!currentProfileId) return

    setAllDays(prev => {
      const existing = prev.find(d => d.profile_id === currentProfileId && d.date === date)
      let updated: CycleDay[]

      if (existing) {
        const merged: CycleDay = { ...existing, ...patch }
        if (!merged.menstruou && !merged.sexo) {
          updated = prev.filter(d => !(d.profile_id === currentProfileId && d.date === date))
          void supabase.from('cycle_days').delete()
            .eq('profile_id', currentProfileId).eq('date', date)
        } else {
          updated = prev.map(d =>
            d.profile_id === currentProfileId && d.date === date ? merged : d
          )
          void supabase.from('cycle_days')
            .upsert({
              profile_id: currentProfileId,
              date,
              menstruou: merged.menstruou,
              intensidade: merged.intensidade ?? null,
              sexo: merged.sexo,
            }, { onConflict: 'profile_id,date' })
        }
      } else {
        const newDay: CycleDay = {
          id: crypto.randomUUID(),
          profile_id: currentProfileId,
          date,
          menstruou: false,
          intensidade: null,
          sexo: false,
          ...patch,
        }
        if (newDay.menstruou || newDay.sexo) {
          updated = [...prev, newDay]
          void supabase.from('cycle_days')
            .upsert({
              profile_id: currentProfileId,
              date,
              menstruou: newDay.menstruou,
              intensidade: newDay.intensidade ?? null,
              sexo: newDay.sexo,
            }, { onConflict: 'profile_id,date' })
        } else {
          updated = prev
        }
      }

      return updated
    })
  }

  // ── Toggle menstruou ────────────────────────────────────────
  const toggleMenstruou = useCallback((date: string) => {
    if (!currentProfileId) return
    setAllDays(prev => {
      const existing = prev.find(d => d.profile_id === currentProfileId && d.date === date)
      const wasOn = existing?.menstruou ?? false
      const patch: Partial<CycleDay> = { menstruou: !wasOn, intensidade: wasOn ? null : existing?.intensidade ?? null }

      let updated: CycleDay[]
      if (existing) {
        const merged = { ...existing, ...patch }
        if (!merged.menstruou && !merged.sexo) {
          updated = prev.filter(d => !(d.profile_id === currentProfileId && d.date === date))
          void supabase.from('cycle_days').delete()
            .eq('profile_id', currentProfileId).eq('date', date)
        } else {
          updated = prev.map(d =>
            d.profile_id === currentProfileId && d.date === date ? merged : d
          )
          void supabase.from('cycle_days')
            .upsert({ profile_id: currentProfileId, date, menstruou: merged.menstruou, intensidade: merged.intensidade ?? null, sexo: merged.sexo }, { onConflict: 'profile_id,date' })
        }
      } else {
        const newDay: CycleDay = { id: crypto.randomUUID(), profile_id: currentProfileId, date, menstruou: true, intensidade: null, sexo: false }
        updated = [...prev, newDay]
        void supabase.from('cycle_days')
          .upsert({ profile_id: currentProfileId, date, menstruou: true, intensidade: null, sexo: false }, { onConflict: 'profile_id,date' })
      }
      return updated
    })
  }, [currentProfileId]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Toggle sexo ─────────────────────────────────────────────
  const toggleSexo = useCallback((date: string) => {
    if (!currentProfileId) return
    setAllDays(prev => {
      const existing = prev.find(d => d.profile_id === currentProfileId && d.date === date)
      const wasOn = existing?.sexo ?? false

      let updated: CycleDay[]
      if (existing) {
        const merged = { ...existing, sexo: !wasOn }
        if (!merged.menstruou && !merged.sexo) {
          updated = prev.filter(d => !(d.profile_id === currentProfileId && d.date === date))
          void supabase.from('cycle_days').delete()
            .eq('profile_id', currentProfileId).eq('date', date)
        } else {
          updated = prev.map(d =>
            d.profile_id === currentProfileId && d.date === date ? merged : d
          )
          void supabase.from('cycle_days')
            .upsert({ profile_id: currentProfileId, date, menstruou: merged.menstruou, intensidade: merged.intensidade ?? null, sexo: merged.sexo }, { onConflict: 'profile_id,date' })
        }
      } else {
        const newDay: CycleDay = { id: crypto.randomUUID(), profile_id: currentProfileId, date, menstruou: false, intensidade: null, sexo: true }
        updated = [...prev, newDay]
        void supabase.from('cycle_days')
          .upsert({ profile_id: currentProfileId, date, menstruou: false, intensidade: null, sexo: true }, { onConflict: 'profile_id,date' })
      }
      return updated
    })
  }, [currentProfileId]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Set intensidade ─────────────────────────────────────────
  const setIntensidade = useCallback((date: string, intensidade: Intensidade | null) => {
    if (!currentProfileId) return
    upsertDay(date, { menstruou: true, intensidade })
  }, [currentProfileId]) // eslint-disable-line react-hooks/exhaustive-deps

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
