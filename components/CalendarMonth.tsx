'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDroplet, faHeart, faSeedling, faCircle } from '@fortawesome/free-solid-svg-icons'
import { faCircle as faCircleOutline } from '@fortawesome/free-regular-svg-icons'
import type { CyclePrediction, CycleDay } from '@/types'
import type { CalendarMode } from './ModeToggle'

const WEEK_DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

function toDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

interface CalendarDay {
  date: Date
  dateStr: string
  isCurrentMonth: boolean
}

function buildCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startOffset = (firstDay.getDay() + 6) % 7

  const days: CalendarDay[] = []
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    days.push({ date: d, dateStr: toDateStr(d), isCurrentMonth: false })
  }
  for (let n = 1; n <= lastDay.getDate(); n++) {
    const d = new Date(year, month, n)
    days.push({ date: d, dateStr: toDateStr(d), isCurrentMonth: true })
  }
  const remaining = 7 - (days.length % 7)
  if (remaining < 7) {
    for (let n = 1; n <= remaining; n++) {
      const d = new Date(year, month + 1, n)
      days.push({ date: d, dateStr: toDateStr(d), isCurrentMonth: false })
    }
  }
  return days
}

interface Props {
  year: number
  month: number
  mode: CalendarMode
  prediction: CyclePrediction
  markedDates: string[]
  getDayData: (date: string) => CycleDay | null
  onDayPress: (date: string) => void
  onLongPress: (date: string) => void
}

const todayStr = toDateStr(new Date())

export function CalendarMonth({ year, month, mode, prediction, markedDates, getDayData, onDayPress, onLongPress }: Props) {
  const markedSet = new Set(markedDates)
  const days = buildCalendarDays(year, month)

  return (
    <div className="px-4 pb-6">
      <h2 className="text-center font-bold text-[#222222] text-xl mb-4">
        {MONTHS_PT[month]} {year}
      </h2>

      <div className="grid grid-cols-7 mb-2">
        {WEEK_DAYS.map(d => (
          <div key={d} className="text-center text-xs font-medium text-[#717171] py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {days.map(({ date, dateStr, isCurrentMonth }) => {
          const isPeriod = markedSet.has(dateStr)
          const isPredicted = prediction.predictedPeriodDays.has(dateStr)
          const isFertile = prediction.fertileDays.has(dateStr)
          const isOvulation = prediction.ovulationDays.has(dateStr)
          const isToday = dateStr === todayStr
          const dayData = getDayData(dateStr)
          const hasSexo = dayData?.sexo ?? false
          const isOtherMonth = !isCurrentMonth

          // --- Cell background & text color ---
          let cellClass = ''
          let numberClass = ''

          if (isPeriod) {
            const intensity = dayData?.intensidade
            if (intensity === 'leve')        cellClass = 'bg-[#FF7699]'
            else if (intensity === 'intenso') cellClass = 'bg-[#C2185B]'
            else                              cellClass = 'bg-[#FF385C]'
            numberClass = 'text-white font-bold'
          } else if (mode === 'sex' && hasSexo) {
            cellClass = 'bg-[#F5F3FF] ring-2 ring-[#7C3AED]/30'
            numberClass = 'text-[#7C3AED] font-bold'
          } else if (isPredicted && (isCurrentMonth || mode === 'sex')) {
            cellClass = 'bg-[#FFF0F2]'
            numberClass = 'text-[#FF385C] font-semibold'
          } else if (isOvulation && isCurrentMonth) {
            cellClass = 'bg-[#00A699] ring-2 ring-[#007A73]'
            numberClass = 'text-white font-bold'
          } else if (isFertile && isCurrentMonth) {
            cellClass = 'bg-[#E6F7F6]'
            numberClass = 'text-[#007A73] font-semibold'
          }

          const isFuture = dateStr > todayStr

          // --- Long press (for intensity) ---
          let pressTimer: ReturnType<typeof setTimeout> | null = null
          let didLong = false

          const onPressStart = () => {
            if (isFuture) return
            didLong = false
            pressTimer = setTimeout(() => {
              didLong = true
              onLongPress(dateStr)
            }, 500)
          }
          const onPressEnd = () => {
            if (pressTimer) clearTimeout(pressTimer)
            if (!didLong && !isFuture) onDayPress(dateStr)
          }
          const onPressCancel = () => {
            if (pressTimer) clearTimeout(pressTimer)
            didLong = false
          }

          return (
            <div key={dateStr} className="flex justify-center py-0.5">
              <button
                onMouseDown={onPressStart}
                onMouseUp={onPressEnd}
                onMouseLeave={onPressCancel}
                onTouchStart={(e) => { e.preventDefault(); onPressStart() }}
                onTouchEnd={(e) => { e.preventDefault(); onPressEnd() }}
                onTouchCancel={onPressCancel}
                className={`
                  relative w-10 h-12 rounded-xl flex flex-col items-center justify-center
                  transition-all duration-150 select-none
                  ${isFuture ? 'cursor-default' : 'active:scale-90'}
                  ${cellClass}
                  ${isToday && !cellClass ? 'ring-2 ring-[#FF385C]/40' : ''}
                  ${isOtherMonth && mode !== 'sex' ? 'opacity-25' : ''}
                  ${isFuture && !isOtherMonth ? 'opacity-35' : ''}
                `}
              >
                <span className={`text-sm leading-none ${numberClass || (isOtherMonth && mode !== 'sex' ? 'text-gray-400' : 'text-gray-800')}`}>
                  {date.getDate()}
                </span>

                {/* Primary icon row */}
                <span className="mt-0.5 flex items-center gap-0.5">
                  {isPeriod && (
                    <FontAwesomeIcon icon={faDroplet} className="w-2.5 h-2.5 text-white" />
                  )}
                  {!isPeriod && isPredicted && isCurrentMonth && (
                    <FontAwesomeIcon icon={faDroplet} className="w-2.5 h-2.5 text-[#FF385C]" />
                  )}
                  {!isPeriod && !isPredicted && isFertile && isCurrentMonth && (
                    <FontAwesomeIcon icon={faSeedling} className="w-2.5 h-2.5 text-[#00A699]" />
                  )}
                  {!isPeriod && !isPredicted && isOvulation && isCurrentMonth && (
                    <FontAwesomeIcon icon={faCircleOutline} className="w-2.5 h-2.5 text-white" />
                  )}
                  {mode === 'sex' && hasSexo && (
                    <FontAwesomeIcon icon={faHeart} className={`w-2.5 h-2.5 ${isPeriod ? 'text-white/80' : 'text-[#7C3AED]'}`} />
                  )}
                </span>

              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
