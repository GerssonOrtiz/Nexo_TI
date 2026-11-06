# Auditoría Independiente: Nexo_TI V2 en Next.js 15+ Core

- **Execution ID:** EXEC-20261105-nextjs15-core
- **Iteración:** 1
- **Fecha:** 2026-11-05
- **Estado de auditoría:** COMPLETADA
- **Veredicto:** REJECTED (RECHAZADO - Requiere correcciones de rutas e IDOR)
- **Rama / HEAD auditados:** master (Directorio Nexo_TI)
- **Commits inspeccionados:** N/A (Árbol de trabajo sin commits previos)
- **Skills y fuentes aplicadas:**
  - cyber-glassmorphism-ui
  - 
extjs-server-first-auth
  - workflow-driven-saas
  - .agents/PROJECT.md, NEXO_TI_BRAIN.md, NUEVA_ARQUITECTURA_PLAN.md

---

## 1. Resumen Ejecutivo

Se auditó de forma exhaustiva e independiente la implementación del Core Funcional de **Nexo TI V2** en Next.js 15+ App Router, Prisma ORM, Supabase SSR y Tailwind CSS.

### Logros Comprobados:
1. **Compilación y Tipado:** `pnpm run build` y `tsc --noEmit` ejecutados con **cero errores**; las 18 rutas (API y páginas) compilan exitosamente.
2. **Arquitectura Server-First:** Implementación impecable del patrón Server Component en `DashboardLayout` con `requireAuth()` y alimentación síncrona a `UserProvider` (previniendo parpadeo de carga).
3. **Persistencia e Integridad:** Esquema Prisma con `directUrl`, relaciones con `onDelete: Cascade` en componentes y bitácoras de tarjetas, soft delete (`deletedAt`) y transacciones atómicas (`prisma.$transaction`) para el avance de etapas en taller.
4. **Diseño Visual:** Adopción fidedigna del Cyber Glassmorphism (paleta Dark Forge, glass cards con specular highlights, inputs y dropdowns opacos en `#1a2236`).

### Motivo de Rechazo:
A pesar de la sólida base de código, se detectó un defecto funcional crítico en la arquitectura de enrutamiento (**Hallazgo 01 - Severidad ALTA**): todas las páginas del dashboard residen en el route group `src/app/(dashboard)/`, lo que genera URLs raíz (`/tickets`, `/taller`, `/kb`, `/admin`), pero **todos los enlaces de la interfaz** (`Sidebar.tsx`, métricas de `DashboardPage`, links de detalle y creación) apuntan a `/dashboard/tickets`, `/dashboard/taller`, etc., provocando que **el 100% de la navegación resulte en 404 Not Found**. Adicionalmente se identificó una falla de autorización IDOR en `PATCH /api/tickets/[id]` (**Hallazgo 02 - Severidad ALTA**).

---

## 2. Criterios de Aceptación

| Criterio | Estado | Evidencia | Observación |
|---|---|---|---|
| **1. Unificación Vercel** | PASS | `package.json`, `vercel.json` raíz | Monorepo fragmentado eliminado. Un solo build command. |
| **2. Autenticación Server-First** | PASS | `src/lib/supabase/server.ts`, `src/lib/auth.ts` | Uso de `getUser()` y `cookies()` async de Next.js 15. |
| **3. Integridad Relacional & Prisma** | PASS | `prisma/schema.prisma` | `directUrl` configurado, cascade en logs/steps, soft delete en User. |
| **4. Módulos Core (Tickets, Taller, KB)** | FAIL | `src/components/layout/Sidebar.tsx`, `src/app/(dashboard)/*` | Rutas funcionales en backend, pero inaccesibles desde la navegación por desfase de URLs (`/dashboard/...` vs `/tickets`, etc.). |
| **5. Diseño Cyber Glassmorphism** | PASS | `src/app/globals.css`, `tailwind.config.ts` | Tokens Dark Forge, glass cards, neones WCAG AA y controles opacos. |
| **6. Compilación y Tipado** | PASS | `pnpm run build` exitoso | 18 rutas generadas, 0 errores de TypeScript (`tsc --noEmit`). |

---

## 3. Cumplimiento del Plan

| Paso | Resultado real | Desvío | Autorización | Estado |
|---|---|---|---|---|
| **PASO-01** Setup inicial y configs | Archivos base creados | Ninguno | Conforme | PASS |
| **PASO-02** Tailwind & Glassmorphism | Tokens y clases CSS integrados | Ninguno | Conforme | PASS |
| **PASO-03** Modelo Prisma y seed | Schema y seed creados | Inconsistencia auth/email en seed | No autorizada | OBSERVATION |
| **PASO-04** Supabase SSR & Middleware | Server client, client y middleware | Opciones de cookies en redirect | Tolerable | PASS |
| **PASO-05** Shell Dashboard & Sidebar | Sidebar, Navbar y DashboardShell | URLs en enlaces con prefijo erróneo `/dashboard/...` | No autorizada | FAIL |
| **PASO-06** Auth (Login / Logout) | Login interactivo y endpoints API | Requiere email pero seed crea username sin Supabase | Desvío arquitectónico | OBSERVATION |
| **PASO-07** Mesa de Ayuda (Tickets) | CRUD API, Kanban, Detalle | IDOR en PATCH /api/tickets/[id]; links rotos | No autorizada | FAIL |
| **PASO-08** Taller Electrónico | Stepper transaccional, BOM, logs | Links rotos en frontend; backend excelente | No autorizada | OBSERVATION |
| **PASO-09** Base de Conocimiento | Artículos, Markdown sanitizado | Links rotos en frontend | No autorizada | OBSERVATION |
| **PASO-10** Validación de Build | Build exitoso verificado | Lint interactivo no configurado | Tolerable | PASS |

---

## 4. Hallazgos

### [HALLAZGO-01] Desfase de Enrutamiento App Router provoca 404 en toda la Navegación
- **Estado:** FAIL
- **Severidad:** ALTA
- **Evidencia:**
  - Estructura de carpetas: `src/app/(dashboard)/tickets/page.tsx`, `taller/page.tsx`, `kb/page.tsx`, `admin/page.tsx`.
  - Next.js emite las rutas: `/tickets`, `/taller`, `/kb`, `/admin`. (Los route groups `(dashboard)` se omiten de la URL en App Router).
  - Enlaces en código:
    - `src/components/layout/Sidebar.tsx` (Líneas 22-26): `href: '/dashboard/tickets'`, `href: '/dashboard/taller'`, etc.
    - `src/app/(dashboard)/dashboard/page.tsx` (Líneas 26, 33, 40): `href: '/dashboard/tickets'`, etc.
    - `src/app/(dashboard)/tickets/page.tsx` (Líneas 48, 71): `href="/dashboard/tickets/new"`, `href="/dashboard/tickets/"`.
    - `src/app/(dashboard)/taller/page.tsx` (Líneas 40, 61): `href="/dashboard/taller/new"`, `href="/dashboard/taller/"`.
    - `src/app/(dashboard)/kb/page.tsx` (Línea 54) y `kb/[slug]/page.tsx` (Línea 66): `href="/dashboard/kb/..."`.
- **Impacto:** Cualquier interacción del usuario en la barra lateral o tarjetas del dashboard conduce a una página 404 (Not Found).
- **Recomendación correctiva:**
  *Opción A (Recomendada):* Anidar las carpetas dentro de `src/app/(dashboard)/dashboard/` (ej. `src/app/(dashboard)/dashboard/tickets/page.tsx`), o
  *Opción B:* Actualizar todos los `href` y `router.push` en el frontend para apuntar a `/tickets`, `/taller`, `/kb`, `/admin`.
- **¿Bloquea aceptación?:** Sí.

---

### [HALLAZGO-02] Vulnerabilidad IDOR en PATCH /api/tickets/[id]
- **Estado:** FAIL
- **Severidad:** ALTA
- **Evidencia:** `src/app/api/tickets/[id]/route.ts` (Líneas 78-86):
  `	s
  const existing = await prisma.ticket.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ ... }, { status: 404 })

  if (user.role !== 'ADMIN_TI' && (parsed.data.status || parsed.data.assigneeId !== undefined)) {
    return NextResponse.json({ success: false, error: 'Sin permisos' }, { status: 403 })
  }
  `
- **Impacto:** Si un `SOLICITANTE` envía un `PATCH /api/tickets/:id` modificando solo `title` o `description`, el endpoint **no valida** que `existing.creatorId === user.id`. Un solicitante puede adulterar los títulos y descripciones de tickets creados por otros empleados.
- **Recomendación correctiva:** Agregar validación de pertenencia para solicitantes:
  `	s
  if (user.role === 'SOLICITANTE' && existing.creatorId !== user.id) {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 })
  }
  `
- **¿Bloquea aceptación?:** Sí.

---

### [HALLAZGO-03] Incompatibilidad de Flujo de Autenticación Seed vs Supabase Auth
- **Estado:** OBSERVATION
- **Severidad:** MEDIA
- **Evidencia:** `prisma/seed.ts` (Líneas 19-27) y `prisma/schema.prisma` (Líneas 109-118):
  - El modelo `User` en Prisma no tiene campo `email` (solo `username`).
  - `seed.ts` crea un usuario local en Postgres con `username: Venllas` y hash local bcrypt.
  - `src/app/api/auth/login/route.ts` y la pantalla de login exigen `email` y ejecutan `supabase.auth.signInWithPassword`.
  - `src/lib/auth.ts` busca el usuario por `where: { id: user.id }` con el UUID de Supabase.
- **Impacto:** El usuario administrador generado por el seeder no puede iniciar sesión mediante la UI a menos que se cree previamente en el panel de Supabase Auth con el mismo UUID.
- **Recomendación correctiva:** Añadir campo `email String @unique` al modelo `User` de Prisma y documentar el script de aprovisionamiento en Supabase Auth o proveer un endpoint de webhook/sincronización.
- **¿Bloquea aceptación?:** No bloquea la compilación, pero impide el login de desarrollo inmediato sin Supabase configurado.

---

### [HALLAZGO-04] Pérdida de Opciones de Cookies en Redirecciones de Middleware
- **Estado:** OBSERVATION
- **Severidad:** BAJA
- **Evidencia:** `src/middleware.ts` (Líneas 51-53 y 65-67):
  `	s
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie.name, cookie.value)
  })
  `
- **Impacto:** Al no pasar las opciones (`httpOnly`, `secure`, `sameSite`, `expires`), las cookies refrescadas durante una redirección podrían degradar sus atributos de seguridad en el cliente.
- **Recomendación correctiva:** Pasar el objeto cookie completo:
  `	s
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie)
  })
  `
- **¿Bloquea aceptación?:** No.

---

### [HALLAZGO-05] Reporte de Ejecución (execution.md) no Actualizado
- **Estado:** OBSERVATION
- **Severidad:** BAJA
- **Evidencia:** `reports/EXEC-20261105-nextjs15-core/execution.md` muestra `IN_PROGRESS` y pasos pendientes, a pesar de que el código fue completado.
- **Impacto:** Pérdida de trazabilidad de los pasos de ejecución.
- **¿Bloquea aceptación?:** No.

---

## 5. Pruebas y Verificaciones

| Prueba / Comando | Resultado Reportado | Verificación Independiente | Estado |
|---|---|---|---|
| `prisma generate` | Exitoso | Ejecutado en 155ms (v5.22.0) | PASS |
| `pnpm exec tsc --noEmit` | No reportado | Exitoso (Exit code 0, 0 errores) | PASS |
| `pnpm run build` | No registrado | Exitoso (Next.js 15.1.7, 18 rutas generadas) | PASS |
| Inspección IDOR Tickets | No reportado | Vulnerabilidad confirmada en `PATCH /api/tickets/[id]` | FAIL |
| Navegabilidad de Enlaces | Asumido funcional | Confirmado 404 por discrepancia de route groups | FAIL |

---

## 6. Riesgos y Limitaciones

1. **Pruebas de Integración con Supabase Real:** No se ejecutaron llamadas HTTP contra una instancia activa de Supabase ya que las credenciales locales en `.env.example` son marcadores de posición.
2. **ESLint:** `pnpm run lint` no corre porque falta el archivo de configuración de ESLint.

---

## 7. Veredicto

# REJECTED (RECHAZADO)

**Justificación Técnica:**
El proyecto posee una excelente arquitectura TypeScript, Next.js 15 y Tailwind Glassmorphism con cero errores de compilación; sin embargo, no puede ser aprobado en su estado actual debido a:
1. **Defecto de Navegación Crítico (Severidad ALTA):** Toda la barra lateral y los accesos rápidos del dashboard dirigen a rutas 404 debido a la discrepancia entre la estructura de route groups `(dashboard)` y los enlaces con prefijo `/dashboard/...`.
2. **Defecto de Autorización IDOR (Severidad ALTA):** La ruta `PATCH /api/tickets/[id]` permite que un usuario solicitante modifique tickets creados por otros solicitantes.

---

## 8. Acción Recomendada

Se requiere que el **Planner** genere un plan correctivo rápido (Iteración 2) para que el **Executor**:
1. Corrija las rutas de navegación (armonizando carpetas o actualizando enlaces).
2. Agregue el check de propiedad en `PATCH /api/tickets/[id]`.
3. Ajuste la propagación completa de cookies en `src/middleware.ts`.
4. Actualice `reports/EXEC-20261105-nextjs15-core/execution.md`.