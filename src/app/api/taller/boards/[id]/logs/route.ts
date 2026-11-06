// src/app/api/taller/boards/[id]/logs/route.ts
// API de bitácora técnica de una tarjeta (append-only)

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { z } from 'zod'

const AddLogSchema = z.object({
  logType: z.enum(['NOTA_TECNICA', 'MEDICION', 'CAMBIO_ESTADO', 'ALERTA']).default('NOTA_TECNICA'),
  content: z.string().min(1),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser()
    if (!user || user.role !== 'ADMIN_TI') {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
    }

    const { id: boardId } = await params

    const logs = await prisma.boardLog.findMany({
      where: { boardId },
      include: { author: { select: { fullName: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: logs })
  } catch {
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser()
    if (!user || user.role !== 'ADMIN_TI') {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
    }

    const { id: boardId } = await params
    const body = await request.json()
    const parsed = AddLogSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || 'Datos inválidos' },
        { status: 400 }
      )
    }

    const log = await prisma.boardLog.create({
      data: {
        boardId,
        authorId: user.id,
        ...parsed.data,
      },
    })

    return NextResponse.json({ success: true, data: log }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
