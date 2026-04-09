import type { Meta, StoryObj } from '@storybook/nextjs-vite'

const meta: Meta = {
  title: 'Design System/Typography',
  parameters: { layout: 'padded', backgrounds: { default: 'white' } },
}
export default meta

const SCALE = [
  { label: 'Display',    size: '36px', weight: 800, lh: '1.15', sample: 'Meu Ciclo',               usage: 'Splash / hero'          },
  { label: 'H1',         size: '28px', weight: 800, lh: '1.2',  sample: 'Março 2026',               usage: 'Título do mês'          },
  { label: 'H2',         size: '20px', weight: 700, lh: '1.3',  sample: 'Olá, Ana',                 usage: 'Nome de perfil'         },
  { label: 'H3',         size: '17px', weight: 700, lh: '1.35', sample: 'Próximo período',          usage: 'Subtítulo de seção'     },
  { label: 'Body',       size: '15px', weight: 500, lh: '1.5',  sample: 'Clique em um dia para registrar o fluxo.', usage: 'Texto padrão' },
  { label: 'Body small', size: '13px', weight: 400, lh: '1.5',  sample: 'Média de 28 dias — baseado em 3 ciclos.', usage: 'Texto secundário' },
  { label: 'Caption',    size: '11px', weight: 600, lh: '1.4',  sample: 'DIAS PARA O PERÍODO',      usage: 'Labels e legendas'      },
  { label: 'Micro',      size: '9px',  weight: 700, lh: '1.3',  sample: 'SEG  TER  QUA  QUI  SEX',  usage: 'Dias da semana no calendário' },
]

const WEIGHTS = [
  { weight: 400, label: 'Regular (400)' },
  { weight: 500, label: 'Medium (500)'  },
  { weight: 600, label: 'SemiBold (600)'},
  { weight: 700, label: 'Bold (700)'    },
  { weight: 800, label: 'ExtraBold (800)'},
]

export const Escala: StoryObj = {
  render: () => (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6b7280', marginBottom: 24 }}>
        Escala tipográfica — Nunito
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {SCALE.map(({ label, size, weight, lh, sample, usage }) => (
          <div key={label} style={{
            display: 'grid',
            gridTemplateColumns: '90px 1fr 200px',
            alignItems: 'center',
            borderBottom: '1px solid #f3f4f6',
            padding: '16px 0',
            gap: 16,
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#C2185B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
              <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>{size} / {weight} / lh {lh}</div>
            </div>
            <div style={{ fontSize: size, fontWeight: weight, lineHeight: lh, color: '#111827' }}>
              {sample}
            </div>
            <div style={{ fontSize: 11, color: '#9ca3af', textAlign: 'right' }}>{usage}</div>
          </div>
        ))}
      </div>
    </div>
  ),
}

export const Pesos: StoryObj = {
  render: () => (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6b7280', marginBottom: 24 }}>
        Pesos da fonte — Nunito
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {WEIGHTS.map(({ weight, label }) => (
          <div key={weight} style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
            <span style={{ fontSize: 11, color: '#9ca3af', width: 120, flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: 22, fontWeight: weight, color: '#111827' }}>
              Nunito — O ciclo é vida
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
}
