'use client'

export type PregnancyChance = 'improvável' | 'baixa' | 'possível' | 'certo' | 'alta'

const LEVELS: Record<PregnancyChance, { label: string; filled: number; filledColor: string }> = {
  improvável: { label: 'Improvável', filled: 1, filledColor: 'bg-rose-100' },
  baixa:      { label: 'Baixa',      filled: 2, filledColor: 'bg-rose-200' },
  possível:   { label: 'Possível',   filled: 3, filledColor: 'bg-rose-300' },
  certo:      { label: 'Certo',      filled: 4, filledColor: 'bg-rose-400' },
  alta:       { label: 'Alta',       filled: 5, filledColor: 'bg-rose-500' },
}

interface Props {
  chance: PregnancyChance
}

export function PregnancyChanceCard({ chance }: Props) {
  const { label, filled, filledColor } = LEVELS[chance]

  return (
    <div className="rounded-[8px] px-4 py-4 border border-slate-200 bg-white">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Chance de engravidar
        </p>
        <span className="text-sm font-bold text-slate-500">{label}</span>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-full transition-colors ${
              i < filled ? filledColor : 'bg-slate-100'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
