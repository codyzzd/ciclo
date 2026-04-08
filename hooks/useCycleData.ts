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

  // Instância estável — não recriada a cada render
  const supabase = useRef(createClient()).current

  // Refs para leitura síncrona sem triggering re-renders
  const profilesRef = useRef<Profile[]>([])
  const allDaysRef = useRef<CycleDay[]>([])
  const currentProfileIdRef = useRef<string | null>(null)

  function syncProfiles(ps: Profile[]) {
    profilesRef.current = ps
    setProfiles(ps)
  }
  function syncDays(ds: CycleDay[]) {
    allDaysRef.current = ds
    setAllDays(ds)
  }
  function syncCurrentId(id: string | null) {
    currentProfileIdRef.current = id
    setCurrentProfileId(id)
    if (id) localStorage.setItem(CURRENT_PROFILE_KEY, id)
    else localStorage.removeItem(CURRENT_PROFILE_KEY)
  }

  // ── Carregamento inicial ────────────────────────────────────
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setMounted(true); return }

      const [{ data: ps, error: psErr }, { data: ds, error: dsErr }] = await Promise.all([
        supabase.from('profiles').select('id, nome, created_at').order('created_at'),
        supabase.from('cycle_days').select('id, profile_id, date, menstruou, intensidade, sexo'),
      ])

      if (psErr) console.error('Erro ao carregar perfis:', psErr)
      if (dsErr) console.error('Erro ao carregar dias:', dsErr)

      const loadedProfiles: Profile[] = ps ?? []
      const loadedDays: CycleDay[] = (ds ?? []).map(d => ({
        ...d,
        date: d.date as string,
        intensidade: d.intensidade as Intensidade | null,
        sexo: d.sexo ?? false,
      }))

      syncProfiles(loadedProfiles)
      syncDays(loadedDays)

      const saved = localStorage.getItem(CURRENT_PROFILE_KEY)
      const nextId = (saved && loadedProfiles.find(p => p.id === saved))
        ? saved
        : loadedProfiles[0]?.id ?? null
      syncCurrentId(nextId)

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
    syncCurrentId(id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Criar perfil (otimístico) ───────────────────────────────
  const createProfile = useCallback((nome: string) => {
    async function run() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const tempId = crypto.randomUUID()
      const tempProfile: Profile = { id: tempId, nome, created_at: new Date().toISOString() }

      syncProfiles([...profilesRef.current, tempProfile])
      syncCurrentId(tempId)

      const { data, error } = await supabase
        .from('profiles')
        .insert({ id: tempId, nome, user_id: user.id })
        .select('id, nome, created_at')
        .single()

      if (error) {
        console.error('Erro ao criar perfil:', error)
        syncProfiles(profilesRef.current.filter(p => p.id !== tempId))
        syncCurrentId(profilesRef.current[0]?.id ?? null)
        return
      }

      if (data) {
        syncProfiles(profilesRef.current.map(p => p.id === tempId ? data : p))
      }
    }
    void run()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Renomear perfil ─────────────────────────────────────────
  const renameProfile = useCallback((id: string, nome: string) => {
    const snapshot = profilesRef.current
    syncProfiles(snapshot.map(p => p.id === id ? { ...p, nome } : p))

    supabase.from('profiles').update({ nome }).eq('id', id).then(({ error }) => {
      if (error) {
        console.error('Erro ao renomear perfil:', error)
        syncProfiles(snapshot)
      }
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Deletar perfil ──────────────────────────────────────────
  const deleteProfile = useCallback((id: string) => {
    const snapshotProfiles = profilesRef.current
    const snapshotDays = allDaysRef.current
    const updatedProfiles = snapshotProfiles.filter(p => p.id !== id)

    syncProfiles(updatedProfiles)
    syncDays(snapshotDays.filter(d => d.profile_id !== id))

    if (currentProfileIdRef.current === id) {
      syncCurrentId(updatedProfiles[0]?.id ?? null)
    }

    supabase.from('profiles').delete().eq('id', id).then(({ error }) => {
      if (error) {
        console.error('Erro ao deletar perfil:', error)
        syncProfiles(snapshotProfiles)
        syncDays(snapshotDays)
        if (currentProfileIdRef.current !== id) syncCurrentId(id)
      }
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Upsert day ──────────────────────────────────────────────
  const upsertDay = useCallback((date: string, patch: Partial<CycleDay>) => {
    const profileId = currentProfileIdRef.current
    if (!profileId) return

    const days = allDaysRef.current
    const existing = days.find(d => d.profile_id === profileId && d.date === date)
    const snapshotDays = days

    async function persist(nextDays: CycleDay[]) {
      syncDays(nextDays)

      let error: unknown = null

      if (existing) {
        const merged = { ...existing, ...patch }
        if (!merged.menstruou && !merged.sexo) {
          const res = await supabase.from('cycle_days').delete()
            .eq('profile_id', profileId).eq('date', date)
          error = res.error
        } else {
          const res = await supabase.from('cycle_days').upsert(
            { profile_id: profileId, date, menstruou: merged.menstruou, intensidade: merged.intensidade ?? null, sexo: merged.sexo },
            { onConflict: 'profile_id,date' }
          )
          error = res.error
        }
      } else {
        const newDay = { ...{ menstruou: false, intensidade: null, sexo: false }, ...patch }
        const res = await supabase.from('cycle_days').upsert(
          { profile_id: profileId, date, menstruou: newDay.menstruou, intensidade: newDay.intensidade ?? null, sexo: newDay.sexo },
          { onConflict: 'profile_id,date' }
        )
        error = res.error
      }

      if (error) {
        console.error('Erro ao salvar dia:', error)
        syncDays(snapshotDays)
      }
    }

    if (existing) {
      const merged: CycleDay = { ...existing, ...patch }
      if (!merged.menstruou && !merged.sexo) {
        void persist(days.filter(d => !(d.profile_id === profileId && d.date === date)))
      } else {
        void persist(days.map(d => d.profile_id === profileId && d.date === date ? merged : d))
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
      if (!newDay.menstruou && !newDay.sexo) return
      void persist([...days, newDay])
    }
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
    renameProfile,
    deleteProfile,
    toggleDay: toggleMenstruou,
    toggleMenstruou,
    toggleSexo,
    setIntensidade,
    getDayData,
  }
}
