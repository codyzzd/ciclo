import type { Meta, StoryObj } from '@storybook/nextjs-vite'

const meta: Meta = {
  title: 'Design System/Colors',
  parameters: { layout: 'padded' },
}
export default meta

// ─── Paleta do app ───────────────────────────────────────────────────────────

const APP_COLORS = [
  { name: 'Período intenso',  hex: '#C2185B', desc: 'Fluxo intenso / crimson'  },
  { name: 'Período médio',    hex: '#FF385C', desc: 'Fluxo médio / padrão'     },
  { name: 'Período leve',     hex: '#FF7699', desc: 'Fluxo leve / rosa suave'  },
  { name: 'Previsão fundo',   hex: '#FFF0F2', desc: 'Background da previsão'   },
  { name: 'Previsão texto',   hex: '#FF385C', desc: 'Texto/ícone de previsão'  },
  { name: 'Ovulação',         hex: '#00A699', desc: 'Dia de ovulação / teal'   },
  { name: 'Janela fértil',    hex: '#E6F7F6', desc: 'Background fértil'        },
  { name: 'Fértil texto',     hex: '#007A73', desc: 'Texto/ícone fértil'       },
  { name: 'Relação',          hex: '#7C3AED', desc: 'Modo relação / roxo'      },
  { name: 'App background',   hex: '#fdf6f7', desc: 'Fundo geral do app'       },
]

// ─── Tokens semânticos (CSS vars do shadcn) ──────────────────────────────────

const SEMANTIC_TOKENS: { name: string; variable: string; desc: string }[] = [
  { name: 'Primary',            variable: '--primary',            desc: 'Ação principal'     },
  { name: 'Primary foreground', variable: '--primary-foreground', desc: 'Texto sobre primary'},
  { name: 'Secondary',          variable: '--secondary',          desc: 'Ação secundária'    },
  { name: 'Destructive',        variable: '--destructive',        desc: 'Ação destrutiva'    },
  { name: 'Muted',              variable: '--muted',              desc: 'Fundo suave'        },
  { name: 'Muted foreground',   variable: '--muted-foreground',   desc: 'Texto suave'        },
  { name: 'Background',         variable: '--background',         desc: 'Fundo da página'    },
  { name: 'Foreground',         variable: '--foreground',         desc: 'Texto padrão'       },
  { name: 'Border',             variable: '--border',             desc: 'Bordas'             },
  { name: 'Ring',               variable: '--ring',               desc: 'Focus ring'         },
]

function Swatch({ hex, name, desc }: { hex: string; name: string; desc: string }) {
  const isLight = parseInt(hex.replace('#',''), 16) > 0xbbbbbb
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{
        width: 80, height: 80, borderRadius: 12,
        backgroundColor: hex,
        border: '1px solid rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: isLight ? '#374151' : '#fff', opacity: 0.7 }}>
          {hex}
        </span>
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#1f2937' }}>{name}</div>
      <div style={{ fontSize: 10, color: '#6b7280' }}>{desc}</div>
    </div>
  )
}

function SemanticSwatch({ variable, name, desc }: { variable: string; name: string; desc: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{
        width: 80, height: 80, borderRadius: 12,
        backgroundColor: `var(${variable})`,
        border: '1px solid rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        paddingBottom: 6,
      }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--foreground)', opacity: 0.5 }}>
          {variable}
        </span>
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#1f2937' }}>{name}</div>
      <div style={{ fontSize: 10, color: '#6b7280' }}>{desc}</div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6b7280', marginBottom: 20 }}>
        {title}
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {children}
      </div>
    </div>
  )
}

export const Paleta: StoryObj = {
  render: () => (
    <div style={{ fontFamily: "'Nunito', sans-serif", padding: 8 }}>
      <Section title="Paleta do app — ciclo menstrual">
        {APP_COLORS.map(c => <Swatch key={c.hex} {...c} />)}
      </Section>
      <Section title="Tokens semânticos — shadcn/ui">
        {SEMANTIC_TOKENS.map(t => <SemanticSwatch key={t.variable} {...t} />)}
      </Section>
    </div>
  ),
}
