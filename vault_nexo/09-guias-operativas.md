---
title: Guías Operativas y Buenas Prácticas
aliases: [Guías Operativas, Comandos, Despliegue, Reglas de Código]
tags: [operaciones, devops, vercel, pnpm, convenciones, buenas-practicas]
created: 2026-11-05
updated: 2026-11-05
---

# 🔧 Guías Operativas y Buenas Prácticas

Instrucciones técnicas para el entorno de desarrollo local, despliegues continuos y estándares de código de Nexo TI V2.

---

## 🔑 Variables de Entorno Requeridas (`.env`)

Configuración base para enlazar con Supabase y PostgreSQL:

```bash
# Supabase SSR
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Prisma ORM (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres.ref:pass@pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.ref:pass@pooler.supabase.com:5432/postgres

# Parámetros del Seeder
SEED_ADMIN_USERNAME=Venllas
SEED_ADMIN_PASSWORD=Admin1234!
```

---

## 💻 Comandos de Desarrollo Frecuentes

```bash
# Instalación de paquetes
pnpm install

# Iniciar servidor local de desarrollo (puerto 3000)
pnpm dev

# Generar cliente tipado de Prisma tras cambios en schema.prisma
npx prisma generate

# Sincronizar cambios de esquema a Supabase (modo push sin migraciones sql)
npx prisma db push

# Poblar base de datos inicial (usuario administrador y pipeline estándar)
pnpm db:seed

# Compilar proyecto para producción
pnpm build
```

---

## 🚀 Despliegue en Vercel

1. Vincular el repositorio Git en la plataforma de Vercel.
2. Cargar las variables de entorno en el panel de configuración de Vercel (copiadas desde `.env.example`).
3. Comprobar que el framework esté establecido en **Next.js** (autodetectado de forma inequívoca gracias a `vercel.json`).
4. Comando de compilación por defecto: `prisma generate && next build`.
5. Comando de instalación por defecto: `pnpm install`.
6. Mantener **Root Directory** en la raíz `./` (la aplicación ya no es un monorepo).

---

## 📏 Reglas y Estándares de Contribución

1. **Server Components por Defecto**:
   - Mantener las páginas y layouts como Server Components. Reservar `'use client'` exclusivamente en componentes que gestionan estado reactivo local (`useState`), efectos (`useEffect`) o eventos de usuario.
2. **Validación Criptográfica de Usuario (`getUser`)**:
   - Para toda decisión de autorización o acceso en servidor, utilizar siempre `supabase.auth.getUser()`. Nunca confiar en `getSession()`, pues no valida la firma contra el servidor de autenticación.
3. **Validación Exhaustiva con Zod**:
   - Todo payload entrante en los Route Handlers (`/api/...`) debe estar respaldado por un esquema Zod.
4. **Registro Obligatorio en AuditLog**:
   - Toda mutación de entidades de negocio (`CREATE`, `UPDATE`, `DELETE`, `STATUS_CHANGE`) debe registrarse de forma inmutable en la tabla `AuditLog`.
5. **Formato Homogéneo de API**:
   - Toda respuesta de Route Handler debe respetar el contrato estándar:
     ```json
     { "success": true, "data": { ... } }
     ```
     o en su defecto:
     ```json
     { "success": false, "error": "Mensaje detallado" }
     ```
6. **Accesibilidad UI en Superposiciones**:
   - Menús contextuales, selectores y ventanas modales deben utilizar fondos opacos (`bg-elevated`), quedando prohibida la translucidez en controles flotantes interactivos (cumplimiento WCAG AA).
7. **Rendimiento Visual**:
   - No añadir librerías pesadas de animación. Utilizar las transiciones nativas de Tailwind CSS.

---

*Ver más:* [[00-INDEX|Índice General]] · [[01-arquitectura|Arquitectura]] · [[07-estado-actual|Estado Actual]]
