# Intent: Inicialización V2 Next.js 15+ Core Funcional - Nexo_TI

- **Execution ID:** EXEC-20261105-nextjs15-core
- **Fecha:** 2026-11-05
- **Estado:** Confirmado por el programador
- **Riesgo:** MEDIO

## 1. Objetivo Central
Construir la base y núcleo funcional completo de Nexo_TI V2 en Next.js 15+ (App Router) unificado con Supabase SSR y Prisma, optimizado para despliegue directo en Vercel y diseñado con la estética Dark Cyber Glassmorphism.

## 2. Criterios de Aceptación
1. Estructura unificada Next.js 15+ lista para Vercel sin problemas de "multiple apps".
2. Configuración de autenticación Server-First con `@supabase/ssr` (cookies HttpOnly, cero tokens en localStorage).
3. Prisma Schema con `directUrl`, soporte para Soft Delete (`deletedAt`, `isActive`), cascadas íntegras en logs y tipos de auditoría.
4. Módulos Core implementados:
   - Autenticación y Layout protegido.
   - Mesa de Ayuda / Tickets & Kanban de soporte TI.
   - Taller Electrónico (Tarjetas, Stepper de progreso, BOM, Bitácora técnica).
   - Base de conocimiento (KB con Markdown sanitizado).
5. Sistema visual Cyber Glassmorphism integrado (paleta Dark Forge, glass cards, neon accents).
6. Compilación de TypeScript y build libre de errores sintácticos.
7. Auditoría independiente completada sin veredictos de rechazo.

## 3. Alcance Incluido
- Fases 1, 2 y 3 del blueprint `NUEVA_ARQUITECTURA_PLAN.md`.
- Skills aplicadas: `nextjs-server-first-auth`, `cyber-glassmorphism-ui`, `workflow-driven-saas`.

## 4. Alcance Excluido
- Fase 4 (Generación física de Códigos QR, Command Palette Ctrl+K, Exportación masiva PDF/Excel). Se programará como iteración subsiguiente.
