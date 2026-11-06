// src/app/(dashboard)/taller/[id]/page.tsx
// Vista detallada de tarjeta: Stepper, BOM, Bitácora técnica — Server Component
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { BOARD_STATUS_COLORS, type BoardStatusType } from '@/types'
import { ArrowLeft, CircuitBoard, CheckCircle2, Clock, AlertTriangle, FileText, Gauge, Wrench } from 'lucide-react'
import Link from 'next/link'

const LOG_TYPE_ICONS: Record<string, typeof FileText> = {
  NOTA_TECNICA: FileText,
  MEDICION: Gauge,
  CAMBIO_ESTADO: Wrench,
  ALERTA: AlertTriangle,
}

const LOG_TYPE_COLORS: Record<string, string> = {
  NOTA_TECNICA: 'text-blue-400 bg-blue-500/10',
  MEDICION: 'text-cyan-400 bg-cyan-500/10',
  CAMBIO_ESTADO: 'text-amber-400 bg-amber-500/10',
  ALERTA: 'text-red-400 bg-red-500/10',
}

export default async function BoardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params

  const board = await prisma.electronicBoard.findUnique({
    where: { id },
    include: {
      pipeline: { include: { steps: { orderBy: { stepOrder: 'asc' } } } },
      technician: { select: { fullName: true } },
      currentStep: true,
      stepProgress: {
        include: {
          step: true,
          completedBy: { select: { fullName: true } },
        },
        orderBy: { step: { stepOrder: 'asc' } },
      },
      components: { orderBy: { createdAt: 'asc' } },
      logs: {
        include: { author: { select: { fullName: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!board) notFound()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/taller" className="btn-glass-secondary p-2">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <CircuitBoard className="h-6 w-6 text-neon-blue" />
            <h1 className="text-xl font-bold text-neon-blue font-mono">{board.internalCode}</h1>
            <span className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-medium ${BOARD_STATUS_COLORS[board.status as BoardStatusType]}`}>
              {board.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">{board.modelName} — {board.equipmentOrigin}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Stepper + BOM */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stepper */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Progreso de Reparación</h2>
            <div className="space-y-3">
              {board.stepProgress.map((sp, idx) => {
                const isCompleted = sp.status === 'COMPLETADO'
                const isCurrent = sp.status === 'EN_PROGRESO'
                return (
                  <div key={sp.id} className="flex items-start gap-3">
                    {/* Step indicator */}
                    <div className="flex flex-col items-center">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${
                        isCompleted
                          ? 'bg-green-500/20 border-green-500 text-green-400'
                          : isCurrent
                          ? 'bg-neon-blue/20 border-neon-blue text-neon-blue animate-pulse-subtle'
                          : 'bg-white/5 border-white/10 text-text-secondary'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                      </div>
                      {idx < board.stepProgress.length - 1 && (
                        <div className={`w-0.5 h-6 mt-1 ${isCompleted ? 'bg-green-500/30' : 'bg-white/5'}`} />
                      )}
                    </div>

                    {/* Step info */}
                    <div className="flex-1 pb-2">
                      <p className={`text-sm font-medium ${isCompleted ? 'text-green-400' : isCurrent ? 'text-neon-blue' : 'text-text-secondary'}`}>
                        {sp.step.title}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">{sp.step.description}</p>
                      {sp.completedAt && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-text-secondary">
                          <Clock className="h-3 w-3" />
                          Completado {formatDate(sp.completedAt)} por {sp.completedBy?.fullName}
                        </div>
                      )}
                      {sp.notes && (
                        <p className="text-xs text-amber-400 mt-1 italic">Nota: {sp.notes}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* BOM Components */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-text-primary mb-4">
              Componentes BOM ({board.components.length})
            </h2>
            {board.components.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] text-text-secondary uppercase tracking-wider border-b border-white/5">
                      <th className="pb-2 pr-4">Ref</th>
                      <th className="pb-2 pr-4">Componente</th>
                      <th className="pb-2 pr-4">Encapsulado</th>
                      <th className="pb-2 pr-4">P/N</th>
                      <th className="pb-2 pr-4">Cant</th>
                      <th className="pb-2">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {board.components.map((comp) => (
                      <tr key={comp.id} className="text-text-secondary">
                        <td className="py-2 pr-4 font-mono text-neon-blue text-xs">{comp.designator}</td>
                        <td className="py-2 pr-4 text-text-primary">{comp.componentName}</td>
                        <td className="py-2 pr-4 text-xs">{comp.package || '—'}</td>
                        <td className="py-2 pr-4 font-mono text-[10px]">{comp.partNumber || '—'}</td>
                        <td className="py-2 pr-4">{comp.quantity}</td>
                        <td className="py-2">
                          <span className="inline-flex rounded-md bg-white/5 px-2 py-0.5 text-[10px]">
                            {comp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-text-secondary text-center py-4">Sin componentes registrados</p>
            )}
          </div>
        </div>

        {/* Right sidebar: Info + Logs */}
        <div className="space-y-6">
          {/* Board Info */}
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-text-primary">Información</h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-text-secondary">P/N:</span><span className="text-text-primary font-mono">{board.partNumber}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">S/N:</span><span className="text-text-primary font-mono">{board.serialNumber || '—'}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Pipeline:</span><span className="text-text-primary">{board.pipeline.name}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Técnico:</span><span className="text-text-primary">{board.technician?.fullName || 'Sin asignar'}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Ingreso:</span><span className="text-text-primary">{formatDate(board.createdAt)}</span></div>
            </div>
            <div className="pt-2 border-t border-white/5">
              <p className="text-[11px] text-text-secondary uppercase tracking-wider mb-1">Reporte de Falla</p>
              <p className="text-xs text-text-secondary">{board.failureReport}</p>
            </div>
          </div>

          {/* Technical Log */}
          <div className="glass-card rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-3">
              Bitácora Técnica ({board.logs.length})
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {board.logs.map((log) => {
                const IconComp = LOG_TYPE_ICONS[log.logType] || FileText
                const colorClass = LOG_TYPE_COLORS[log.logType] || 'text-text-secondary bg-white/5'
                return (
                  <div key={log.id} className="rounded-xl bg-white/[0.02] border border-white/5 p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${colorClass}`}>
                        <IconComp className="h-3 w-3" />
                        {log.logType.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-text-secondary ml-auto">{formatDate(log.createdAt)}</span>
                    </div>
                    <p className="text-xs text-text-secondary">{log.content}</p>
                    <p className="text-[10px] text-text-secondary mt-1">— {log.author.fullName}</p>
                  </div>
                )
              })}
              {board.logs.length === 0 && (
                <p className="text-xs text-text-secondary text-center py-4">Sin entradas</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
