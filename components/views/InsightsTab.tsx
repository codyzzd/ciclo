'use client'

import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartBar } from '@fortawesome/free-solid-svg-icons'
import { getCycleInsights } from '@/lib/insights-logic'

interface Props {
  markedDates: string[]
  profileName: string | null
}

export function InsightsTab({ markedDates, profileName }: Props) {
  const insights = getCycleInsights(markedDates)

  if (!insights.hasEnoughData) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF0F2] flex items-center justify-center">
          <FontAwesomeIcon icon={faChartBar} className="w-7 h-7 text-[#FF385C]" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Poucos dados ainda</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Registre pelo menos 2 ciclos completos para ver seus insights
          </p>
        </div>
      </div>
    )
  }

  const { cycleLengths, averageCycle, variation, variationLabel, trend, delayProbability, confidence } = insights

  const chartData = cycleLengths.map((len, i) => ({ ciclo: `C${i + 1}`, dias: len }))

  const trendConfig = {
    estável:     { icon: '→', color: 'text-gray-600' },
    encurtando:  { icon: '↓', color: 'text-[#F59E0B]' },
    aumentando:  { icon: '↑', color: 'text-[#00A699]' },
  }[trend ?? 'estável']

  const varConfig = {
    regular:   { color: 'text-[#00A699]', bg: 'bg-[#E6F7F6]' },
    moderado:  { color: 'text-[#F59E0B]', bg: 'bg-[#FFFBEB]' },
    irregular: { color: 'text-[#FF385C]', bg: 'bg-[#FFF0F2]' },
  }[variationLabel ?? 'regular']

  return (
    <div className="flex flex-col bg-white pb-6">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
          {profileName ?? 'Perfil'}
        </p>
        <h1 className="text-xl font-bold text-gray-900">Insights do ciclo</h1>
      </div>

      {/* Cards grid */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-6 anim-1">

        {/* Ciclo médio */}
        <div className="rounded-2xl bg-[#FFF0F2] px-4 py-4">
          <p className="text-[10px] font-semibold text-[#FF385C] uppercase tracking-wide mb-1">Ciclo médio</p>
          <p className="text-3xl font-bold text-gray-900">{averageCycle}</p>
          <p className="text-xs text-gray-600">dias</p>
        </div>

        {/* Variação */}
        <div className={`rounded-2xl px-4 py-4 ${varConfig.bg}`}>
          <p className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${varConfig.color}`}>Variação</p>
          <p className="text-3xl font-bold text-gray-900">±{variation}</p>
          <p className={`text-xs font-medium ${varConfig.color}`}>{variationLabel}</p>
        </div>

        {/* Tendência */}
        <div className="rounded-2xl bg-[#F7F7F7] px-4 py-4">
          <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1">Tendência</p>
          <p className={`text-2xl font-bold ${trendConfig.color}`}>{trendConfig.icon}</p>
          <p className="text-xs text-gray-700 font-medium capitalize">{trend}</p>
        </div>

        {/* Prob. atraso */}
        <div className="rounded-2xl bg-[#F7F7F7] px-4 py-4">
          <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1">Prob. atraso</p>
          <p className="text-3xl font-bold text-gray-900">{delayProbability}%</p>
          <p className="text-xs text-gray-600">chance</p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="px-4 mb-6 anim-2">
        <div className="rounded-2xl bg-[#F7F7F7] px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Confiabilidade</p>
            <span className="text-sm font-bold text-gray-900">{confidence}%</span>
          </div>
          <div className="h-2 bg-[#EBEBEB] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[#FF385C] transition-all"
              style={{ width: `${confidence}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-1.5">
            Baseado em {cycleLengths.length} {cycleLengths.length === 1 ? 'ciclo' : 'ciclos'} registrados
          </p>
        </div>
      </div>

      {/* Line chart - histórico */}
      <div className="px-4 mb-6 anim-3">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Histórico de ciclos</p>
        <div className="rounded-2xl bg-[#F7F7F7] p-4">
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="ciclo" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                formatter={(v) => [`${v} dias`, 'Duração']}
              />
              <ReferenceLine y={averageCycle ?? 0} stroke="#FF385C" strokeDasharray="4 4" strokeWidth={1.5} />
              <Line
                type="monotone"
                dataKey="dias"
                stroke="#FF385C"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#FF385C', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-gray-500 text-center mt-1">linha tracejada = média</p>
        </div>
      </div>

      {/* Bar chart - variação */}
      <div className="px-4 mb-4">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Duração por ciclo</p>
        <div className="rounded-2xl bg-[#F7F7F7] p-4">
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="ciclo" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                formatter={(v) => [`${v} dias`, 'Duração']}
              />
              <Bar dataKey="dias" fill="#FF385C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
