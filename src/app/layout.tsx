// src/app/layout.tsx
// Root Layout — fuente y estilos Glassmorphism base

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nexo TI — Sistema de Gestión de TI & Taller Electrónico',
  description: 'Plataforma unificada de mesa de ayuda, taller electrónico y base de conocimiento para soporte técnico de TI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  )
}
