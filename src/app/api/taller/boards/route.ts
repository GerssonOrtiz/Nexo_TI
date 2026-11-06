// src/app/api/taller/boards/route.ts
// API de Tarjetas Electrónicas: GET (listar) y POST (crear)

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { z } from 'zod'

const CreateBoardSchema = z.object({
  partNumber: z.string().min(1),
  serialNumber: z.string().optional(),
  modelName: z.string().min(1),
  equipmentOrigin: z.string().min(1),
  failureReport: z.string().min(10),
  pipelineId: z.string().uuid(),
})

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user || user.role !== 'ADMIN_TI') {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
    }

    const boards = await prisma.electronicBoard.findMany({
      include: {
        pipeline: { select: { name: true } },
        technician: { select: { fullName: true } },
        currentStep: { select: { title: true, stepOrder: true } },
        _count: { select: { components: true, logs: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: boards })
  } catch {
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser()
    if (!user || user.role !== 'ADMIN_TI') {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = CreateBoardSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || 'Datos inválidos' },
        { status: 400 }
      )
    }

    // Generate internal code: TRJ-YYYY-NNN
    const year = new Date().getFullYear()
    const count = await prisma.electronicBoard.count({
      where: { internalCode: { startsWith: `TRJ-${year}` } },
    })
    const internalCode = `TRJ-${year}-${String(count + 1).padStart(3, '0')}`

    // Get first step of pipeline
    const firstStep = await prisma.pipelineStep.findFirst({
      where: { pipelineId: parsed.data.pipelineId },
      orderBy: { stepOrder: 'asc' },
    })

    const board = await prisma.electronicBoard.create({
      data: {
        internalCode,
        ...parsed.data,
        currentStepId: firstStep?.id,
        technicianId: user.id,
      },
    })

    // Create step progress entries for all steps
    const allSteps = await prisma.pipelineStep.findMany({
      where: { pipelineId: parsed.data.pipelineId },
      orderBy: { stepOrder: 'asc' },
    })

    await prisma.boardStepProgress.createMany({
      data: allSteps.map((step) => ({
        boardId: board.id,
        stepId: step.id,
        status: step.id === firstStep?.id ? 'EN_PROGRESO' : 'PENDIENTE',
      })),
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'ELECTRONIC_BOARD',
        entityId: board.id,
        userId: user.id,
        metadata: { internalCode, partNumber: parsed.data.partNumber },
      },
    })

    return NextResponse.json({ success: true, data: board }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
