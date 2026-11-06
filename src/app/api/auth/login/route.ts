// src/app/api/auth/login/route.ts
// API de login — autentica con Supabase Auth (soporta email o username)

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
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

    let authEmail = inputIdentifier

    // Si no contiene '@', buscar el correo asociado al username en la BD
    if (!authEmail.includes('@')) {
      const dbUser = await prisma.user.findUnique({
        where: { username: inputIdentifier },
        select: { id: true, username: true },
      })

      if (!dbUser) {
        return NextResponse.json(
          { success: false, error: 'Credenciales inválidas' },
          { status: 401 }
        )
      }

      // Convención para cuentas con solo username
      authEmail = `${inputIdentifier.toLowerCase()}@nexoti.local`
    }

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

