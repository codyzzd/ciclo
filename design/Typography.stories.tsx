import type { Meta, StoryObj } from '@storybook/nextjs-vite'

const meta: Meta = {
  title: 'Design System/Typography',
  parameters: { layout: 'padded', backgrounds: { default: 'white' } },
}
export default meta

const SCALE = [
  // ── Display ──────────────────────────────────────────────────────────────
  { label: 'Display',        size: '36px', weight: 800, lh: '1.15', ls: 'normal', upper: false, sample: 'Meu Ciclo',                                    usage: 'Splash / hero'               },
  // ── Headings ─────────────────────────────────────────────────────────────
  { label: 'Heading / H1',   size: '28px', weight: 800, lh: '1.2',  ls: 'normal', upper: false, sample: 'Março 2026',                                   usage: 'Título do mês'               },
  { label: 'Heading / H2',   size: '24px', weight: 800, lh: '1.25', ls: 'normal', upper: false, sample: 'Seu ciclo',                                     usage: 'Título de seção principal'   },
  { label: 'Heading / H3',   size: '20px', weight: 700, lh: '1.3',  ls: 'normal', upper: false, sample: 'Próximo período',                               usage: 'Subtítulo de seção'          },
  { label: 'Heading / H4',   size: '18px', weight: 700, lh: '1.35', ls: 'normal', upper: false, sample: 'Janela fértil',                                 usage: 'Título de card'              },
  { label: 'Heading / H5',   size: '16px', weight: 600, lh: '1.5',  ls: '-0.02em', upper: false, sample: 'Chance de engravidar',                        usage: 'Label de destaque'           },
  { label: 'Heading / H6',   size: '14px', weight: 600, lh: '1.4',  ls: '-0.01em', upper: false, sample: 'Ovulação prevista',                           usage: 'Label de grupo / metadata'   },
  // ── Body ─────────────────────────────────────────────────────────────────
  { label: 'Body / LG',      size: '18px', weight: 400, lh: '1.55', ls: 'normal', upper: false, sample: 'Acompanhe seu ciclo de forma simples.',         usage: 'Texto de onboarding'         },
  { label: 'Body / LG Bold', size: '18px', weight: 700, lh: '1.55', ls: 'normal', upper: false, sample: 'Luna Marchetti',                                usage: 'Nome de perfil destacado'    },
  { label: 'Body / MD',      size: '16px', weight: 400, lh: '1.5',  ls: 'normal', upper: false, sample: 'Clique em um dia para registrar o fluxo.',      usage: 'Texto padrão'                },
  { label: 'Body / MD Bold', size: '16px', weight: 700, lh: '1.375', ls: 'normal', upper: false, sample: '9 de Maio',                                   usage: 'Valor de dado'               },
  { label: 'Body / SM',      size: '14px', weight: 400, lh: '1.5',  ls: 'normal', upper: false, sample: 'Média de 28 dias — baseado em 3 ciclos.',       usage: 'Texto secundário'            },
  { label: 'Body / SM Bold', size: '14px', weight: 700, lh: '1.5',  ls: 'normal', upper: false, sample: 'Dias para o período',                           usage: 'Texto secundário em destaque'},
  { label: 'Body / XS',      size: '12px', weight: 400, lh: '1.33', ls: 'normal', upper: false, sample: 'Toque para gerenciar perfis',                   usage: 'Legenda / hint'              },
  { label: 'Body / XS Bold', size: '12px', weight: 700, lh: '1.33', ls: 'normal', upper: false, sample: 'Início · Calendário · Insights',                usage: 'Label de tab'                },
  // ── Utility ──────────────────────────────────────────────────────────────
  { label: 'Caption',        size: '11px', weight: 600, lh: '1.45', ls: 'normal', upper: false, sample: 'Dias para o período',                           usage: 'Metadata / timestamp'        },
  { label: 'Overline',       size: '11px', weight: 700, lh: '1.45', ls: '0.08em', upper: true,  sample: 'Chance de engravidar',                          usage: 'Label uppercase com tracking'},
  { label: 'Label / SM',     size: '10px', weight: 700, lh: '1.4',  ls: '0.04em', upper: false, sample: 'Período · Fértil · Ovulação',                   usage: 'Legenda de gráfico / timeline'},
  { label: 'Label / XS',     size: '9px',  weight: 700, lh: '1.3',  ls: '0.04em', upper: false, sample: 'DIAS PARA O PERÍODO',                           usage: 'Sublabel do orb'             },
  { label: 'Micro',          size: '9px',  weight: 700, lh: '1.3',  ls: '0.15em', upper: true,  sample: 'SEG  TER  QUA  QUI  SEX',                       usage: 'Dias da semana no calendário'},
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
        Escala tipográfica — Nunito ({SCALE.length} estilos)
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {SCALE.map(({ label, size, weight, lh, ls, upper, sample, usage }) => (
          <div key={label} style={{
            display: 'grid',
            gridTemplateColumns: '140px 1fr 220px',
            alignItems: 'center',
            borderBottom: '1px solid #f3f4f6',
            padding: '14px 0',
            gap: 16,
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#C2185B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
              <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>{size} / w{weight} / lh {lh}</div>
            </div>
            <div style={{ fontSize: size, fontWeight: weight, lineHeight: lh, letterSpacing: ls, textTransform: upper ? 'uppercase' : 'none', color: '#111827' }}>
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
