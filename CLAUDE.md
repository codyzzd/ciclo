@AGENTS.md

# Projeto: Ciclo

App mobile-first de rastreamento de ciclo menstrual. Zero-config — aprendizado automático sem input manual do usuário.

## Stack

- Next.js 16 + TypeScript + Tailwind CSS v4 + shadcn/ui
- Dados: **localStorage** (sem banco ainda)
- Auth: Supabase email/senha — `https://dvudhjkkmvjctlxpwqhn.supabase.co`

## Mapa de arquivos

```
app/
  layout.tsx          — layout raiz, PWA meta tags
  page.tsx            — redireciona para HomeClient
  HomeClient.tsx      — shell principal com BottomNav e tabs
  login/page.tsx      — tela login/cadastro (toggle Entrar/Criar conta)
  login/LoginClient.tsx
  auth/callback/route.ts — callback confirmação de e-mail

components/
  BottomNav.tsx       — navegação inferior (Home, Calendar, Insights)
  CalendarMonth.tsx   — grid de um mês com estados visuais
  CalendarView.tsx    — 2 meses + navegação + legenda + info
  CountdownOrb.tsx    — orb animado com countdown para próxima menstruação
  DayActionPicker.tsx — sheet para selecionar ação do dia
  IntensityPicker.tsx — sheet bottom: leve/médio/intenso
  ModeToggle.tsx      — toggle dark/light
  ProfileHeader.tsx   — cabeçalho sticky com perfil e countdown
  ProfileManager.tsx  — dialog criar/trocar/deletar perfis
  SplashScreen.tsx    — splash screen PWA
  views/
    CalendarTab.tsx
    HomeTab.tsx
    InsightsTab.tsx

lib/
  cycle-logic.ts      — detectPeriods, calculatePredictions (toda lógica de ciclo)
  insights-logic.ts   — cálculos para aba Insights
  supabase/client.ts  — browser client
  supabase/server.ts  — server client com cookies async
  supabase/middleware.ts — helper updateSession
  utils.ts

hooks/
  useCycleData.ts     — state management + localStorage persistence

types/index.ts        — Profile, CycleDay, CyclePrediction, etc.
proxy.ts              — protege todas as rotas, redireciona /login se não autenticado
supabase/schema.sql
```

## Regras de negócio

- Clique simples = toggle dia de período
- Clique longo (500ms) = seletor de intensidade
- Ciclos detectados automaticamente (dias consecutivos, gap ≤ 2 dias)
- Previsões só com ≥ 2 ciclos detectados; média dos últimos 6
- Ovulação = próxima menstruação − 14 dias
- Janela fértil = ovulação − 5 até ovulação + 1

## Cores

| Significado       | Valor     |
|-------------------|-----------|
| Período real      | `#c2185b` |
| Previsão          | `#fce4ec` |
| Janela fértil     | `#e0f2f1` |
| Ovulação          | `#80cbc4` |
| Background        | `#fdf6f7` |

## Convenções de código

- Componentes client-only: `"use client"` no topo
- Não usar OAuth social — apenas email/senha
- Não migrar para Supabase DB sem instrução explícita
- Não adicionar features além do solicitado
