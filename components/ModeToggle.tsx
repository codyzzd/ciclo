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
    <div className="fixed bottom-[90px] left-1/2 -translate-x-1/2 z-30">
      <div className="flex rounded-full overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.12)] border border-[#EBEBEB] bg-white p-1 gap-1">

        {/* Period mode */}
        <button
          onClick={() => onChange('period')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-full transition-all duration-200 ${
            mode === 'period'
              ? 'bg-gradient-to-r from-[#FF385C] to-[#E31C5F] text-white'
              : 'text-gray-400 hover:text-gray-600 hover:bg-[#F7F7F7]'
          }`}
        >
          <FontAwesomeIcon icon={faDroplet} className="w-4 h-4" />
          <span className="text-sm font-semibold">Menstruação</span>
        </button>

        {/* Sex mode */}
        <button
          onClick={() => onChange('sex')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-full transition-all duration-200 ${
            mode === 'sex'
              ? 'bg-[#7C3AED] text-white'
              : 'text-gray-400 hover:text-gray-600 hover:bg-[#F7F7F7]'
          }`}
        >
          <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
          <span className="text-sm font-semibold">Relação</span>
        </button>

      </div>
    </div>
  )
}
