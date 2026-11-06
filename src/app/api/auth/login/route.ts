// src/app/api/auth/login/route.ts
// API de login — autentica directamente con Supabase Auth sin intermediación de Prisma

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { identifier, email, password } = await request.json()
    const inputIdentifier = (identifier || email || '').trim()

    if (!inputIdentifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Usuario / correo y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Si no contiene '@', asumimos la convención local de correo para el username
    const authEmail = inputIdentifier.includes('@')
      ? inputIdentifier
      : `${inputIdentifier.toLowerCase()}@nexoti.local`

    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password,
    })

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { user: data.user?.id },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}


