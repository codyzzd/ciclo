'use client'

export type AppTab = 'home' | 'calendar' | 'insights'

interface Props {
  active: AppTab
  onChange: (tab: AppTab) => void
}

export function BottomNav({ active, onChange }: Props) {
  const tabs: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      label: 'Início',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
          <path d="M9 21V12h6v9" />
        </svg>
      ),
    },
    {
      id: 'calendar',
      label: 'Calendário',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      ),
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 19h4v-8H3zM10 19h4V5h-4zM17 19h4v-5h-4z" />
        </svg>
      ),
    },
  ]

  return (
    <nav className="bg-white border-t border-[#EBEBEB] pb-safe">
      <div className="flex w-full">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
              active === tab.id ? 'text-[#FF385C]' : 'text-gray-500'
            }`}
          >
            {tab.icon}
            <span className="text-[11px] font-medium leading-none">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
