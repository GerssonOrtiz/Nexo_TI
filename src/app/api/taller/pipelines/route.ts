// src/app/api/taller/pipelines/route.ts
// API de Pipelines de Reparación: GET (listar activos)

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user || user.role !== 'ADMIN_TI') {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
    }

    const pipelines = await prisma.repairPipeline.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { steps: true } },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ success: true, data: pipelines })
  } catch {
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
