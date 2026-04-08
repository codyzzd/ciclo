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
      <h2 className="text-center font-bold text-gray-900 text-lg mb-4">
        {MONTHS_PT[month]} {year}
      </h2>

      <div className="grid grid-cols-7 mb-2">
        {WEEK_DAYS.map(d => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
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
            if (intensity === 'leve')        cellClass = 'bg-[#e57399]'
            else if (intensity === 'intenso') cellClass = 'bg-[#880e4f]'
            else                              cellClass = 'bg-[#c2185b]'
            numberClass = 'text-white font-bold'
          } else if (mode === 'sex' && hasSexo) {
            cellClass = 'bg-[#880e4f]/20 ring-2 ring-[#ad1457]/40'
            numberClass = 'text-[#ad1457] font-bold'
          } else if (isPredicted && (isCurrentMonth || mode === 'sex')) {
            cellClass = 'bg-[#fce4ec]'
            numberClass = 'text-[#c2185b] font-semibold'
          } else if (isOvulation && isCurrentMonth) {
            cellClass = 'bg-[#80cbc4] ring-2 ring-[#26a69a]'
            numberClass = 'text-[#004d40] font-bold'
          } else if (isFertile && isCurrentMonth) {
            cellClass = 'bg-[#e0f2f1]'
            numberClass = 'text-[#00695c] font-semibold'
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
                  ${isToday && !cellClass ? 'ring-2 ring-[#c2185b]/30' : ''}
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
                    <FontAwesomeIcon icon={faDroplet} className="w-2.5 h-2.5 text-[#c2185b]" />
                  )}
                  {!isPeriod && !isPredicted && isFertile && isCurrentMonth && (
                    <FontAwesomeIcon icon={faSeedling} className="w-2.5 h-2.5 text-[#00897b]" />
                  )}
                  {!isPeriod && !isPredicted && isOvulation && isCurrentMonth && (
                    <FontAwesomeIcon icon={faCircleOutline} className="w-2.5 h-2.5 text-[#00695c]" />
                  )}
                  {mode === 'sex' && hasSexo && !isPeriod && (
                    <FontAwesomeIcon icon={faHeart} className="w-2.5 h-2.5 text-[#ad1457]" />
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
