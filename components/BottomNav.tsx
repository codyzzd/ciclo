'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faCalendarDays, faChartBar } from '@fortawesome/free-solid-svg-icons'
import {
  faHouse as faHouseReg,
  faCalendarDays as faCalendarReg,
  faChartBar as faChartBarReg,
} from '@fortawesome/free-regular-svg-icons'

export type AppTab = 'home' | 'calendar' | 'insights'

interface Props {
  active: AppTab
  onChange: (tab: AppTab) => void
}

const TABS: { id: AppTab; label: string; solid: typeof faHouse; regular: typeof faHouseReg }[] = [
  { id: 'home',      label: 'Início',     solid: faHouse,         regular: faHouseReg      },
  { id: 'calendar',  label: 'Calendário', solid: faCalendarDays,  regular: faCalendarReg   },
  { id: 'insights',  label: 'Insights',   solid: faChartBar,      regular: faChartBarReg   },
]

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="bg-white border-t border-slate-200 pb-safe">
      <div className="flex w-full">
        {TABS.map(tab => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 transition-colors ${
                isActive ? 'text-rose-600' : 'text-slate-400'
              }`}
            >
              <FontAwesomeIcon icon={isActive ? tab.solid : tab.regular} className="w-[18px] h-[18px]" />
              <span className="text-[12px] font-bold leading-4">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
