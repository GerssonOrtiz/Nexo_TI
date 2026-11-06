// src/lib/auth.ts
// Helpers de autenticación Server-First basados puramente en Supabase Auth
// Usa supabase.auth.getUser() (validación criptográfica) y metadatos de sesión

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type SessionUser = {
  id: string
  fullName: string
  username: string
  role: 'SOLICITANTE' | 'ADMIN_TI'
  isActive: boolean
}

/**
 * Obtiene el usuario autenticado desde Supabase Auth sin depender de consultas a Prisma.
 * Extrae rol y datos de perfil directamente de user_metadata / app_metadata.
 */
export async function getAuthUser(): Promise<SessionUser | null> {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) return null

  const metadata = (user.user_metadata || {}) as Record<string, any>
  const appMetadata = (user.app_metadata || {}) as Record<string, any>

  const rawRole = metadata.role || appMetadata.role
  const role: 'SOLICITANTE' | 'ADMIN_TI' = rawRole === 'ADMIN_TI' ? 'ADMIN_TI' : 'SOLICITANTE'
  const emailPrefix = user.email ? user.email.split('@')[0] : 'usuario'

  return {
    id: user.id,
    fullName: metadata.fullName || metadata.full_name || emailPrefix,
    username: metadata.username || emailPrefix,
    role,
    isActive: true,
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
