'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Mode = 'login' | 'signup' | 'check-email'

export function LoginClient() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message === 'Invalid login credentials'
          ? 'E-mail ou senha incorretos.'
          : error.message)
      } else {
        router.push('/')
        router.refresh()
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      })
      if (error) {
        setError(error.message)
      } else {
        setMode('check-email')
      }
    }

    setLoading(false)
  }

  if (mode === 'check-email') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8 gap-6">
        <div className="text-6xl">📬</div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirme seu e-mail</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Enviamos um link de confirmação para<br />
            <span className="font-medium text-gray-700">{email}</span>
          </p>
          <p className="text-gray-400 text-xs mt-3">
            Verifique sua caixa de entrada e clique no link para ativar sua conta.
          </p>
        </div>
        <button
          onClick={() => setMode('login')}
          className="text-[#FF385C] text-sm font-medium"
        >
          Voltar para o login
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8">
      <div className="w-full max-w-xs">
        {/* Logo */}
        <div className="text-center mb-10 anim-1">
          <div className="text-5xl mb-3">🩷</div>
          <h1 className="text-2xl font-bold text-gray-900">Meu Ciclo</h1>
          <p className="text-gray-400 text-sm mt-1">
            {mode === 'login' ? 'Bem-vinda de volta' : 'Crie sua conta'}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-full p-1 mb-8 anim-2">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null) }}
            className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all ${
              mode === 'login'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-400'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null) }}
            className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all ${
              mode === 'signup'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-400'
            }`}
          >
            Criar conta
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 anim-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="seu@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-[#FF385C] focus:ring-1 focus:ring-[#FF385C] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder={mode === 'signup' ? 'Mínimo 6 caracteres' : '••••••••'}
                minLength={6}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-[#FF385C] focus:ring-1 focus:ring-[#FF385C] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF385C] hover:bg-[#E31C5F] disabled:opacity-60 text-white font-semibold py-4 rounded-full active:scale-95 transition-all mt-2"
          >
            {loading
              ? '...'
              : mode === 'login'
              ? 'Entrar'
              : 'Criar conta'}
          </button>
        </form>
      </div>
    </div>
  )
}
