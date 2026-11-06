// src/app/api/taller/boards/[id]/step/route.ts
// API de avance de paso — Transacción atómica para step progress

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

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
    const { notes } = await request.json()

    // Transacción atómica: completar paso actual y avanzar al siguiente
    const result = await prisma.$transaction(async (tx) => {
      const board = await tx.electronicBoard.findUnique({
        where: { id: boardId },
        include: {
          currentStep: true,
          pipeline: { include: { steps: { orderBy: { stepOrder: 'asc' } } } },
        },
      })

      if (!board || !board.currentStep) {
        throw new Error('Tarjeta o paso actual no encontrado')
      }

      // Marcar paso actual como completado
      await tx.boardStepProgress.update({
        where: {
          boardId_stepId: {
            boardId,
            stepId: board.currentStep.id,
          },
        },
        data: {
          status: 'COMPLETADO',
          completedById: user.id,
          completedAt: new Date(),
          notes: notes || null,
        },
      })

      // Buscar siguiente paso
      const currentOrder = board.currentStep.stepOrder
      const nextStep = board.pipeline.steps.find(
        (s) => s.stepOrder > currentOrder
      )

      if (nextStep) {
        // Avanzar al siguiente paso
        await tx.boardStepProgress.update({
          where: {
            boardId_stepId: {
              boardId,
              stepId: nextStep.id,
            },
          },
          data: { status: 'EN_PROGRESO' },
        })

        await tx.electronicBoard.update({
          where: { id: boardId },
          data: { currentStepId: nextStep.id },
        })
      } else {
        // No hay más pasos — marcar como reparada
        await tx.electronicBoard.update({
          where: { id: boardId },
          data: {
            currentStepId: null,
            status: 'REPARADA',
          },
        })
      }

      // Log de cambio de estado
      await tx.boardLog.create({
        data: {
          boardId,
          authorId: user.id,
          logType: 'CAMBIO_ESTADO',
          content: `Paso "${board.currentStep.title}" completado.${notes ? ` Notas: ${notes}` : ''}`,
        },
      })

      return { nextStep: nextStep?.title || 'COMPLETADO' }
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
