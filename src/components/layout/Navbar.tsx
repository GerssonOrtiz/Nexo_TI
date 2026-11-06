// src/components/layout/Navbar.tsx
// Floating top navbar con estado de usuario y logout
'use client'

import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'

export function Navbar() {
  const user = useUser()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="glass-card sticky top-4 z-30 mx-4 flex items-center justify-between rounded-2xl px-6 py-3">
      {/* Left spacer */}
      <div />

      {/* Right: User Info + Logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-blue/10 text-neon-blue">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-text-primary">{user.fullName}</p>
            <p className="text-[11px] text-text-secondary">{user.role === 'ADMIN_TI' ? 'Administrador TI' : 'Solicitante'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  )
}
