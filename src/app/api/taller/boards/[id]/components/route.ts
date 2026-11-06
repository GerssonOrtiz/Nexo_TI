// src/app/api/taller/boards/[id]/components/route.ts
// API de componentes BOM de una tarjeta

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { z } from 'zod'

const AddComponentSchema = z.object({
  designator: z.string().min(1),
  componentName: z.string().min(1),
  package: z.string().optional(),
  partNumber: z.string().optional(),
  quantity: z.number().int().positive().default(1),
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

    const components = await prisma.boardComponent.findMany({
      where: { boardId },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ success: true, data: components })
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
    const parsed = AddComponentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || 'Datos inválidos' },
        { status: 400 }
      )
    }

    const component = await prisma.boardComponent.create({
      data: { boardId, ...parsed.data },
    })

    return NextResponse.json({ success: true, data: component }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
