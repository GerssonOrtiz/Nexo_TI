# Nexo TI — Proyecto V2

## Identidad
- **Nombre:** Nexo TI — Sistema de Gestión de TI & Taller Electrónico
- **Versión:** 2.0.0
- **Repositorio:** `C:\Users\gorti\Desktop\Nexo_TI`
- **Rama principal:** master
- **Stack:** Next.js 15.1.7 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 3 · Prisma 5 · Supabase SSR · Zod
- **Despliegue:** Vercel (full-stack unificado)
- **UI:** Dark Cyber Glassmorphism (paleta Dark Forge · neon accents · Vision Pro sidebar)

## Cerebro Modular del Proyecto (`vault_nexo/`)
El agente puede consultar la documentación detallada y modularizada en:
- `vault_nexo/00-INDEX.md` — Índice y mapa general (MOC)
- `vault_nexo/01-arquitectura.md` — Stack, ADR-001 a ADR-004, flujo Server-First Auth
- `vault_nexo/02-estructura-proyecto.md` — Mapa de directorios y archivos
- `vault_nexo/03-modelo-datos.md` — 14 modelos Prisma, ER Mermaid y 9 Enums
- `vault_nexo/04-sistema-diseno.md` — Tokens Dark Cyber Glassmorphism y reglas WCAG
- `vault_nexo/05-modulos-sistema.md` — Auth, Tickets Kanban, Taller, KB y Admin
- `vault_nexo/06-api-reference.md` — Endpoints REST y contratos JSON
- `vault_nexo/07-estado-actual.md` — Fases 1 a 3 completadas
- `vault_nexo/08-roadmap-fase-4.md` — Pendientes: Códigos QR, Command Palette, Auditoría, PDF
- `vault_nexo/09-guias-operativas.md` — Variables `.env`, scripts de desarrollo y despliegue

## Skills Aplicadas
- `nextjs-server-first-auth` — Patrón getUser(), propagación de cookies en redirect, UserProvider sync
- `cyber-glassmorphism-ui` — Tokens Dark Forge, .glass-card, .vision-sidebar-capsule, controles opacos WCAG AA
- `workflow-driven-saas` — Máquina de estados en pipeline, bitácora inmutable, respuestas API {success, data?, error?}

## Convenciones Críticas
- Server Components por defecto; `'use client'` solo donde se necesita interactividad
- Validación con `supabase.auth.getUser()` (criptográfica), nunca `getSession()`
- API Routes con `{ success, data?, error? }` uniforme
- Prisma singleton en `src/lib/prisma.ts`
- Audit log append-only en toda acción relevante (CREATE, UPDATE, DELETE, STATUS_CHANGE)
- Dropdowns y modales 100% opacos (`bg-elevated`)
