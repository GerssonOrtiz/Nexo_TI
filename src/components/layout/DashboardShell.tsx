// src/components/layout/DashboardShell.tsx
// Shell principal del dashboard con sidebar y navbar floating
'use client'

import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-forge linux-grid-bg">
      <Sidebar />
      {/* Main content area offset by sidebar width */}
      <div className="pl-[280px] transition-all duration-300">
        <div className="flex flex-col gap-4 py-4 pr-4">
          <Navbar />
          <main className="px-2">{children}</main>
        </div>
      </div>
    </div>
  )
}
