# Ciclo

App mobile-first de rastreamento de ciclo menstrual. Zero-config — o app aprende automaticamente a partir dos dias marcados, sem necessidade de input manual do usuário.

## Features

- Deteccao automatica de ciclos a partir dos dias marcados
- Previsao do proximo periodo, ovulacao e janela fertil
- Timeline visual de 15 dias centrada no dia atual
- Countdown orb animado com dias ate o proximo periodo
- Indicador de chance de gravidez baseado na fase do ciclo
- Cards de periodo e ovulacao com datas previstas
- Multiplos perfis por conta
- PWA instalavel (splash screen, icone, offline-ready)

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 |
| Componentes | shadcn/ui |
| Auth | Supabase (email/senha) |
| Persistencia | localStorage |
| Icones | Font Awesome 7 Free |
| Storybook | @storybook/nextjs-vite |

## Estrutura

```
app/
  layout.tsx              Layout raiz, PWA meta tags
  page.tsx                Redireciona para HomeClient
  HomeClient.tsx          Shell principal com BottomNav e tabs
  login/                  Tela de login/cadastro

components/
  BottomNav.tsx           Navegacao inferior (Home, Calendar, Insights)
  CardInfo.tsx            Card de dado com label colorido (rose/teal)
  CalendarMonth.tsx       Grid de um mes com estados visuais
  CountdownOrb.tsx        Orb SVG animado com countdown
  PregnancyChanceCard.tsx Card com barra de chance de gravidez
  ProfileHeader.tsx       Cabecalho com avatar, nome e logout
  TimelineStrip.tsx       Strip de 15 dias com fases do ciclo
  views/
    HomeTab.tsx
    CalendarTab.tsx
    InsightsTab.tsx

lib/
  cycle-logic.ts          detectPeriods, calculatePredictions
  insights-logic.ts       getPregnancyProbability, getCycleInsights

hooks/
  useCycleData.ts         State management + localStorage

design/                   Storybook — Design System (cores, tipografia, tokens)
```

## Regras de negocio

- **Deteccao de ciclos:** dias consecutivos marcados com gap maximo de 2 dias
- **Previsoes:** requer minimo de 2 ciclos detectados; media dos ultimos 6
- **Ovulacao:** proximo periodo − 14 dias
- **Janela fertil:** ovulacao − 5 ate ovulacao + 1
- **Clique simples:** toggle dia de periodo
- **Clique longo (500ms):** seletor de intensidade (leve/medio/intenso)

## Design System

O projeto usa um Design System no Figma com colecoes de variaveis:

- **Colors** — paleta completa Tailwind (rose, teal, slate, etc.)
- **Spacing** — escala de espacamento
- **Typography** — escala de 20 estilos (Display, H1–H6, Body LG–XS, Caption, Overline, Label, Micro)
- **Border Radius** — tokens de raio

Regra: tons neutros usam exclusivamente a familia `slate` (nunca `gray`, `zinc`, `neutral`).

## Desenvolvimento

```bash
# Instalar dependencias
npm install

# Servidor de desenvolvimento
npm run dev

# Storybook
npm run storybook

# Build de producao
npm run build
```

## Variaveis de ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=https://dvudhjkkmvjctlxpwqhn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
```

> Auth via Supabase email/senha. OAuth social nao utilizado intencionalmente.
> Migracao para banco de dados (Supabase DB) sera feita em etapa futura — dados persistem em localStorage por ora.
