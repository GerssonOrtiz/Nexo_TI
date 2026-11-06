// src/app/(dashboard)/tickets/page.tsx
// Listado de tickets con filtros y vista Kanban — Server Component
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Ticket as TicketIcon, Plus } from 'lucide-react'
import { TICKET_STATUS_COLORS, TICKET_PRIORITY_COLORS, type TicketStatusType, type TicketPriorityType } from '@/types'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function TicketsPage() {
  const user = await requireAuth()

  const where = user.role === 'SOLICITANTE' ? { creatorId: user.id } : {}

  const tickets = await prisma.ticket.findMany({
    where,
    include: {
      creator: { select: { fullName: true } },
      assignee: { select: { fullName: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Group by status for kanban
  const statusGroups: Record<string, typeof tickets> = {
    ABIERTO: [],
    EN_PROGRESO: [],
    EN_ESPERA: [],
    RESUELTO: [],
    CERRADO: [],
  }
  tickets.forEach((t) => {
    if (statusGroups[t.status]) statusGroups[t.status].push(t)
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <TicketIcon className="h-6 w-6 text-neon-blue" />
            Mesa de Ayuda
          </h1>
          <p className="text-text-secondary text-sm mt-1">{tickets.length} tickets</p>
        </div>
        <Link href="/dashboard/tickets/new" className="btn-neon-primary flex items-center gap-2 text-sm">
          <Plus className="h-4 w-4" />
          Nuevo Ticket
        </Link>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {Object.entries(statusGroups).map(([status, items]) => (
          <div key={status} className="space-y-3">
            {/* Column Header */}
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium ${TICKET_STATUS_COLORS[status as TicketStatusType]}`}>
                {status.replace('_', ' ')}
              </span>
              <span className="text-xs text-text-secondary">{items.length}</span>
            </div>

            {/* Cards */}
            <div className="space-y-2">
              {items.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/dashboard/tickets/${ticket.id}`}
                  className="glass-card block rounded-xl p-4 transition-all hover:scale-[1.01] hover:border-neon-blue/20"
                >
                  <h3 className="text-sm font-medium text-text-primary line-clamp-2">{ticket.title}</h3>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-medium ${TICKET_PRIORITY_COLORS[ticket.priority as TicketPriorityType]}`}>
                      {ticket.priority}
                    </span>
                    <span className="text-[10px] text-text-secondary">{ticket.category}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[10px] text-text-secondary">
                    <span>{ticket.creator.fullName}</span>
                    <span>{formatDate(ticket.createdAt)}</span>
                  </div>
                </Link>
              ))}
              {items.length === 0 && (
                <div className="rounded-xl border border-dashed border-white/5 p-4 text-center text-xs text-text-secondary">
                  Sin tickets
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
