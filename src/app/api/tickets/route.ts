// src/app/api/tickets/route.ts
// API de Tickets: GET (listar) y POST (crear)

import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { z } from 'zod'

const CreateTicketSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  priority: z.enum(['BAJA', 'MEDIA', 'ALTA', 'CRITICA']).default('MEDIA'),
  category: z.enum(['HARDWARE', 'SOFTWARE', 'RED', 'ACCESOS', 'OTRO']).default('OTRO'),
})

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')

    const where: Record<string, unknown> = {}

    // IDOR prevention: Solicitantes solo ven sus tickets
    if (user.role === 'SOLICITANTE') {
      where.creatorId = user.id
    }

    if (status) where.status = status
    if (priority) where.priority = priority

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        creator: { select: { id: true, fullName: true, username: true } },
        assignee: { select: { id: true, fullName: true, username: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: tickets })
  } catch {
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = CreateTicketSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || 'Datos inválidos' },
        { status: 400 }
      )
    }

    const ticket = await prisma.ticket.create({
      data: {
        ...parsed.data,
        creatorId: user.id,
      },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'TICKET',
        entityId: ticket.id,
        userId: user.id,
        metadata: { title: ticket.title },
      },
    })

    return NextResponse.json({ success: true, data: ticket }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
