---
title: Estructura del Proyecto y Mapa de Archivos
aliases: [Mapa de Archivos, Estructura, Directorios, Tree]
tags: [estructura, archivos, filesystem, next-js]
created: 2026-11-05
updated: 2026-11-05
---

# 🗂️ Estructura del Proyecto y Mapa de Archivos

Árbol de directorios de Nexo TI V2 organizado bajo Next.js App Router con arquitectura modular, tipado estricto y separación de capas.

---

## 🌳 Árbol Completo

```
Nexo_TI/
├── .agents/
│   └── PROJECT.md              # Contexto de reglas e instrucciones para agentes AI
├── .env.example                # Variables de entorno requeridas documentadas
├── .gitignore
├── .npmrc
├── next.config.ts              # Configuración Next.js (strict TS, no powered-by)
├── package.json                # Dependencias unificadas y scripts de proyecto
├── postcss.config.mjs          # PostCSS: tailwindcss + autoprefixer
├── tailwind.config.ts          # Tokens Dark Forge + colores neón
├── tsconfig.json               # TypeScript strict con path alias @/*
├── vercel.json                 # Despliegue explícito (framework: nextjs)
│
├── prisma/
│   ├── schema.prisma           # 14 modelos, 9 enums, pooling + directUrl
│   └── seed.ts                 # Seeder: Admin Venllas + Pipeline Estándar (5 pasos)
│
├── src/
│   ├── middleware.ts            # Protección perimetral de rutas + propagación de cookies
│   │
│   ├── app/
│   │   ├── layout.tsx          # Root layout (html lang="es", dark, globals.css)
│   │   ├── page.tsx            # Redirección raíz → /dashboard
│   │   ├── globals.css         # Glassmorphism CSS components y utilidades
│   │   │
│   │   ├── (auth)/
│   │   │   └── login/page.tsx  # Login con orbs flotantes + tarjeta glassmorphism
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx      # Server Component: requireAuth() → inyecta UserProvider
│   │   │   ├── dashboard/page.tsx  # Home con stat cards (tickets, boards, KB)
│   │   │   ├── admin/page.tsx  # Gestión de usuarios + visor Audit Logs
│   │   │   ├── tickets/
│   │   │   │   ├── page.tsx    # Kanban board de tickets (5 columnas)
│   │   │   │   ├── new/page.tsx # Formulario nuevo ticket
│   │   │   │   └── [id]/page.tsx # Detalle con comentarios e historial
│   │   │   ├── taller/
│   │   │   │   ├── page.tsx    # Grid de tarjetas electrónicas
│   │   │   │   ├── new/page.tsx # Formulario nueva tarjeta (TRJ-YYYY-NNN)
│   │   │   │   └── [id]/page.tsx # Stepper + BOM + Bitácora técnica
│   │   │   └── kb/
│   │   │       ├── page.tsx    # Catálogo de artículos por categoría
│   │   │       └── [slug]/page.tsx # Visor Markdown sanitizado con tags
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
│   │   ├── prisma.ts                # Singleton PrismaClient para prevención de pool exhaust
│   │   ├── utils.ts                 # cn(), formatDate(), slugify()
│   │   └── supabase/
│   │       ├── server.ts            # createServerSupabaseClient (getAll/setAll)
│   │       └── client.ts            # createBrowserSupabaseClient
│   │
│   └── types/
│       └── index.ts                 # SessionUser, ApiResponse, StatusColors maps
│
└── vault_nexo/                      # Cerebro Obsidian / Markdown del proyecto
```

---

## 🔍 Distribución por Responsabilidades

- **`/src/app/(auth)`**: Vistas públicas desprovistas de navegación interna.
- **`/src/app/(dashboard)`**: Vistas protegidas envueltas por el `DashboardShell` y validadas a nivel de servidor.
- **`/src/app/api`**: Handlers REST que concentran la lógica de base de datos protegida por sesión y permisos.
- **`/src/lib`**: Lógica compartida de clientes externos (Prisma, Supabase) y funciones de utilidad puras.

---

*Ver más:* [[00-INDEX|Índice General]] · [[01-arquitectura|Arquitectura]] · [[06-api-reference|API Reference]]
