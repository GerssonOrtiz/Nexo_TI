// src/types/index.ts
// Tipos globales compartidos

export type UserRole = 'SOLICITANTE' | 'ADMIN_TI'

export interface SessionUser {
  id: string
  fullName: string
  username: string
  role: UserRole
  isActive: boolean
}

// Respuesta estándar de API (workflow-driven-saas pattern)
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

// Ticket types
export type TicketStatusType = 'ABIERTO' | 'EN_PROGRESO' | 'EN_ESPERA' | 'RESUELTO' | 'CERRADO'
export type TicketPriorityType = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA'
export type TicketCategoryType = 'HARDWARE' | 'SOFTWARE' | 'RED' | 'ACCESOS' | 'OTRO'

// Board types
export type BoardStatusType = 'EN_COLA' | 'EN_DIAGNOSTICO' | 'EN_REPARACION' | 'ESPERA_REPUESTOS' | 'EN_PRUEBAS' | 'REPARADA' | 'IRREPARABLE'
export type BoardLogTypeValue = 'NOTA_TECNICA' | 'MEDICION' | 'CAMBIO_ESTADO' | 'ALERTA'

// Status color mappings for UI
export const TICKET_STATUS_COLORS: Record<TicketStatusType, string> = {
  ABIERTO: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  EN_PROGRESO: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  EN_ESPERA: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  RESUELTO: 'bg-green-500/20 text-green-400 border-green-500/30',
  CERRADO: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export const TICKET_PRIORITY_COLORS: Record<TicketPriorityType, string> = {
  BAJA: 'bg-slate-500/20 text-slate-400',
  MEDIA: 'bg-blue-500/20 text-blue-400',
  ALTA: 'bg-orange-500/20 text-orange-400',
  CRITICA: 'bg-red-500/20 text-red-400',
}

export const BOARD_STATUS_COLORS: Record<BoardStatusType, string> = {
  EN_COLA: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  EN_DIAGNOSTICO: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  EN_REPARACION: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  ESPERA_REPUESTOS: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  EN_PRUEBAS: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  REPARADA: 'bg-green-500/20 text-green-400 border-green-500/30',
  IRREPARABLE: 'bg-red-500/20 text-red-400 border-red-500/30',
}
