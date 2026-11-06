// src/app/(dashboard)/layout.tsx
// Dashboard Layout — Server Component que valida sesión y alimenta UserProvider
// Patrón Server-First: usuario cargado en servidor, cero loading en cliente

import { requireAuth } from '@/lib/auth'
import { UserProvider } from '@/hooks/useUser'
import { DashboardShell } from '@/components/layout/DashboardShell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()

  return (
    <UserProvider user={user}>
      <DashboardShell>{children}</DashboardShell>
    </UserProvider>
  )
}
