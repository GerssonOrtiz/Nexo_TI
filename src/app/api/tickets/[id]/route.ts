// src/app/api/tickets/[id]/route.ts
// API de Ticket individual: GET, PATCH, DELETE (soft)

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { z } from 'zod'

const UpdateTicketSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).optional(),
  status: z.enum(['ABIERTO', 'EN_PROGRESO', 'EN_ESPERA', 'RESUELTO', 'CERRADO']).optional(),
  priority: z.enum(['BAJA', 'MEDIA', 'ALTA', 'CRITICA']).optional(),
  assigneeId: z.string().uuid().nullable().optional(),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })

    const { id } = await params

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, fullName: true, username: true } },
        assignee: { select: { id: true, fullName: true, username: true } },
        comments: {
          include: { author: { select: { id: true, fullName: true, role: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!ticket) {
      return NextResponse.json({ success: false, error: 'Ticket no encontrado' }, { status: 404 })
    }

    // IDOR check
    if (user.role === 'SOLICITANTE' && ticket.creatorId !== user.id) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 })
    }

    // Filter internal comments for non-admins
    if (user.role !== 'ADMIN_TI') {
      ticket.comments = ticket.comments.filter((c) => !c.isInternal)
    }

    return NextResponse.json({ success: true, data: ticket })
  } catch {
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })

    const { id } = await params
    const body = await request.json()
    const parsed = UpdateTicketSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || 'Datos inválidos' },
        { status: 400 }
      )
    }

    const existing = await prisma.ticket.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Ticket no encontrado' }, { status: 404 })
    }

    // Solo admin puede cambiar status y asignación
    if (user.role !== 'ADMIN_TI' && (parsed.data.status || parsed.data.assigneeId !== undefined)) {
      return NextResponse.json({ success: false, error: 'Sin permisos para esta acción' }, { status: 403 })
    }

    const updateData: Record<string, unknown> = { ...parsed.data }

    // Timestamps automáticos de resolución/cierre
    if (parsed.data.status === 'RESUELTO') updateData.resolvedAt = new Date()
    if (parsed.data.status === 'CERRADO') updateData.closedAt = new Date()

    const ticket = await prisma.ticket.update({
      where: { id },
      data: updateData,
    })

    // Audit log para cambios de estado
    if (parsed.data.status && parsed.data.status !== existing.status) {
      await prisma.auditLog.create({
        data: {
          action: 'STATUS_CHANGE',
          entity: 'TICKET',
          entityId: id,
          userId: user.id,
          metadata: { from: existing.status, to: parsed.data.status },
        },
      })
    }

    return NextResponse.json({ success: true, data: ticket })
  } catch {
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
