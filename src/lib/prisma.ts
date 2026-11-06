// src/lib/prisma.ts
// Cliente singleton de Prisma para evitar múltiples instancias en entornos serverless y hot-reload
// Garantiza reutilización de conexión y compatibilidad con PgBouncer en producción

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

// Persistir singleton en globalThis en todos los entornos para evitar fugas de conexiones en lambdas/reloads
globalForPrisma.prisma = prisma

