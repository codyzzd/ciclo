'use client'

export type CardInfoColor = 'rose' | 'teal'

interface Props {
  title: string
  value: string
  color?: CardInfoColor
}

export function CardInfo({ title, value, color = 'rose' }: Props) {
  const labelColor = color === 'rose' ? 'text-rose-600' : 'text-teal-600'

  return (
    <div className="flex-1 rounded-[8px] bg-white border border-slate-200 p-4">
      <p className={`text-[11px] font-bold uppercase tracking-[0.88px] leading-4 mb-1 ${labelColor}`}>
        {title}
      </p>
      <p className="text-base font-semibold text-slate-600 leading-6">
        {value}
      </p>
    </div>
  )
}
