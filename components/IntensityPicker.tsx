'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { Intensidade } from '@/types'

interface Props {
  open: boolean
  date: string | null
  current: Intensidade | null
  onSelect: (intensidade: Intensidade | null) => void
  onClose: () => void
}

const OPTIONS: { value: Intensidade; label: string; drops: number }[] = [
  { value: 'leve', label: 'Leve', drops: 1 },
  { value: 'medio', label: 'Médio', drops: 2 },
  { value: 'intenso', label: 'Intenso', drops: 3 },
]

export function IntensityPicker({ open, date, current, onSelect, onClose }: Props) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-3xl pb-10">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-center text-[#c2185b]">Intensidade do fluxo</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-3 px-2">
          {OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onSelect(opt.value); onClose() }}
              className={`flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all ${
                current === opt.value
                  ? 'border-[#c2185b] bg-[#fce4ec]'
                  : 'border-transparent bg-[#fafafa] hover:bg-[#fce4ec]/50'
              }`}
            >
              <span className="text-base font-medium text-gray-700">{opt.label}</span>
              <span className="text-[#c2185b] text-xl tracking-wider">
                {'🩸'.repeat(opt.drops)}
              </span>
            </button>
          ))}

          {current && (
            <button
              onClick={() => { onSelect(null); onClose() }}
              className="mt-2 py-3 rounded-2xl text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Remover marcação
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
