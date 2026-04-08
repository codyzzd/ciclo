'use client'

import type { Profile } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Props {
  profile: Profile | null
  onOpenManager: () => void
}

export function ProfileHeader({ profile, onOpenManager }: Props) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="flex items-center gap-3 px-4 py-4 bg-white/80 backdrop-blur-sm border-b border-[#EBEBEB]">
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onOpenManager}>
        <p className="font-bold text-gray-900 text-base leading-tight truncate">
          {profile?.nome ?? 'Criar perfil'}
        </p>
        <p className="text-xs text-[#717171] leading-tight">Toque para gerenciar perfis</p>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 text-xs font-medium text-[#717171] hover:text-gray-900 active:scale-95 transition-all px-2 py-1.5 rounded-lg hover:bg-gray-100"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Sair
      </button>
    </header>
  )
}
