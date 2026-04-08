'use client'

import type { Profile } from '@/types'

interface Props {
  profile: Profile | null
  onOpenManager: () => void
}

export function ProfileHeader({ profile, onOpenManager }: Props) {
  return (
    <header className="flex items-center gap-3 px-4 py-4 bg-white/80 backdrop-blur-sm border-b border-[#f8bbd0]/40">
      <button
        onClick={onOpenManager}
        className="w-11 h-11 rounded-full bg-[#fce4ec] flex items-center justify-center text-[#c2185b] flex-shrink-0 active:scale-95 transition-transform"
      >
        {profile ? (
          <span className="text-base font-bold">{profile.nome[0].toUpperCase()}</span>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0" onClick={onOpenManager}>
        <p className="font-bold text-gray-900 text-base leading-tight truncate">
          {profile?.nome ?? 'Criar perfil'}
        </p>
        <p className="text-xs text-gray-400 leading-tight">Toque para gerenciar perfis</p>
      </div>
    </header>
  )
}
