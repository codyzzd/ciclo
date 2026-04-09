import type { Meta, StoryObj } from '@storybook/nextjs-vite'

const meta: Meta = {
  title: 'Design System/Tokens',
  parameters: { layout: 'padded', backgrounds: { default: 'white' } },
}
export default meta

// ─── Spacing ────────────────────────────────────────────────────────────────

const SPACING = [1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24]

// ─── Radius ─────────────────────────────────────────────────────────────────

const RADII = [
  { label: 'sm',  value: 'var(--radius-sm)',  desc: 'Badges, chips'       },
  { label: 'md',  value: 'var(--radius-md)',  desc: 'Botões pequenos'     },
  { label: 'lg',  value: 'var(--radius-lg)',  desc: 'Padrão (--radius)'   },
  { label: 'xl',  value: 'var(--radius-xl)',  desc: 'Cards, inputs'       },
  { label: '2xl', value: 'var(--radius-2xl)', desc: 'Modais, sheets'      },
  { label: 'full','value': '9999px',          desc: 'Pílulas, avatares'   },
]

// ─── Shadows / elevation ────────────────────────────────────────────────────

const SHADOWS = [
  { label: 'Nenhuma',  shadow: 'none' },
  { label: 'Suave',    shadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)' },
  { label: 'Média',    shadow: '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)' },
  { label: 'Elevada',  shadow: '0 8px 24px rgba(0,0,0,0.10), 0 3px 8px rgba(0,0,0,0.06)' },
  { label: 'Modal',    shadow: '0 16px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)' },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6b7280', marginBottom: 20 }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

export const Espacamento: StoryObj = {
  name: 'Espaçamento',
  render: () => (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Section title="Escala de espaçamento (base 4px)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SPACING.map(n => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 11, color: '#9ca3af', width: 40, textAlign: 'right', flexShrink: 0 }}>
                {n * 4}px
              </span>
              <span style={{ fontSize: 11, color: '#d1d5db', width: 30, flexShrink: 0 }}>
                ({n})
              </span>
              <div style={{
                height: 16,
                width: n * 4,
                backgroundColor: '#FF385C',
                borderRadius: 3,
                opacity: 0.7 + (n / SPACING.at(-1)!) * 0.3,
              }} />
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),
}

export const BorderRadius: StoryObj = {
  name: 'Border Radius',
  render: () => (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Section title="Border radius — tokens CSS">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {RADII.map(({ label, value, desc }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 72, height: 72,
                backgroundColor: '#FFF0F2',
                border: '2px solid #FF385C',
                borderRadius: value,
              }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{label}</span>
              <span style={{ fontSize: 10, color: '#9ca3af', textAlign: 'center', maxWidth: 80 }}>{desc}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),
}

export const Sombras: StoryObj = {
  render: () => (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Section title="Elevação / sombras">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
          {SHADOWS.map(({ label, shadow }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 96, height: 96,
                backgroundColor: '#fff',
                borderRadius: 16,
                boxShadow: shadow,
              }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>{label}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),
}
