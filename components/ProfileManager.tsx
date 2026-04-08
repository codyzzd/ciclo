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
  onRename: (id: string, nome: string) => void
  onDelete: (id: string) => void
  onClose: () => void
}

export function ProfileManager({ open, profiles, currentProfileId, onSwitch, onCreate, onRename, onDelete, onClose }: Props) {
  const [creating, setCreating] = useState(false)
  const [nome, setNome] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingNome, setEditingNome] = useState('')
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

  function startEdit(p: Profile) {
    setEditingId(p.id)
    setEditingNome(p.nome)
    setConfirmDelete(null)
  }

  function confirmEdit(id: string) {
    const trimmed = editingNome.trim()
    if (trimmed) onRename(id, trimmed)
    setEditingId(null)
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
              {editingId === p.id ? (
                /* Modo edição */
                <div className="flex-1 flex gap-2">
                  <input
                    autoFocus
                    value={editingNome}
                    onChange={e => setEditingNome(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') confirmEdit(p.id)
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    className="flex-1 px-4 py-4 rounded-2xl border-2 border-[#FF385C] outline-none text-base bg-white"
                  />
                  <Button
                    onClick={() => confirmEdit(p.id)}
                    className="rounded-2xl bg-[#FF385C] hover:bg-[#E31C5F] text-white px-4"
                  >
                    OK
                  </Button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-2 rounded-2xl text-gray-400 hover:text-gray-600 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                /* Modo normal */
                <>
                  <button
                    onClick={() => handleSelect(p.id)}
                    className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left ${
                      p.id === currentProfileId
                        ? 'bg-[#FFF0F2] border-2 border-[#FF385C]'
                        : 'bg-[#F7F7F7] border-2 border-transparent hover:bg-[#F0F0F0]'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-[#FFF0F2] flex items-center justify-center text-[#FF385C] text-sm font-bold flex-shrink-0">
                      {p.nome[0].toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-800 truncate">{p.nome}</span>
                    {p.id === currentProfileId && (
                      <span className="ml-auto text-xs text-[#FF385C]">✓</span>
                    )}
                  </button>

                  {/* Botão renomear */}
                  <button
                    onClick={() => startEdit(p)}
                    className="p-2 rounded-xl text-gray-300 hover:text-gray-500 transition-colors"
                    title="Renomear"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>

                  {/* Botão deletar (só se tiver mais de 1 perfil) */}
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
                </>
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
                className="flex-1 px-4 py-4 rounded-2xl border-2 border-[#EBEBEB] outline-none focus:border-[#FF385C] text-base bg-white"
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
