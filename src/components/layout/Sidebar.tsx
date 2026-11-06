// src/components/layout/Sidebar.tsx
// Floating sidebar con estética Vision Pro capsule — Cyber Glassmorphism
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/useUser'
import {
  LayoutDashboard,
  Ticket,
  CircuitBoard,
  BookOpen,
  Shield,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['SOLICITANTE', 'ADMIN_TI'] },
  { href: '/dashboard/tickets', label: 'Mesa de Ayuda', icon: Ticket, roles: ['SOLICITANTE', 'ADMIN_TI'] },
  { href: '/dashboard/taller', label: 'Taller Electrónico', icon: CircuitBoard, roles: ['ADMIN_TI'] },
  { href: '/dashboard/kb', label: 'Base de Conocimiento', icon: BookOpen, roles: ['SOLICITANTE', 'ADMIN_TI'] },
  { href: '/dashboard/admin', label: 'Administración', icon: Shield, roles: ['ADMIN_TI'] },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const user = useUser()

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(user.role)
  )

  return (
    <aside
      className={cn(
        'vision-sidebar-capsule fixed left-4 top-4 bottom-4 z-40 flex flex-col transition-all duration-300 ease-in-out',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple shadow-neon-glow">
          <Zap className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-base font-bold text-text-primary tracking-tight">
              Nexo TI
            </h1>
            <p className="text-[11px] text-text-secondary truncate">
              Sistema de Gestión v2
            </p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-white/[0.06]" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'vision-item-bubble flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-neon-blue/10 text-neon-blue'
                  : 'text-text-secondary hover:text-text-primary'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={cn('h-5 w-5 shrink-0', isActive && 'drop-shadow-[0_0_6px_rgba(0,210,255,0.5)]')} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 pb-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="vision-item-bubble flex w-full items-center justify-center gap-2 px-3 py-2 text-xs text-text-secondary hover:text-text-primary"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Colapsar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
