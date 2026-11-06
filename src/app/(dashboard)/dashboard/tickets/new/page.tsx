// src/app/(dashboard)/tickets/new/page.tsx
// Formulario de creación de ticket — Client Component
'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function NewTicketPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const body = {
      title: formData.get('title'),
      description: formData.get('description'),
      priority: formData.get('priority'),
      category: formData.get('category'),
    }

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (!data.success) {
        setError(data.error || 'Error al crear ticket')
        return
      }

      router.push('/dashboard/tickets')
      router.refresh()
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/tickets" className="btn-glass-secondary p-2">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-xl font-bold text-text-primary">Nuevo Ticket</h1>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1.5">Título</label>
          <input id="title" name="title" className="input-cyber w-full" placeholder="Describa brevemente el problema" required minLength={3} />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1.5">Descripción</label>
          <textarea id="description" name="description" rows={5} className="input-cyber w-full resize-none" placeholder="Detalle el problema, incluya pasos para reproducir..." required minLength={10} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-text-secondary mb-1.5">Prioridad</label>
            <select id="priority" name="priority" className="input-cyber w-full" defaultValue="MEDIA">
              <option value="BAJA">Baja</option>
              <option value="MEDIA">Media</option>
              <option value="ALTA">Alta</option>
              <option value="CRITICA">Crítica</option>
            </select>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-1.5">Categoría</label>
            <select id="category" name="category" className="input-cyber w-full" defaultValue="OTRO">
              <option value="HARDWARE">Hardware</option>
              <option value="SOFTWARE">Software</option>
              <option value="RED">Red</option>
              <option value="ACCESOS">Accesos</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-neon-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <><Send className="h-4 w-4" /> Crear Ticket</>}
        </button>
      </form>
    </div>
  )
}
