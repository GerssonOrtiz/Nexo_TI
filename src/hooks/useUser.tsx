// src/hooks/useUser.tsx
// UserProvider y useUser hook — sync, sin loading, datos inyectados desde Server Component
'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { SessionUser } from '@/types'

const UserContext = createContext<SessionUser | null>(null)

export function UserProvider({
  user,
  children,
}: {
  user: SessionUser
  children: ReactNode
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export function useUser(): SessionUser {
  const user = useContext(UserContext)
  if (!user) {
    throw new Error('useUser debe usarse dentro de <UserProvider>')
  }
  return user
}
