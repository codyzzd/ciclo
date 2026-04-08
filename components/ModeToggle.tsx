'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDroplet, faHeart } from '@fortawesome/free-solid-svg-icons'

export type CalendarMode = 'period' | 'sex'

interface Props {
  mode: CalendarMode
  onChange: (mode: CalendarMode) => void
}

export function ModeToggle({ mode, onChange }: Props) {
  return (
    <div className="flex bg-white">
      <button
        onClick={() => onChange('period')}
        className={`flex-1 flex items-center justify-center gap-2 py-3 transition-all ${
          mode === 'period'
            ? 'text-[#FF385C] shadow-[inset_0_2px_0_#FF385C]'
            : 'text-gray-500 shadow-[inset_0_1px_0_#EBEBEB]'
        }`}
      >
        <FontAwesomeIcon icon={faDroplet} className="w-4 h-4" />
        <span className="text-sm font-semibold">Menstruação</span>
      </button>

      <button
        onClick={() => onChange('sex')}
        className={`flex-1 flex items-center justify-center gap-2 py-3 transition-all ${
          mode === 'sex'
            ? 'text-[#7C3AED] shadow-[inset_0_2px_0_#7C3AED]'
            : 'text-gray-500 shadow-[inset_0_1px_0_#EBEBEB]'
        }`}
      >
        <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
        <span className="text-sm font-semibold">Relação</span>
      </button>
    </div>
  )
}
