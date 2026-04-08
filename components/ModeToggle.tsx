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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
      <div className="flex rounded-2xl overflow-hidden shadow-xl shadow-black/10 border border-white/60 bg-white">

        {/* Period mode */}
        <button
          onClick={() => onChange('period')}
          className={`flex items-center gap-2.5 px-5 py-3.5 transition-all duration-200 ${
            mode === 'period'
              ? 'bg-[#c2185b] text-white'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
          }`}
        >
          <FontAwesomeIcon
            icon={faDroplet}
            className="w-4 h-4"
          />
          <span className="text-sm font-semibold">Menstruação</span>
        </button>

        {/* Divider */}
        <div className="w-px bg-gray-200 self-stretch" />

        {/* Sex mode */}
        <button
          onClick={() => onChange('sex')}
          className={`flex items-center gap-2.5 px-5 py-3.5 transition-all duration-200 ${
            mode === 'sex'
              ? 'bg-[#ad1457] text-white'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
          }`}
        >
          <FontAwesomeIcon
            icon={faHeart}
            className="w-4 h-4"
          />
          <span className="text-sm font-semibold">Relação</span>
        </button>

      </div>
    </div>
  )
}
