// src/app/(dashboard)/admin/page.tsx
// Panel de administración — vista de audit logs y usuarios
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Shield, Users, Activity } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function AdminPage() {
  await requireAdmin()

  const [users, recentLogs] = await Promise.all([
    prisma.user.findMany({
      where: { deletedAt: null },
      select: { id: true, fullName: true, username: true, role: true, isActive: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.auditLog.findMany({
      include: { user: { select: { fullName: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
        <Shield className="h-6 w-6 text-neon-blue" />
        Administración
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-neon-blue" />
            Usuarios ({users.length})
          </h2>
          <div className="space-y-2">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/5 p-3">
                <div>
                  <p className="text-sm font-medium text-text-primary">{u.fullName}</p>
                  <p className="text-[11px] text-text-secondary">@{u.username}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${u.role === 'ADMIN_TI' ? 'bg-neon-purple/20 text-neon-purple' : 'bg-blue-500/20 text-blue-400'}`}>
                    {u.role}
                  </span>
                  <span className={`h-2 w-2 rounded-full ${u.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Logs */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-neon-blue" />
            Últimos Eventos de Auditoría
          </h2>
          <div className="space-y-1.5 max-h-[600px] overflow-y-auto">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 rounded-lg bg-white/[0.01] p-2.5 text-xs">
                <span className={`shrink-0 mt-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                  log.action === 'CREATE' ? 'bg-green-500/10 text-green-400'
                    : log.action === 'STATUS_CHANGE' ? 'bg-amber-500/10 text-amber-400'
                    : log.action === 'DELETE' ? 'bg-red-500/10 text-red-400'
                    : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {log.action}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-text-primary">{log.entity}</span>
                  <span className="text-text-secondary"> por {log.user?.fullName || 'Sistema'}</span>
                  <p className="text-[10px] text-text-secondary mt-0.5">{formatDate(log.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
