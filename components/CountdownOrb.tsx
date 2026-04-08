'use client'

import { useMemo } from 'react'

interface Props {
  daysUntil: number | null
  avgCycle: number
}

const SIZE = 320
const CX = SIZE / 2
const CY = SIZE / 2
const CIRCLE_R = 88
const STEP = 30
const RANGE = 4
const MIN_DIST = CIRCLE_R + 10
const MAX_DIST = 186

export function CountdownOrb({ daysUntil, avgCycle }: Props) {
  // 0 = início do ciclo, 1 = período hoje
  const progress = daysUntil !== null
    ? Math.max(0, Math.min(1, (avgCycle - Math.max(0, daysUntil)) / avgCycle))
    : 0

  const dots = useMemo(() => {
    const result: {
      x: number; y: number
      ndx: number; ndy: number
      closeness: number
      r: number; amplitude: number; duration: number; delay: number
    }[] = []

    for (let i = -RANGE; i <= RANGE; i++) {
      for (let j = -RANGE; j <= RANGE; j++) {
        const x = CX + i * STEP
        const y = CY + j * STEP
        const dx = x - CX
        const dy = y - CY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MIN_DIST || dist > MAX_DIST) continue

        const ndx = dx / dist
        const ndy = dy / dist
        const closeness = 1 - (dist - MIN_DIST) / (MAX_DIST - MIN_DIST)
        const r = 2.5 + closeness * 1.5
        const amplitude = 3 + closeness * 5
        const duration = 2 + (1 - closeness) * 1.5
        const delay = ((Math.atan2(dy, dx) + Math.PI) / (2 * Math.PI)) * 2.5

        result.push({ x, y, ndx, ndy, closeness, r, amplitude, duration, delay })
      }
    }
    return result
  }, [])

  // Interpolação: cinza (#E5E7EB) → vermelho (#FF385C)
  function dotColor(closeness: number): string {
    const t = Math.min(1, Math.max(0, progress * (closeness * 2 + 0.05)))
    const r = Math.round(229 + (255 - 229) * t)
    const g = Math.round(231 + (56  - 231) * t)
    const b = Math.round(235 + (92  - 235) * t)
    return `rgb(${r},${g},${b})`
  }

  const isLate = daysUntil !== null && daysUntil < 0
  const countLabel =
    daysUntil === null ? '—'
    : daysUntil === 0  ? 'Hoje'
    : String(Math.abs(daysUntil))

  // Duas linhas para caber dentro do círculo sem overflow
  const sublabelLines: [string, string?] =
    daysUntil === null ? ['REGISTRE', 'SEUS CICLOS']
    : daysUntil === 0  ? ['PERÍODO', 'ESPERADO HOJE']
    : isLate           ? ['DIAS DE', 'ATRASO']
    :                    ['DIAS PARA', 'O PERÍODO']

  const numFontSize = daysUntil === null || daysUntil === 0 ? 28
    : Math.abs(daysUntil) >= 10 ? 54 : 66

  const numY   = daysUntil === null || daysUntil === 0 ? CY - 8  : CY - 16
  const labelY = daysUntil === null || daysUntil === 0 ? CY + 16 : CY + 26

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="orbGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="white" />
          <stop offset="60%"  stopColor="#FFF0F2" />
          <stop offset="100%" stopColor="#FFD0D8" stopOpacity="0.65" />
        </radialGradient>
      </defs>

      {/* Pontos animados */}
      {dots.map(({ x, y, ndx, ndy, closeness, r, amplitude, duration, delay }, idx) => (
        <circle key={idx} cx={x} cy={y} r={r} fill={dotColor(closeness)}>
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`0 0; ${(ndx * amplitude).toFixed(2)} ${(ndy * amplitude).toFixed(2)}; 0 0`}
            dur={`${duration.toFixed(2)}s`}
            begin={`-${(delay % duration).toFixed(2)}s`}
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
          />
        </circle>
      ))}

      {/* Círculo central */}
      <circle cx={CX} cy={CY} r={CIRCLE_R} fill="url(#orbGrad)" />
      <circle cx={CX} cy={CY} r={CIRCLE_R} fill="none" stroke="#FFB3C0" strokeWidth="1.5" />

      {/* Número */}
      <text
        x={CX} y={numY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={numFontSize}
        fontWeight="800"
        fill="#1F2937"
        fontFamily="Nunito, sans-serif"
      >
        {countLabel}
      </text>

      {/* Label (duas linhas) */}
      <text
        x={CX} y={labelY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="9"
        fontWeight="700"
        fill="#6B7280"
        letterSpacing="1.5"
        fontFamily="Nunito, sans-serif"
      >
        {sublabelLines[0]}
        {sublabelLines[1] && (
          <tspan x={CX} dy="13">{sublabelLines[1]}</tspan>
        )}
      </text>
    </svg>
  )
}
