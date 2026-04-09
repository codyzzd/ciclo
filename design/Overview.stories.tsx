import type { Meta, StoryObj } from '@storybook/nextjs-vite'

const meta: Meta = {
  title: 'Design System/Overview',
  parameters: { layout: 'padded', backgrounds: { default: 'white' } },
}
export default meta

const CYCLE_COLORS = [
  { label: 'Período',    hex: '#FF385C' },
  { label: 'Leve',       hex: '#FF7699' },
  { label: 'Intenso',    hex: '#C2185B' },
  { label: 'Previsão',   hex: '#FFF0F2' },
  { label: 'Ovulação',   hex: '#00A699' },
  { label: 'Fértil',     hex: '#E6F7F6' },
  { label: 'Relação',    hex: '#7C3AED' },
  { label: 'Background', hex: '#fdf6f7' },
]

export const VisaoGeral: StoryObj = {
  name: 'Visão Geral',
  render: () => (
    <div style={{ fontFamily: "'Nunito', sans-serif", maxWidth: 640 }}>
      {/* Header */}
      <div style={{
        padding: '32px 24px',
        background: 'linear-gradient(135deg, #FF385C 0%, #C2185B 100%)',
        borderRadius: 20,
        marginBottom: 32,
        color: '#fff',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', opacity: 0.8, marginBottom: 8 }}>
          DESIGN SYSTEM
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.15 }}>Meu Ciclo</div>
        <div style={{ fontSize: 14, marginTop: 8, opacity: 0.85 }}>
          App mobile-first de rastreamento menstrual
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          {['Nunito', 'Tailwind v4', 'shadcn/ui', 'Next.js 16'].map(t => (
            <span key={t} style={{
              fontSize: 11, fontWeight: 600,
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 20, padding: '3px 10px',
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Cores */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6b7280', marginBottom: 14 }}>
          Paleta de cores
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {CYCLE_COLORS.map(({ label, hex }) => (
            <div key={hex} style={{ textAlign: 'center' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                backgroundColor: hex,
                border: '1px solid rgba(0,0,0,0.07)',
                marginBottom: 4,
              }} />
              <div style={{ fontSize: 9, fontWeight: 600, color: '#6b7280' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tipografia */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6b7280', marginBottom: 14 }}>
          Tipografia — Nunito
        </div>
        {[
          { size: 28, weight: 800, text: 'Março 2026' },
          { size: 20, weight: 700, text: 'Olá, Ana' },
          { size: 15, weight: 500, text: 'Seu próximo período é esperado em 7 dias.' },
          { size: 11, weight: 700, text: 'DIAS PARA O PERÍODO', upper: true },
        ].map(({ size, weight, text, upper }) => (
          <div key={size} style={{
            fontSize: size, fontWeight: weight, color: '#111827',
            textTransform: upper ? 'uppercase' : 'none',
            letterSpacing: upper ? '0.1em' : 'normal',
            lineHeight: 1.4, marginBottom: 10,
          }}>
            {text}
          </div>
        ))}
      </section>

      {/* Componentes UI */}
      <section>
        <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6b7280', marginBottom: 14 }}>
          Índice de componentes
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { cat: 'UI',    items: ['Button', 'Badge', 'Dialog', 'Sheet'] },
            { cat: 'Ciclo', items: ['CountdownOrb', 'CalendarMonth', 'ProfileHeader', 'IntensityPicker'] },
          ].map(({ cat, items }) => (
            <div key={cat} style={{
              border: '1px solid #f3f4f6', borderRadius: 12, padding: 16,
            }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#C2185B', marginBottom: 10 }}>{cat}</div>
              {items.map(item => (
                <div key={item} style={{ fontSize: 13, fontWeight: 500, color: '#374151', padding: '3px 0', borderBottom: '1px solid #f9fafb' }}>
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
}
