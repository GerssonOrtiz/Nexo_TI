// src/lib/supabase/server.ts
// Cliente Supabase SSR para Server Components y Route Handlers
// Usa getAll/setAll como requiere @supabase/ssr con Next.js 15+

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll puede lanzar en Server Components (read-only cookies)
            // Es seguro ignorar — solo afecta a refresh de tokens en SC
          }
        },
      },
    }
  )
}
