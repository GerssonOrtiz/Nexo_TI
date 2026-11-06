// src/app/(auth)/login/page.tsx
// Página de Login interactiva con estética Cyber Glassmorphism
// Orbs flotantes, grid overlay, glass card central
'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, LogIn, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'Credenciales inválidas')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Error de conexión. Intente de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-bg-forge linux-grid-bg overflow-hidden">
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-neon-blue/20 blur-[120px] animate-float-1" />
      <div className="absolute bottom-1/3 right-1/4 h-48 w-48 rounded-full bg-neon-purple/20 blur-[100px] animate-float-2" />
      <div className="absolute top-1/2 right-1/3 h-36 w-36 rounded-full bg-amber-deep/20 blur-[80px] animate-float-3" />

      {/* Login Card */}
      <div className="glass-card relative z-10 w-full max-w-md rounded-3xl p-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple shadow-neon-glow">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-primary">Nexo TI</h1>
            <p className="text-sm text-text-secondary mt-1">Ingresa a tu cuenta</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-cyber w-full"
              placeholder="tu@email.com"
              required
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-cyber w-full"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-neon-primary w-full flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Iniciar sesión
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-text-secondary mt-6">
          Sistema de Gestión de TI & Taller Electrónico v2.0
        </p>
      </div>
    </div>
  )
}
