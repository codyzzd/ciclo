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
      <SheetContent side="bottom" className="rounded-t-2xl pb-10">
        <div className="mx-auto mt-2 mb-1 w-10 h-1 rounded-full bg-[#EBEBEB]" />
        <SheetHeader className="mb-6">
          <SheetTitle className="text-center text-[#222222]">Intensidade do fluxo</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-3 px-2">
          {OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onSelect(opt.value); onClose() }}
              className={`flex items-center justify-between px-4 py-4 rounded-2xl border-2 transition-all ${
                current === opt.value
                  ? 'border-[#FF385C] bg-[#FFF0F2]'
                  : 'border-transparent bg-[#F7F7F7] hover:bg-[#F7F7F7]'
              }`}
            >
              <span className="text-base font-medium text-gray-700">{opt.label}</span>
              <span className="text-[#FF385C] text-xl tracking-wider">
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
