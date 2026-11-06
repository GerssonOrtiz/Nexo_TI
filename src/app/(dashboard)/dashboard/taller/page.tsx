// src/app/(dashboard)/taller/page.tsx
// Catálogo de Tarjetas Electrónicas en Taller — Server Component
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CircuitBoard, Plus } from 'lucide-react'
import { BOARD_STATUS_COLORS, type BoardStatusType } from '@/types'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function TallerPage() {
  await requireAdmin()

  const boards = await prisma.electronicBoard.findMany({
    include: {
      pipeline: { select: { name: true } },
      technician: { select: { fullName: true } },
      currentStep: { select: { title: true, stepOrder: true } },
      _count: { select: { components: true, logs: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Group by status for overview
  const statusCounts = boards.reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <CircuitBoard className="h-6 w-6 text-neon-blue" />
            Taller Electrónico
          </h1>
          <p className="text-text-secondary text-sm mt-1">{boards.length} tarjetas registradas</p>
        </div>
        <Link href="/dashboard/taller/new" className="btn-neon-primary flex items-center gap-2 text-sm">
          <Plus className="h-4 w-4" />
          Nueva Tarjeta
        </Link>
      </div>

      {/* Status Summary */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusCounts).map(([status, count]) => (
          <span key={status} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium ${BOARD_STATUS_COLORS[status as BoardStatusType]}`}>
            {status.replace(/_/g, ' ')}
            <span className="ml-1 rounded-full bg-white/10 px-1.5 text-[10px]">{count}</span>
          </span>
        ))}
      </div>

      {/* Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {boards.map((board) => (
          <Link
            key={board.id}
            href={`/dashboard/taller/${board.id}`}
            className="glass-card rounded-2xl p-5 transition-all hover:scale-[1.01] hover:border-neon-blue/20 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-neon-blue font-mono">{board.internalCode}</p>
                <p className="text-xs text-text-secondary mt-0.5">{board.modelName}</p>
              </div>
              <span className={`inline-flex rounded-lg border px-2 py-0.5 text-[10px] font-medium ${BOARD_STATUS_COLORS[board.status as BoardStatusType]}`}>
                {board.status.replace(/_/g, ' ')}
              </span>
            </div>

            <p className="text-xs text-text-secondary line-clamp-2 mb-3">{board.failureReport}</p>

            <div className="space-y-1.5 text-[11px] text-text-secondary">
              <div className="flex justify-between">
                <span>Origen:</span>
                <span className="text-text-primary">{board.equipmentOrigin}</span>
              </div>
              <div className="flex justify-between">
                <span>P/N:</span>
                <span className="text-text-primary font-mono text-[10px]">{board.partNumber}</span>
              </div>
              {board.currentStep && (
                <div className="flex justify-between">
                  <span>Paso actual:</span>
                  <span className="text-amber-400">{board.currentStep.title}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Técnico:</span>
                <span className="text-text-primary">{board.technician?.fullName || 'Sin asignar'}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-text-secondary">
              <span>{formatDate(board.createdAt)}</span>
              <span>{board._count.components} comp · {board._count.logs} logs</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
