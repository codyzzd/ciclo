'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Profile } from '@/types'

interface Props {
  open: boolean
  profiles: Profile[]
  currentProfileId: string | null
  onSwitch: (id: string) => void
  onCreate: (nome: string) => void
  onDelete: (id: string) => void
  onClose: () => void
}

export function ProfileManager({ open, profiles, currentProfileId, onSwitch, onCreate, onDelete, onClose }: Props) {
  const [creating, setCreating] = useState(false)
  const [nome, setNome] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  function handleCreate() {
    const trimmed = nome.trim()
    if (!trimmed) return
    onCreate(trimmed)
    setNome('')
    setCreating(false)
    onClose()
  }

  function handleSelect(id: string) {
    onSwitch(id)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-[#222222]">Perfis</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-2">
          {profiles.map(p => (
            <div key={p.id} className="flex items-center gap-2">
              <button
                onClick={() => handleSelect(p.id)}
                className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left ${
                  p.id === currentProfileId
                    ? 'bg-[#FFF0F2] border-2 border-[#FF385C]'
                    : 'bg-[#F7F7F7] border-2 border-transparent hover:bg-[#F7F7F7]'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-[#FFF0F2] flex items-center justify-center text-[#FF385C] text-sm font-bold">
                  {p.nome[0].toUpperCase()}
                </div>
                <span className="font-medium text-gray-800">{p.nome}</span>
                {p.id === currentProfileId && (
                  <span className="ml-auto text-xs text-[#FF385C]">✓</span>
                )}
              </button>

              {profiles.length > 1 && (
                <button
                  onClick={() => setConfirmDelete(confirmDelete === p.id ? null : p.id)}
                  className="p-2 rounded-xl text-gray-300 hover:text-red-400 transition-colors text-sm"
                >
                  {confirmDelete === p.id ? (
                    <span
                      onClick={(e) => { e.stopPropagation(); onDelete(p.id); setConfirmDelete(null) }}
                      className="text-red-500 text-xs font-medium px-1"
                    >
                      Confirmar
                    </span>
                  ) : '✕'}
                </button>
              )}
            </div>
          ))}

          {creating ? (
            <div className="flex gap-2 mt-2">
              <input
                autoFocus
                value={nome}
                onChange={e => setNome(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                placeholder="Nome do perfil"
                className="flex-1 px-4 py-3 rounded-2xl border-2 border-[#EBEBEB] outline-none focus:border-[#FF385C] text-sm bg-white"
              />
              <Button onClick={handleCreate} className="rounded-2xl bg-[#FF385C] hover:bg-[#E31C5F] text-white px-4">
                OK
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="mt-2 py-3 rounded-2xl border-2 border-dashed border-[#EBEBEB] text-[#FF385C] text-sm font-medium hover:border-[#FF385C] transition-colors"
            >
              + Novo perfil
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
