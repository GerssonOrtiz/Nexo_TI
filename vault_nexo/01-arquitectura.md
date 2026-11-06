---
title: Arquitectura del Sistema Nexo TI
aliases: [Arquitectura, ADR, Stack, Flujo Auth]
tags: [arquitectura, adr, next-js, supabase, server-first, tech-stack]
created: 2026-11-05
updated: 2026-11-05
---

# 🏗️ Arquitectura del Sistema

Sistema unificado full-stack con arquitectura **Server-First**, despliegue en Vercel y persistencia en Supabase PostgreSQL vía Prisma ORM.

---

## 🧰 Stack Tecnológico

| Capa | Tecnología | Versión | Rol | Justificación |
|---|---|---|---|---|
| **Framework** | Next.js (App Router) | 15.1.7 | Full-stack unificado | Elimina complejidad de monorepo, Server Components para streaming y SSR rápido |
| **UI Library** | React | 19.0.0 | Componentes UI | Base de componentes reactivos y concurrencia |
| **Lenguaje** | TypeScript | 5.7+ | Tipado estricto | Cero errores de tipado, contratos seguros en backend y frontend |
| **Estilos** | Tailwind CSS | 3.4+ | Utility-first + Glassmorphism | Estilizado atómico, diseño Dark Cyber sin peso excesivo |
| **ORM** | Prisma | 5.22 | Acceso a BD con tipos seguros | Migraciones consistentes, cliente tipado auto-generado |
| **Base de Datos** | PostgreSQL (Supabase) | — | Persistencia relacional | Soporta transacciones ACID, pooler pgbouncer y directUrl |
| **Autenticación** | Supabase Auth SSR | 0.5+ | Cookies HttpOnly, Server-First | Cero flicker, protección XSS, validación criptográfica `getUser()` |
| **Validación** | Zod | 3.24+ | Schemas de entrada en APIs | Validación en runtime de payloads de entrada |
| **Iconos** | Lucide React | 0.475+ | Iconografía consistente | Set completo, ligero y tree-shakeable |
| **Despliegue** | Vercel | — | Hosting con zero-config | Integración nativa Next.js sin errores de autodetección |

---

## 🏛️ Decisiones Arquitectónicas (ADR)

### ADR-001: Full-Stack Unificado en Next.js (vs. Monorepo Vite+Express)
- **Contexto:** El repositorio anterior era un monorepo pnpm con `apps/frontend` (Vite) y `apps/backend` (Express), causando errores de detección en Vercel (*"Multiple apps detected"*) y cold starts en Render.
- **Decisión:** Migrar a una única aplicación Next.js 15+ App Router con Server Actions y Route Handlers (`/api/...`) como backend unificado.
- **Consecuencia:** Cero problemas de autodetección en Vercel, latencia eliminada, pipeline de CI/CD unificado, simplificación de variables de entorno.

### ADR-002: Server-First Auth con `@supabase/ssr`
- **Contexto:** El sistema anterior guardaba `refreshToken` en `localStorage`, exponiéndolo a ataques XSS y produciendo parpadeo (*flash of unauthenticated content*).
- **Decisión:** Adoptar `@supabase/ssr` con cookies `HttpOnly` y validación criptográfica mediante `getUser()` en middleware y Server Components (`src/lib/auth.ts`).
- **Consecuencia:** Sesiones robustas e inmunes a robo por JS, cero flicker en carga inicial, redirecciones protegidas con propagación íntegra de cookies.

### ADR-003: Soft Delete + Audit Log Inmutable
- **Contexto:** Las eliminaciones físicas (hard delete) rompían bitácoras de auditoría, historiales de tickets y claves foráneas.
- **Decisión:** Implementar `deletedAt` y `isActive` en usuarios; tabla `AuditLog` como registro estrictamente inmutable (*append-only*); `onDelete: Cascade` en logs y componentes vinculados a tarjetas electrónicas.
- **Consecuencia:** Integridad referencial preservada, trazabilidad histórica completa para cumplimiento normativo.

### ADR-004: Dark Cyber Glassmorphism
- **Contexto:** El taller de electrónica y la mesa de ayuda requerían una interfaz moderna, inmersiva y de alto contraste tipo estación técnica de control.
- **Decisión:** Adoptar la estética Dark Forge con tarjetas translúcidas (`.glass-card`), acentos neón (`#00D2FF`, `#818CF8`) y sidebar flotante tipo Apple Vision Pro.
- **Restricciones:** Cero dependencias pesadas de animación (sin Framer Motion). Solo transiciones nativas de Tailwind y CSS. Controles interactivos (dropdowns, modales) siempre 100% opacos (`bg-elevated`) para cumplimiento WCAG AA.

---

## 🔐 Flujo de Autenticación Server-First

```
Petición HTTP
     │
     ▼
src/middleware.ts
     │  ┌─ Ruta pública (/login, /api/auth/*)  → pasar
     │  ├─ Sin sesión válida                     → redirect /login (con cookies propagadas)
     │  ├─ Con sesión + visita /login            → redirect /dashboard
     │  └─ Con sesión + ruta protegida           → continuar
     │
     ▼
src/app/(dashboard)/layout.tsx  ← SERVER COMPONENT
     │  requireAuth() → getAuthUser()
     │    → supabase.auth.getUser() (validación criptográfica)
     │    → prisma.user.findUnique() (enriquecer + verificar isActive + !deletedAt)
     │    → si falla → redirect /login
     │    → si OK → inyectar en <UserProvider user={...}>
     │
     ▼
Componentes Client usan useUser() (sync, sin loading, sin flicker)
```

---

*Ver más:* [[00-INDEX|Índice General]] · [[05-modulos-sistema|Módulos del Sistema]] · [[03-modelo-datos|Modelo de Datos]]
