---
aliases: [Nexo TI, Sistema Gestión TI, Taller Electrónico]
tags: [proyecto, next-js, supabase, prisma, glassmorphism, taller, helpdesk]
created: 2026-11-05
status: core-completado
---

# 🧠 Nexo TI V2 — Cerebro del Proyecto

> Sistema unificado de **Mesa de Ayuda TI**, **Taller de Reparación de Tarjetas Electrónicas** y **Base de Conocimiento** construido con Next.js 15+ y desplegado en Vercel.

---

## 📌 Índice del Cerebro

```
🧠 NEXO TI BRAIN
├── 🏗️ Arquitectura
│   ├── Stack Tecnológico
│   ├── Decisiones Arquitectónicas (ADR)
│   └── Flujo de Autenticación
├── 🗂️ Mapa de Archivos
├── 📊 Modelo de Datos
│   ├── Entidades Principales
│   └── Diagrama ER
├── 🎨 Sistema de Diseño
│   ├── Tokens de Color
│   ├── Componentes CSS
│   └── Patrones de Interfaz
├── 📦 Módulos del Sistema
│   ├── Auth & RBAC
│   ├── Mesa de Ayuda (Tickets)
│   ├── Taller Electrónico
│   ├── Base de Conocimiento
│   └── Administración
├── 🔌 API Reference
├── ✅ Estado Actual (Fases Completadas)
├── 🚀 Roadmap — Fase 4 (Pendiente)
└── 🔧 Guías Operativas
```

---

## 🏗️ Arquitectura

### Stack Tecnológico

| Capa | Tecnología | Versión | Rol |
|---|---|---|---|
| **Framework** | Next.js (App Router) | 15.1.7 | Full-stack unificado |
| **UI Library** | React | 19.0.0 | Componentes UI |
| **Lenguaje** | TypeScript | 5.7+ | Tipado estricto |
| **Estilos** | Tailwind CSS | 3.4+ | Utility-first + Glassmorphism |
| **ORM** | Prisma | 5.22 | Acceso a BD con tipos seguros |
| **Base de Datos** | PostgreSQL (Supabase) | — | Persistencia relacional |
| **Autenticación** | Supabase Auth SSR | 0.5+ | Cookies HttpOnly, Server-First |
| **Validación** | Zod | 3.24+ | Schemas de entrada en APIs |
| **Iconos** | Lucide React | 0.475+ | Iconografía consistente |
| **Despliegue** | Vercel | — | Hosting con zero-config |

### Decisiones Arquitectónicas (ADR)

#### ADR-001: Full-Stack Unificado en Next.js (vs. Monorepo Vite+Express)
- **Contexto:** El repositorio anterior era un monorepo pnpm con `apps/frontend` (Vite) y `apps/backend` (Express), causando errores de detección en Vercel ("Multiple apps detected") y cold starts en Render.
- **Decisión:** Migrar a una única aplicación Next.js 15+ App Router con Server Actions y Route Handlers como backend.
- **Consecuencia:** Cero problemas de autodetección en Vercel, latencia eliminada, pipeline de CI/CD unificado.

#### ADR-002: Server-First Auth con @supabase/ssr
- **Contexto:** El sistema anterior guardaba `refreshToken` en `localStorage`, exponiéndolo a XSS.
- **Decisión:** Adoptar `@supabase/ssr` con cookies `HttpOnly` y validación con `getUser()` (criptográfica) en middleware y Server Components.
- **Consecuencia:** Sesiones seguras, cero flicker en carga, redirecciones protegidas con propagación de cookies.

#### ADR-003: Soft Delete + Audit Log Inmutable
- **Contexto:** Eliminaciones físicas rompían bitácoras de auditoría y claves foráneas.
- **Decisión:** `deletedAt`/`isActive` en usuarios; `AuditLog` es append-only; `onDelete: Cascade` en logs vinculados a tarjetas.
- **Consecuencia:** Integridad referencial, trazabilidad histórica completa, cumplimiento de políticas de retención.

#### ADR-004: Dark Cyber Glassmorphism
- **Decisión:** Adoptar la estética Dark Forge con tarjetas translúcidas, acentos neón y sidebar flotante tipo Apple Vision Pro.
- **Restricciones:** Cero dependencias pesadas de animación (no Framer Motion). Solo transiciones nativas de Tailwind y CSS. Controles interactivos (dropdowns, modales) siempre opacos para WCAG AA.

### Flujo de Autenticación

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

## 🗂️ Mapa de Archivos

```
Nexo_TI/
├── .agents/PROJECT.md              # Contexto para agentes AI
├── .env.example                    # Variables de entorno requeridas
├── .gitignore
├── .npmrc
├── next.config.ts                  # Config Next.js (strict TS, no powered-by)
├── package.json                    # Deps y scripts unificados
├── postcss.config.mjs              # PostCSS: tailwindcss + autoprefixer
├── tailwind.config.ts              # Tokens Dark Forge + neon accents
├── tsconfig.json                   # TS strict con path alias @/*
├── vercel.json                     # Despliegue explícito (framework: nextjs)
│
├── prisma/
│   ├── schema.prisma               # 14 modelos, 9 enums, directUrl
│   └── seed.ts                     # Admin Venllas + Pipeline Estándar (5 pasos)
│
├── src/
│   ├── middleware.ts                # Protección de rutas + propagación de cookies
│   │
│   ├── app/
│   │   ├── layout.tsx              # Root layout (html lang="es", dark, globals.css)
│   │   ├── page.tsx                # Redirect → /dashboard
│   │   ├── globals.css             # Glassmorphism CSS components
│   │   │
│   │   ├── (auth)/
│   │   │   └── login/page.tsx      # Login con orbs flotantes + glass card
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          # Server Component: requireAuth → UserProvider
│   │   │   ├── dashboard/page.tsx  # Home con stat cards (tickets, boards, KB)
│   │   │   ├── admin/page.tsx      # Usuarios + Audit Logs
│   │   │   ├── tickets/
│   │   │   │   ├── page.tsx        # Kanban board de tickets
│   │   │   │   ├── new/page.tsx    # Formulario nuevo ticket
│   │   │   │   └── [id]/page.tsx   # Detalle con comentarios
│   │   │   ├── taller/
│   │   │   │   ├── page.tsx        # Grid de tarjetas electrónicas
│   │   │   │   ├── new/page.tsx    # Formulario nueva tarjeta
│   │   │   │   └── [id]/page.tsx   # Stepper + BOM + Bitácora técnica
│   │   │   └── kb/
│   │   │       ├── page.tsx        # Catálogo de artículos por categoría
│   │   │       └── [slug]/page.tsx # Visor Markdown sanitizado
│   │   │
│   │   └── api/
│   │       ├── auth/login/route.ts     # POST signInWithPassword
│   │       ├── auth/logout/route.ts    # POST signOut
│   │       ├── tickets/route.ts        # GET (listar + IDOR) / POST (crear)
│   │       ├── tickets/[id]/route.ts   # GET / PATCH (status change con audit)
│   │       ├── kb/route.ts             # GET / POST (artículos KB)
│   │       └── taller/
│   │           ├── boards/route.ts          # GET / POST (tarjetas TRJ-YYYY-NNN)
│   │           ├── boards/[id]/step/route.ts       # POST avance atómico de paso
│   │           ├── boards/[id]/components/route.ts # GET / POST componentes BOM
│   │           ├── boards/[id]/logs/route.ts       # GET / POST bitácora técnica
│   │           └── pipelines/route.ts              # GET pipelines activos
│   │
│   ├── components/
│   │   └── layout/
│   │       ├── DashboardShell.tsx   # Shell con Sidebar + Navbar + grid overlay
│   │       ├── Sidebar.tsx          # Vision Pro capsule, colapsable, filtrado por rol
│   │       └── Navbar.tsx           # Glass card flotante con user info + logout
│   │
│   ├── hooks/
│   │   └── useUser.tsx              # UserProvider (sync) + useUser hook
│   │
│   ├── lib/
│   │   ├── auth.ts                  # getAuthUser, requireAuth, requireAdmin
│   │   ├── prisma.ts                # Singleton PrismaClient
│   │   ├── utils.ts                 # cn(), formatDate(), slugify()
│   │   └── supabase/
│   │       ├── server.ts            # createServerSupabaseClient (getAll/setAll)
│   │       └── client.ts            # createBrowserSupabaseClient
│   │
│   └── types/
│       └── index.ts                 # SessionUser, ApiResponse, StatusColors maps
│
└── reports/
    └── EXEC-20261105-nextjs15-core/
        ├── intent.md                # Mapa de intención confirmado
        ├── plan.md                  # Plan técnico de 10 pasos
        └── execution.md            # Reporte de ejecución (parcial del Executor)
```

---

## 📊 Modelo de Datos

### Entidades Principales

| Modelo | Tabla | Descripción | Relaciones Clave |
|---|---|---|---|
| **User** | `users` | Usuarios del sistema. Soft delete (`deletedAt`, `isActive`). Roles: `SOLICITANTE`, `ADMIN_TI` | → Tickets, Comments, Tasks, Boards, Logs |
| **Ticket** | `tickets` | Incidencias de soporte TI. Estados: ABIERTO → EN_PROGRESO → EN_ESPERA → RESUELTO → CERRADO | → Creator, Assignee, Comments |
| **TicketComment** | `ticket_comments` | Comentarios en tickets. `isInternal` para notas solo visibles por admins | → Ticket (cascade), Author |
| **Task** | `tasks` | Tareas internas de TI. Opcional: vinculada a ticket | → Creator |
| **KnowledgeArticle** | `knowledge_articles` | Artículos KB en Markdown. Slug único, tags[], viewCount | → Author |
| **AuditLog** | `audit_logs` | Registro inmutable (append-only). Entidades: TICKET, TASK, KB_ARTICLE, USER, ELECTRONIC_BOARD, PIPELINE | → User |
| **RepairPipeline** | `repair_pipelines` | Flujo de reparación con pasos ordenados | → Steps, Boards |
| **PipelineStep** | `pipeline_steps` | Pasos del pipeline (stepOrder, isMandatory) | → Pipeline (cascade), BoardProgress |
| **ElectronicBoard** | `electronic_boards` | Tarjeta electrónica en reparación. Código TRJ-YYYY-NNN auto-generado | → Pipeline, CurrentStep, Technician, Components, Logs |
| **BoardStepProgress** | `board_step_progress` | Progreso de cada tarjeta en cada paso del pipeline | → Board (cascade), Step (cascade), CompletedBy |
| **BoardComponent** | `board_components` | BOM: componentes requeridos/instalados en una tarjeta | → Board (cascade) |
| **BoardLog** | `board_logs` | Bitácora técnica cronológica. Tipos: NOTA_TECNICA, MEDICION, CAMBIO_ESTADO, ALERTA | → Board (cascade), Author |

### Diagrama ER (Simplificado)

```mermaid
erDiagram
    User ||--o{ Ticket : creates
    User ||--o{ Ticket : assigned_to
    User ||--o{ TicketComment : writes
    User ||--o{ AuditLog : generates
    User ||--o{ ElectronicBoard : repairs
    User ||--o{ BoardLog : authors
    User ||--o{ BoardStepProgress : completes

    Ticket ||--o{ TicketComment : has
    
    RepairPipeline ||--o{ PipelineStep : contains
    RepairPipeline ||--o{ ElectronicBoard : uses
    
    ElectronicBoard ||--o{ BoardStepProgress : tracks
    ElectronicBoard ||--o{ BoardComponent : needs
    ElectronicBoard ||--o{ BoardLog : records
    ElectronicBoard }o--|| PipelineStep : current_step
    
    PipelineStep ||--o{ BoardStepProgress : progress
    
    User ||--o{ KnowledgeArticle : authors
```

### Enums del Sistema

| Enum | Valores |
|---|---|
| `Role` | SOLICITANTE, ADMIN_TI |
| `TicketStatus` | ABIERTO, EN_PROGRESO, EN_ESPERA, RESUELTO, CERRADO |
| `TicketPriority` | BAJA, MEDIA, ALTA, CRITICA |
| `TicketCategory` | HARDWARE, SOFTWARE, RED, ACCESOS, OTRO |
| `BoardStatus` | EN_COLA, EN_DIAGNOSTICO, EN_REPARACION, ESPERA_REPUESTOS, EN_PRUEBAS, REPARADA, IRREPARABLE |
| `StepStatus` | PENDIENTE, EN_PROGRESO, COMPLETADO, SALTADO |
| `ComponentStatus` | REQUERIDO, EN_STOCK, SOLICITADO, INSTALADO |
| `BoardLogType` | NOTA_TECNICA, MEDICION, CAMBIO_ESTADO, ALERTA |
| `AuditAction` | CREATE, UPDATE, DELETE, STATUS_CHANGE, LOGIN, LOGIN_FAILED |
| `AuditEntity` | TICKET, TASK, KB_ARTICLE, USER, ELECTRONIC_BOARD, PIPELINE |

---

## 🎨 Sistema de Diseño — Dark Cyber Glassmorphism

### Tokens de Color

| Token | Hex | Uso |
|---|---|---|
| `bg-forge` | `#050811` | Fondo raíz |
| `bg-forge-mid` | `#090D1A` | Superficies medias |
| `bg-forge-high` | `#0E1424` | Paneles elevados |
| `bg-base` | `#0A0F1E` | Base general |
| `bg-surface` | `#111827` | Tarjetas y modales |
| `bg-elevated` | `#1a2236` | Dropdowns, tooltips (SIEMPRE opacos) |
| `neon-blue` | `#00D2FF` | Acento principal |
| `neon-purple` | `#818CF8` | Acento secundario |
| `text-primary` | `#F1F5F9` | Texto principal |
| `text-secondary` | `#94A3B8` | Texto auxiliar |
| `border-subtle` | `rgba(255,255,255,0.08)` | Bordes sutiles |

### Componentes CSS Clave

| Clase | Propósito |
|---|---|
| `.glass-card` | Tarjeta con `backdrop-blur(28px)`, highlight specular superior, sombra profunda |
| `.vision-sidebar-capsule` | Sidebar flotante estilo Apple Vision Pro con `border-radius: 1.5rem` |
| `.vision-item-bubble` | Items de navegación con hover escalado 1.02 |
| `.linux-grid-bg` | Overlay de grid cibernético sutil (líneas cyan 3% opacidad) |
| `.btn-neon-primary` | Botón con gradiente neon-blue → neon-purple |
| `.btn-glass-secondary` | Botón transparente con borde sutil |
| `.input-cyber` | Input con fondo opaco `#1a2236`, focus ring neon-blue |

### Reglas de Accesibilidad
- ⚠️ **Dropdowns, tooltips y modales** siempre con fondo `bg-elevated` (100% opaco), nunca transparente
- ✅ Contraste mínimo WCAG AA (4.5:1) en texto sobre fondos glassmorphism
- ✅ Cero animaciones pesadas (Framer Motion). Solo `transition`, `duration`, `scale`, `opacity` nativas de Tailwind

---

## 📦 Módulos del Sistema

### 🔐 Auth & RBAC

| Componente | Archivo | Función |
|---|---|---|
| Middleware | `src/middleware.ts` | Protección de rutas, propagación de cookies en redirect |
| Server Client | `src/lib/supabase/server.ts` | `createServerSupabaseClient()` con `getAll/setAll` |
| Browser Client | `src/lib/supabase/client.ts` | `createBrowserSupabaseClient()` para hooks |
| Auth Helpers | `src/lib/auth.ts` | `getAuthUser()`, `requireAuth()`, `requireAdmin()` |
| UserProvider | `src/hooks/useUser.tsx` | Contexto sync sin loading (inyectado desde Server Component) |
| Login API | `src/app/api/auth/login/route.ts` | `signInWithPassword` |
| Logout API | `src/app/api/auth/logout/route.ts` | `signOut` |

**Roles:**
- `SOLICITANTE` — Puede crear y ver sus propios tickets, leer artículos KB publicados
- `ADMIN_TI` — Acceso completo: gestiona tickets de todos, taller electrónico, KB (borradores), administración, audit logs

### 🎫 Mesa de Ayuda (Tickets)

- **Vista Kanban:** 5 columnas por estado con cards glassmorphism
- **IDOR Prevention:** Solicitantes solo ven sus tickets en API y UI
- **Comentarios:** Soporte de `isInternal` (notas internas solo para ADMIN_TI)
- **Audit Trail:** Cada creación y cambio de estado registrado en AuditLog
- **Timestamps automáticos:** `resolvedAt` al marcar RESUELTO, `closedAt` al CERRAR

### ⚡ Taller Electrónico

- **Código auto-generado:** `TRJ-{YYYY}-{NNN}` incremental por año
- **Pipeline configurable:** Flujo de reparación con pasos ordenados y obligatorios
- **Stepper transaccional:** Avance atómico con `prisma.$transaction` — completa paso actual, inicia siguiente, o marca REPARADA si no hay más
- **BOM (Bill of Materials):** Componentes con designador (R12, C45, U3), encapsulado, P/N y estado
- **Bitácora técnica:** Log cronológico con tipos: NOTA_TECNICA, MEDICION, CAMBIO_ESTADO, ALERTA
- **Pipeline Estándar seeded:** Recepción → Diagnóstico Eléctrico → Reparación → Pruebas → Documentación

### 📚 Base de Conocimiento (KB)

- **Markdown sanitizado:** HTML escapado antes de renderizar (prevención XSS)
- **Visibilidad por rol:** Admins ven borradores; solicitantes solo artículos publicados
- **Auto-slug:** Generado desde el título con normalización Unicode
- **Métricas:** Conteo de vistas incrementado en cada lectura
- **Categorías y tags:** Agrupación visual con badges neon

### 🛡️ Administración

- **Usuarios:** Lista con badges de rol y estado activo/inactivo
- **Audit Logs:** Timeline scrollable con últimos 50 eventos, coloreados por tipo de acción

---

## 🔌 API Reference

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/login` | Público | Login con email + password |
| `POST` | `/api/auth/logout` | Autenticado | Cierre de sesión |
| `GET` | `/api/tickets` | Autenticado | Listar tickets (IDOR filtrado) |
| `POST` | `/api/tickets` | Autenticado | Crear ticket (Zod validated) |
| `GET` | `/api/tickets/[id]` | Autenticado | Detalle de ticket + comentarios |
| `PATCH` | `/api/tickets/[id]` | ADMIN_TI | Actualizar estado, asignación |
| `GET` | `/api/taller/boards` | ADMIN_TI | Listar tarjetas electrónicas |
| `POST` | `/api/taller/boards` | ADMIN_TI | Crear tarjeta (auto TRJ code) |
| `POST` | `/api/taller/boards/[id]/step` | ADMIN_TI | Avanzar paso (transacción atómica) |
| `GET/POST` | `/api/taller/boards/[id]/components` | ADMIN_TI | Gestión BOM |
| `GET/POST` | `/api/taller/boards/[id]/logs` | ADMIN_TI | Bitácora técnica |
| `GET` | `/api/taller/pipelines` | ADMIN_TI | Pipelines activos |
| `GET` | `/api/kb` | Autenticado | Artículos KB |
| `POST` | `/api/kb` | ADMIN_TI | Crear artículo KB |

**Formato de respuesta estándar:**
```json
{
  "success": true,
  "data": { ... },
  "error": "mensaje opcional"
}
```

---

## ✅ Estado Actual — Fases Completadas

### Fase 1: Fundaciones ✅
- [x] Next.js 15.1.7 + React 19 + TypeScript 5
- [x] Tailwind CSS 3 con tokens Cyber Glassmorphism
- [x] `vercel.json` optimizado (framework: nextjs, sin ambigüedades)
- [x] `tsconfig.json` con strict mode y path alias `@/*`
- [x] `.env.example` con configuración Supabase + Prisma

### Fase 2: Modelo de Datos y Seguridad ✅
- [x] Prisma Schema V2 con `directUrl` (puerto 5432) y `url` pooler (6543)
- [x] Soft Delete en User (`deletedAt`, `isActive`)
- [x] Cascade en BoardLog, BoardStepProgress, BoardComponent
- [x] AuditEntity extendido (ELECTRONIC_BOARD, PIPELINE)
- [x] Seeder con admin 'Venllas' + Pipeline Estándar de Reparación
- [x] `prisma generate` ✓ verificado

### Fase 3: Núcleo de Negocio ✅
- [x] Auth Server-First con @supabase/ssr
- [x] Middleware con propagación de cookies
- [x] Dashboard Shell Glassmorphism (Sidebar Vision Pro + Navbar flotante)
- [x] Módulo Tickets (Kanban + CRUD + IDOR + audit)
- [x] Módulo Taller (Tarjetas + Stepper atómico + BOM + Bitácora)
- [x] Módulo KB (Catálogo + visor Markdown sanitizado)
- [x] Módulo Admin (Usuarios + Audit Logs)
- [x] **Build de producción exitoso** (`next build` exit code 0, 18 páginas, 0 errores TS)

---

## 🚀 Roadmap — Fase 4: Mejoras de Alto Impacto (Pendiente)

### 4.1 — Códigos QR para Tarjetas
- **Objetivo:** Generar etiquetas con código QR que contengan el `internalCode` (TRJ-YYYY-NNN) para escaneo rápido con dispositivo móvil
- **Tecnología sugerida:** `qrcode.react` para generar SVG/Canvas en componente React
- **Alcance:**
  - [ ] Componente `<BoardQRCode boardCode={string} />` que renderiza el QR
  - [ ] Botón "Imprimir etiqueta" en la vista de detalle de tarjeta (`/taller/[id]`)
  - [ ] Layout de impresión optimizado para etiquetas térmicas (CSS `@media print`)
  - [ ] Ruta `/taller/scan` que acepta el código escaneado y redirige al detalle

### 4.2 — Command Palette (`Ctrl + K`)
- **Objetivo:** Buscador global instantáneo para acceder a cualquier ticket, tarjeta de taller, artículo KB o usuario desde cualquier pantalla
- **Tecnología sugerida:** `cmdk` (paquete liviano de command menu) o implementación custom con dialog de Radix
- **Alcance:**
  - [ ] Componente `<CommandPalette />` montado en el DashboardShell
  - [ ] API Route `/api/search` con búsqueda unificada en tickets, boards, KB, users
  - [ ] Shortcuts de navegación rápida (`> ticket`, `> tarjeta`, `> kb`)
  - [ ] Resultados agrupados por tipo con iconos y preview
  - [ ] Atajo `Ctrl+K` / `Cmd+K` para abrir/cerrar

### 4.3 — Visor de Auditoría Avanzado
- **Objetivo:** Panel visual interactivo para que el administrador audite cambios críticos con filtros, timeline y detalle expandible
- **Alcance:**
  - [ ] Página `/admin/audit` con tabla paginada y filtros (por entidad, acción, usuario, rango de fechas)
  - [ ] Timeline visual con agrupación por día
  - [ ] Modal de detalle con diff de metadata (JSON viewer)
  - [ ] Exportación de logs filtrados a CSV
  - [ ] API Route `/api/admin/audit` con query params de filtrado y paginación (cursor-based)

### 4.4 — Exportación a PDF / Excel
- **Objetivo:** Generar informes técnicos profesionales para entrega de tarjetas reparadas y reportes de mesa de ayuda
- **Tecnología sugerida:** `@react-pdf/renderer` para PDF server-side, `xlsx` para Excel
- **Alcance:**
  - [ ] **Ficha técnica de tarjeta (PDF):** Datos generales, historial de pasos, BOM con estados, bitácora completa, código QR
  - [ ] **Reporte de tickets (Excel):** Exportación masiva con filtros de fecha, estado, categoría
  - [ ] **Reporte mensual de taller (PDF):** KPIs (tarjetas reparadas, tiempo promedio, componentes más usados)
  - [ ] API Routes: `/api/export/board/[id]/pdf`, `/api/export/tickets/excel`
  - [ ] Botones de exportación en vistas de detalle y listados

---

## 🔧 Guías Operativas

### Variables de Entorno Requeridas (`.env`)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Prisma (PostgreSQL Supabase)
DATABASE_URL=postgresql://postgres.ref:pass@pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.ref:pass@pooler.supabase.com:5432/postgres

# Seed
SEED_ADMIN_USERNAME=Venllas
SEED_ADMIN_PASSWORD=Admin1234!
```

### Comandos de Desarrollo
```bash
pnpm install           # Instalar dependencias
pnpm dev               # Servidor de desarrollo (localhost:3000)
pnpm build             # Build de producción (prisma generate + next build)
npx prisma generate    # Regenerar Prisma Client tras cambios en schema
npx prisma db push     # Push schema a Supabase (sin migraciones)
pnpm db:seed           # Ejecutar seeder (admin + pipeline)
```

### Despliegue en Vercel
1. Conectar repositorio en Vercel
2. Configurar variables de entorno (copiar de `.env.example`)
3. Framework: Next.js (autodetectado por `vercel.json`)
4. Build command: `prisma generate && next build` (ya configurado)
5. Install command: `pnpm install` (ya configurado)
6. No se requiere Root Directory — la app es la raíz

### Reglas para Contribuir
1. **Server Components** por defecto. Solo `'use client'` donde haya estado, efectos o eventos
2. **getUser()** siempre, nunca `getSession()` para decisiones de autorización
3. **Zod** para validar toda entrada en API Routes
4. **AuditLog** en toda acción de negocio (CREATE, UPDATE, DELETE, STATUS_CHANGE)
5. **Respuestas API** siempre `{ success, data?, error? }`
6. **Dropdowns y modales** con fondo opaco `bg-elevated`, nunca transparente
7. **No Framer Motion** — solo transiciones Tailwind nativas

---

> 📅 **Última actualización:** 2026-11-05  
> 🔖 **Versión del cerebro:** 1.0  
> 🏗️ **Estado global:** Core funcional completado · Fase 4 pendiente de implementación
