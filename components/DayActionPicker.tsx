'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { CycleDay, Intensidade } from '@/types'

interface Props {
  open: boolean
  date: string | null
  dayData: CycleDay | null
  onToggleMenstruou: () => void
  onToggleSexo: () => void
  onSetIntensidade: (i: Intensidade) => void
  onClose: () => void
}

const INTENSIDADES: { value: Intensidade; label: string; emoji: string }[] = [
  { value: 'leve', label: 'Leve', emoji: '🩸' },
  { value: 'medio', label: 'Médio', emoji: '🩸🩸' },
  { value: 'intenso', label: 'Intenso', emoji: '🩸🩸🩸' },
]

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}

export function DayActionPicker({ open, date, dayData, onToggleMenstruou, onToggleSexo, onSetIntensidade, onClose }: Props) {
  const hasPeriod = dayData?.menstruou ?? false
  const hasSexo = dayData?.sexo ?? false
  const intensidade = dayData?.intensidade ?? null

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-3xl pb-10">
        <SheetHeader className="mb-5">
          <SheetTitle className="text-center text-gray-700 text-base font-semibold capitalize">
            {date ? formatDate(date) : ''}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-3 px-2">

          {/* Menstruação toggle */}
          <button
            onClick={onToggleMenstruou}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all active:scale-95 ${
              hasPeriod
                ? 'border-[#c2185b] bg-[#fce4ec]'
                : 'border-transparent bg-[#fafafa] hover:bg-[#fce4ec]/40'
            }`}
          >
            <span className="text-2xl">🩸</span>
            <div className="flex-1 text-left">
              <p className={`font-semibold ${hasPeriod ? 'text-[#c2185b]' : 'text-gray-700'}`}>
                Menstruação
              </p>
              {hasPeriod && (
                <p className="text-xs text-[#c2185b]/70">Toque para remover</p>
              )}
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              hasPeriod ? 'bg-[#c2185b] border-[#c2185b]' : 'border-gray-300'
            }`}>
              {hasPeriod && <span className="text-white text-xs">✓</span>}
            </div>
          </button>

          {/* Intensity selector — shows inline when period is active */}
          {hasPeriod && (
            <div className="flex gap-2 px-1">
              {INTENSIDADES.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => onSetIntensidade(opt.value)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all active:scale-95 ${
                    intensidade === opt.value
                      ? 'bg-[#c2185b] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-[#fce4ec]'
                  }`}
                >
                  <div className="text-base mb-0.5">{opt.emoji.split('').slice(-1)}</div>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Sexo toggle */}
          <button
            onClick={onToggleSexo}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all active:scale-95 ${
              hasSexo
                ? 'border-[#e91e8c] bg-[#fce4ec]'
                : 'border-transparent bg-[#fafafa] hover:bg-[#fce4ec]/40'
            }`}
          >
            <span className="text-2xl">💕</span>
            <div className="flex-1 text-left">
              <p className={`font-semibold ${hasSexo ? 'text-[#ad1457]' : 'text-gray-700'}`}>
                Relação sexual
              </p>
              {hasSexo && (
                <p className="text-xs text-[#ad1457]/70">Toque para remover</p>
              )}
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              hasSexo ? 'bg-[#ad1457] border-[#ad1457]' : 'border-gray-300'
            }`}>
              {hasSexo && <span className="text-white text-xs">✓</span>}
            </div>
          </button>

        </div>
      </SheetContent>
    </Sheet>
  )
}
