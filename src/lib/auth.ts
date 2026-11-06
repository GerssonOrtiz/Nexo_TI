// src/lib/auth.ts
// Helpers de autenticación Server-First
// Usa supabase.auth.getUser() (validación criptográfica) en vez de getSession()

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export type SessionUser = {
  id: string
  fullName: string
  username: string
  role: 'SOLICITANTE' | 'ADMIN_TI'
  isActive: boolean
}

/**
 * Obtiene el usuario autenticado desde Supabase Auth y lo enriquece con datos de Prisma.
 * Retorna null si no hay sesión activa o el usuario está desactivado.
 */
export async function getAuthUser(): Promise<SessionUser | null> {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) return null

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      fullName: true,
      username: true,
      role: true,
      isActive: true,
      deletedAt: true,
    },
  })

  if (!dbUser || !dbUser.isActive || dbUser.deletedAt) return null

  return {
    id: dbUser.id,
    fullName: dbUser.fullName,
    username: dbUser.username,
    role: dbUser.role,
    isActive: dbUser.isActive,
  }
}

/**
 * Requiere usuario autenticado. Redirige a /login si no hay sesión.
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  return user
}

/**
 * Requiere rol ADMIN_TI. Redirige a /dashboard si el usuario no es admin.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireAuth()
  if (user.role !== 'ADMIN_TI') redirect('/dashboard')
  return user
}
