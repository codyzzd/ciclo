'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
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
    <header className="flex items-center gap-3 px-4 py-3 bg-white border-b border-[#EBEBEB]">

      {/* Avatar circular */}
      <button
        onClick={onOpenManager}
        className="w-9 h-9 rounded-full bg-[#FFF0F2] flex items-center justify-center flex-shrink-0 active:scale-95 transition-all"
      >
        <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-[#FF385C]" />
      </button>

      {/* Nome */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onOpenManager}>
        <p className="font-bold text-gray-900 text-base leading-tight truncate">
          {profile?.nome ?? 'Criar perfil'}
        </p>
        <p className="text-xs text-gray-500 leading-tight">Toque para gerenciar perfis</p>
      </div>

      {/* Botão sair circular */}
      <button
        onClick={handleLogout}
        className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 hover:bg-gray-200 active:scale-95 transition-all"
        aria-label="Sair"
      >
        <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-4 h-4 text-gray-600" />
      </button>
    </header>
  )
}
