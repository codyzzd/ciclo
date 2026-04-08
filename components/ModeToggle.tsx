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
    <div className="flex border-t border-[#EBEBEB] bg-white">
      <button
        onClick={() => onChange('period')}
        className={`flex-1 flex items-center justify-center gap-2 py-3 transition-all ${
          mode === 'period'
            ? 'text-[#FF385C] border-t-2 border-[#FF385C] -mt-px'
            : 'text-gray-500'
        }`}
      >
        <FontAwesomeIcon icon={faDroplet} className="w-4 h-4" />
        <span className="text-sm font-semibold">Menstruação</span>
      </button>

      <button
        onClick={() => onChange('sex')}
        className={`flex-1 flex items-center justify-center gap-2 py-3 transition-all ${
          mode === 'sex'
            ? 'text-[#7C3AED] border-t-2 border-[#7C3AED] -mt-px'
            : 'text-gray-500'
        }`}
      >
        <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
        <span className="text-sm font-semibold">Relação</span>
      </button>
    </div>
  )
}
