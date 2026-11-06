// src/app/(dashboard)/dashboard/page.tsx
// Dashboard principal — vista de resumen con cards glassmorphism

import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { LayoutDashboard, Ticket, CircuitBoard, BookOpen } from 'lucide-react'

export default async function DashboardPage() {
  const user = await requireAuth()

  // Obtener métricas en paralelo
  const [ticketCount, boardCount, kbCount] = await Promise.all([
    prisma.ticket.count({
      where: user.role === 'ADMIN_TI' ? {} : { creatorId: user.id },
    }),
    prisma.electronicBoard.count(),
    prisma.knowledgeArticle.count({ where: { isPublished: true } }),
  ])

  const stats = [
    {
      label: 'Tickets Activos',
      value: ticketCount,
      icon: Ticket,
      color: 'from-blue-500 to-cyan-500',
      href: '/dashboard/tickets',
    },
    {
      label: 'Tarjetas en Taller',
      value: boardCount,
      icon: CircuitBoard,
      color: 'from-amber-500 to-orange-500',
      href: '/dashboard/taller',
    },
    {
      label: 'Artículos KB',
      value: kbCount,
      icon: BookOpen,
      color: 'from-green-500 to-emerald-500',
      href: '/dashboard/kb',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-neon-blue" />
          Dashboard
        </h1>
        <p className="text-text-secondary mt-1">
          Bienvenido, <span className="text-neon-blue font-medium">{user.fullName}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className="glass-card rounded-2xl p-6 transition-all hover:scale-[1.02] hover:shadow-neon-glow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">{stat.label}</p>
                <p className="text-3xl font-bold text-text-primary mt-1">{stat.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
