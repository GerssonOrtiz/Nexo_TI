// src/app/(dashboard)/taller/new/page.tsx
// Formulario de nueva tarjeta electrónica
'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CircuitBoard, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Pipeline {
  id: string
  name: string
}

export default function NewBoardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pipelines, setPipelines] = useState<Pipeline[]>([])

  useEffect(() => {
    fetch('/api/taller/pipelines')
      .then((r) => r.json())
      .then((d) => { if (d.success) setPipelines(d.data) })
      .catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const fd = new FormData(e.currentTarget)
    const body = {
      partNumber: fd.get('partNumber'),
      serialNumber: fd.get('serialNumber') || undefined,
      modelName: fd.get('modelName'),
      equipmentOrigin: fd.get('equipmentOrigin'),
      failureReport: fd.get('failureReport'),
      pipelineId: fd.get('pipelineId'),
    }

    try {
      const res = await fetch('/api/taller/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (!data.success) {
        setError(data.error || 'Error al crear tarjeta')
        return
      }

      router.push('/dashboard/taller')
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
        <Link href="/dashboard/taller" className="btn-glass-secondary p-2">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <CircuitBoard className="h-5 w-5 text-neon-blue" />
          Nueva Tarjeta Electrónica
        </h1>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Número de Parte (P/N)</label>
            <input name="partNumber" className="input-cyber w-full" placeholder="e.g. PCB-CTRL-2026A" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Número de Serie (S/N)</label>
            <input name="serialNumber" className="input-cyber w-full" placeholder="Opcional" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Modelo</label>
            <input name="modelName" className="input-cyber w-full" placeholder="e.g. Controlador Inversor XYZ" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Equipo de Origen</label>
            <input name="equipmentOrigin" className="input-cyber w-full" placeholder="e.g. Soldadora Lincoln V350" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Pipeline de Reparación</label>
          <select name="pipelineId" className="input-cyber w-full" required>
            <option value="">Seleccionar pipeline...</option>
            {pipelines.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Reporte de Falla</label>
          <textarea name="failureReport" rows={4} className="input-cyber w-full resize-none" placeholder="Describa el fallo observado, síntomas, condiciones..." required minLength={10} />
        </div>

        <button type="submit" disabled={loading} className="btn-neon-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <><CircuitBoard className="h-4 w-4" /> Registrar Tarjeta</>}
        </button>
      </form>
    </div>
  )
}
