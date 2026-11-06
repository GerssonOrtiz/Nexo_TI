// src/app/(dashboard)/tickets/[id]/page.tsx
// Detalle de ticket individual — Server Component + comentarios
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { TICKET_STATUS_COLORS, TICKET_PRIORITY_COLORS, type TicketStatusType, type TicketPriorityType } from '@/types'
import { ArrowLeft, MessageSquare, User, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireAuth()
  const { id } = await params

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      creator: { select: { fullName: true, username: true } },
      assignee: { select: { fullName: true, username: true } },
      comments: {
        include: { author: { select: { fullName: true, role: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!ticket) notFound()

  // IDOR prevention
  if (user.role === 'SOLICITANTE' && ticket.creatorId !== user.id) {
    redirect('/dashboard/tickets')
  }

  // Filter internal comments for non-admins
  const visibleComments = user.role === 'ADMIN_TI'
    ? ticket.comments
    : ticket.comments.filter((c) => !c.isInternal)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back nav */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/tickets" className="btn-glass-secondary p-2">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text-primary">{ticket.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex rounded-lg border px-2 py-0.5 text-xs font-medium ${TICKET_STATUS_COLORS[ticket.status as TicketStatusType]}`}>
              {ticket.status.replace('_', ' ')}
            </span>
            <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${TICKET_PRIORITY_COLORS[ticket.priority as TicketPriorityType]}`}>
              {ticket.priority}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main */}
        <div className="lg:col-span-2 space-y-4">
          {/* Description */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Descripción</h2>
            <p className="text-sm text-text-secondary whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {/* Comments */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-neon-blue" />
              Comentarios ({visibleComments.length})
            </h2>
            <div className="space-y-3">
              {visibleComments.map((comment) => (
                <div key={comment.id} className={`rounded-xl p-4 ${comment.isInternal ? 'bg-amber-500/5 border border-amber-500/10' : 'bg-white/[0.02] border border-white/5'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-text-primary">{comment.author.fullName}</span>
                    <span className="text-[10px] text-text-secondary">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-text-secondary">{comment.content}</p>
                  {comment.isInternal && (
                    <span className="mt-2 inline-block text-[10px] text-amber-400 bg-amber-500/10 rounded px-1.5 py-0.5">Nota interna</span>
                  )}
                </div>
              ))}
              {visibleComments.length === 0 && (
                <p className="text-xs text-text-secondary text-center py-4">Sin comentarios</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div>
              <p className="text-[11px] text-text-secondary uppercase tracking-wider mb-1">Creado por</p>
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-neon-blue" />
                <span className="text-sm text-text-primary">{ticket.creator.fullName}</span>
              </div>
            </div>
            <div>
              <p className="text-[11px] text-text-secondary uppercase tracking-wider mb-1">Asignado a</p>
              <span className="text-sm text-text-primary">{ticket.assignee?.fullName || 'Sin asignar'}</span>
            </div>
            <div>
              <p className="text-[11px] text-text-secondary uppercase tracking-wider mb-1">Categoría</p>
              <span className="text-sm text-text-primary">{ticket.category}</span>
            </div>
            <div>
              <p className="text-[11px] text-text-secondary uppercase tracking-wider mb-1">Creado</p>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-text-secondary" />
                <span className="text-xs text-text-secondary">{formatDate(ticket.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
