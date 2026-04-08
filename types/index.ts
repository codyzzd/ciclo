export type Intensidade = 'leve' | 'medio' | 'intenso'

export interface Profile {
  id: string
  nome: string
  created_at: string
}

export interface CycleDay {
  id: string
  profile_id: string
  date: string // YYYY-MM-DD
  menstruou: boolean
  intensidade: Intensidade | null
  sexo: boolean
}

export interface DetectedPeriod {
  start: string // YYYY-MM-DD
  end: string   // YYYY-MM-DD
  days: string[]
}

export interface CyclePrediction {
  nextPeriodStart: Date | null
  nextPeriodEnd: Date | null
  ovulationDate: Date | null
  fertileWindowStart: Date | null
  fertileWindowEnd: Date | null
  daysUntilNextPeriod: number | null
  averageCycleLength: number | null
  cyclesDetected: number
  // sets for fast lookup
  predictedPeriodDays: Set<string>
  fertileDays: Set<string>
  ovulationDays: Set<string>
}
