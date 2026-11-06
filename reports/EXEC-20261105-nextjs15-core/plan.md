# Plan Técnico: Nexo_TI V2 en Next.js 15+ (App Router) Unificado con Supabase SSR, Prisma y Dark Cyber Glassmorphism

- **Execution ID:** EXEC-20261105-nextjs15-core
- **Iteración:** 1
- **Estado:** READY_FOR_APPROVAL
- **Proyecto / stack:** Next.js 15 (App Router), React 19, TypeScript 5, Tailwind CSS 3 (Cyber Glassmorphism), Prisma ORM con Postgres/Supabase, @supabase/ssr, Lucide React, Zod
- **Rama y HEAD observados:** Rama master (repositorio limpio en inicialización)
- **Riesgo:** MEDIO

---

## 1. Objetivo y Criterios de Aceptación

### Objetivo
Construir y configurar la base y núcleo funcional completo de **Nexo_TI V2** en una arquitectura full-stack cohesiva y moderna de **Next.js 15+ (App Router)** unificado con **Supabase SSR** y **Prisma**, eliminando los problemas de "multiple apps" en Vercel, adoptando autenticación Server-First y vistiendo la aplicación con la interfaz **Dark Cyber Glassmorphism**.

### Criterios Medibles de Aceptación
1. **Unificación para Vercel:** Estructura de directorio raíz con un único package.json y ercel.json optimizado; sin submódulos ni monorepos fragmentados que confundan la detección de Vercel.
2. **Autenticación Server-First:** Configuración con @supabase/ssr mediante lib/supabase/server.ts, lib/supabase/client.ts, middleware/proxy con preservación y propagación estricta de cookies HttpOnly en redirecciones, y layout protegido que valida la sesión en servidor antes de hidratar el cliente (getUser()).
3. **Persistencia e Integridad Relacional:** Esquema de Prisma (prisma/schema.prisma) configurado con directUrl (5432) y url con pooler (6543), soporte de soft-delete en usuarios (deletedAt, isActive), cascada íntegra onDelete: Cascade en bitácoras de tarjetas (BoardLog), y enum de auditoría extendido con ELECTRONIC_BOARD y PIPELINE. Seeder prisma/seed.ts funcional con el administrador inicial 'Venllas'.
4. **Módulos Core Funcionales:**
   - **Autenticación:** Login interactivo con plasma orbs y micro-grid overlay, cierre de sesión seguro.
   - **Mesa de Ayuda (Tickets) & Tablero Kanban:** Gestión del ciclo de vida de incidencias TI con prevención IDOR y vistas filtrables.
   - **Taller Electrónico:** Visualizador de tarjetas electrónicas, stepper de progreso transaccional, gestión de BOM (componentes) y bitácora técnica cronológica con tipos de evento.
   - **Base de Conocimiento (KB):** Artículos técnicos con soporte de Markdown sanitizado contra XSS.
5. **Diseño Visual Cyber Glassmorphism:** Tokens Dark Forge (#050811, #090D1A, #0E1424), componentes CSS .glass-card, .vision-sidebar-capsule, .vision-item-bubble, y acentos Neón (#00D2FF, #818CF8) con soporte WCAG AA y controles interactivos opacos.
6. **Compilación y Tipado:** pnpm build (o 
pm run build), prisma generate y comprobación estricta de TypeScript ejecutados exitosamente sin errores sintácticos o de tipado.

---

## 2. Contexto Verificado

### Hechos Observados
- El directorio de trabajo Nexo_TI cuenta con NUEVA_ARQUITECTURA_PLAN.md y eports/EXEC-20261105-nextjs15-core/intent.md.
- En el directorio hermano System-TI se validaron los modelos de datos existentes en pps/backend/prisma/schema.prisma y la lógica de seed en pps/backend/prisma/seed.ts.
- La máquina cuenta con **Node.js v24.18.0**, **pnpm v12.16.1** y **npm v11.16.0**.

### Convenciones Adoptadas
- **Next.js 15+ App Router:** Patrón src/app/, Server Components como predeterminado; directiva 'use client' restringida a componentes reactivos interactivos (modales, stepper dinámico, hooks).
- **Server-First Auth:** Uso estricto de supabase.auth.getUser() (validación criptográfica del servidor) en layouts y Route Handlers, descartando getSession() para decisiones de autorización.
- **Manejo de cookies en Proxy/Middleware:** Propagación obligatoria de supabaseResponse.cookies hacia las respuestas de redirección para evitar deslogueos fortuitos.
- **Estética Cyber Glassmorphism:** Cero dependencias pesadas de animación; uso exclusivo de transiciones nativas Tailwind y lucide-react.

### Skills Pertinentes
- 
extjs-server-first-auth: Patrón de cliente SSR (getAll/setAll), UserProvider sin parpadeo de carga, y propagación de cookies en redirecciones.
- cyber-glassmorphism-ui: Paleta Dark Forge, .glass-card con highlight specular, dropdowns y modales con g-bg-elevated 100% opaco para legibilidad.
- workflow-driven-saas: Modelo de estados y transiciones en taller electrónico, bitácora inmutable append-only y respuestas API uniformes { success, data?, error? }.

---

## 3. Enfoque Técnico Recomendado

Se adopta la **Opción A (Full-Stack Unificado en Next.js 15+ App Router con Supabase SSR y Prisma)**:
1. **Raíz Limpia:** Se construye una única aplicación cohesiva en la raíz de Nexo_TI con package.json, eliminando la sobrecarga monorepo para simplificar la integración con Vercel.
2. **Capa de Datos:** Prisma Client singleton (src/lib/prisma.ts) sirviendo tanto a Server Actions como a Route Handlers (src/app/api/*).
3. **Capa de Autenticación & RBAC:** Middleware de protección de rutas y cliente Supabase SSR configurado en src/lib/supabase/.
4. **Capa Visual:** Configuración de Tailwind extendida con paleta Dark Forge y tokens neón, con shell unificado flotante estilo Vision Pro.

---

## 4. Alcance

### Incluido
- Configuración base del proyecto (package.json, 	sconfig.json, 	ailwind.config.ts, postcss.config.mjs, 
ext.config.ts, ercel.json, .env.example).
- Esquema Prisma V2 con directUrl, onDelete: Cascade en logs de tarjeta, soft-delete en usuarios y enum AuditEntity extendido, más seed script.
- Clientes Supabase SSR (servidor y cliente) y Middleware de autenticación con propagación de cookies.
- Layout raíz con Cyber Glassmorphism (fuentes, gradientes base, floating sidebar y navbar).
- Módulo de Autenticación (Login cyber glassmorphism + logout).
- Módulo Tickets / Mesa de Ayuda (CRUD, lista/kanban, comentarios con soporte de notas internas).
- Módulo Taller Electrónico (Catálogo de tarjetas, vista detallada con Stepper de progreso, componentes BOM y bitácora cronológica técnica).
- Módulo Base de Conocimiento (Lista de artículos y visualizador con sanitización Markdown).
- Tipos compartidos TypeScript y esquemas Zod en src/types/.

### Excluido
- Fase 4: Generador de etiquetas QR con impresión térmica dedicada (qrcode.react), Command Palette global (Ctrl+K), y exportador de fichas a PDF/Excel (se abordará en la siguiente iteración).

---

## 5. Plan Paso a Paso de Implementación

| ID | Acción | Archivos Esperados | Dependencias | Verificación | Riesgo |
|---|---|---|---|---|---|
| **PASO-01** | Inicializar estructura de archivos base, package.json con dependencias clave (Next 15, React 19, Prisma, @supabase/ssr, Tailwind, Lucide, Zod) y configuraciones de compilación (	sconfig.json, 
ext.config.ts, ercel.json, .gitignore). | package.json, 	sconfig.json, 
ext.config.ts, ercel.json, .gitignore, .env.example | Ninguna | pnpm install o 
pm install exitoso sin conflictos de pares. | BAJO |
| **PASO-02** | Configurar Tailwind CSS 3 y estilos Cyber Glassmorphism (tokens Dark Forge, neones, clases .glass-card, .vision-sidebar-capsule, .linux-grid-bg, keyframes en CSS). | 	ailwind.config.ts, postcss.config.mjs, src/app/globals.css | PASO-01 | Verificación de sintaxis CSS y build de PostCSS. | BAJO |
| **PASO-03** | Crear modelo de base de datos Prisma V2 con correcciones auditadas (directUrl, soft delete, cascade en logs, enums actualizados) y cliente singleton de Prisma. | prisma/schema.prisma, src/lib/prisma.ts, prisma/seed.ts | PASO-01 | Ejecutar 
px prisma generate y validar tipos emitidos. | MEDIO |
| **PASO-04** | Implementar capa de clientes Supabase SSR y Middleware de protección Server-First con propagación estricta de cookies. | src/lib/supabase/server.ts, src/lib/supabase/client.ts, src/middleware.ts, src/lib/auth.ts | PASO-01 | Typecheck de invocaciones de cookies y validación de tipos con @supabase/ssr. | MEDIO |
| **PASO-05** | Diseñar el Shell del Dashboard con estética Cyber Glassmorphism: Floating Sidebar expandible estilo Apple Vision Pro, Floating Navbar con estado de usuario, y UserProvider. | src/components/layout/Sidebar.tsx, src/components/layout/Navbar.tsx, src/components/layout/DashboardShell.tsx, src/hooks/useUser.tsx, src/app/(dashboard)/layout.tsx | PASO-02, PASO-04 | Renderizado de layout y validación de TypeScript. | BAJO |
| **PASO-06** | Construir el módulo de Autenticación (Página de login interactiva con orbs flotantes, formulario Cyber Glassmorphism y acciones de sesión). | src/app/(auth)/login/page.tsx, src/app/api/auth/login/route.ts, src/app/api/auth/logout/route.ts | PASO-04, PASO-05 | Typecheck y validación de redirecciones seguras. | BAJO |
| **PASO-07** | Implementar Módulo de Mesa de Ayuda (Tickets): listado filtrable, vista Kanban, formulario de creación y vista de detalle con comentarios. | src/app/(dashboard)/tickets/page.tsx, src/app/(dashboard)/tickets/[id]/page.tsx, src/app/api/tickets/route.ts, src/app/api/tickets/[id]/route.ts, src/components/tickets/* | PASO-03, PASO-05 | Verificación de rutas API con validación Zod y tipos Prisma. | MEDIO |
| **PASO-08** | Implementar Módulo de Taller Electrónico (Tarjetas de Control): catálogo, vista detallada con Stepper de fases de procedimiento, gestión de componentes BOM y bitácora técnica cronológica. | src/app/(dashboard)/taller/page.tsx, src/app/(dashboard)/taller/[id]/page.tsx, src/app/api/taller/boards/route.ts, src/app/api/taller/boards/[id]/step/route.ts, src/app/api/taller/boards/[id]/components/route.ts, src/app/api/taller/boards/[id]/logs/route.ts, src/components/taller/* | PASO-03, PASO-05 | Verificación de endpoints con transacciones atómicas de step progress. | MEDIO |
| **PASO-09** | Implementar Módulo de Base de Conocimiento (KB): catálogo de artículos, búsqueda por tags y visor de artículo con renderizado Markdown. | src/app/(dashboard)/kb/page.tsx, src/app/(dashboard)/kb/[slug]/page.tsx, src/app/api/kb/route.ts | PASO-03, PASO-05 | Validación de rutas y sanitización básica de contenido. | BAJO |
| **PASO-10** | Validación integral de compilación, typechecking y preparación de scripts de despliegue para Vercel. | package.json, scripts de verificación | PASO-01 a PASO-09 | Ejecución completa de 
px prisma generate y 
pm run build sin errores. | BAJO |

---

## 6. Pruebas y Validación

- **Typechecking estricto:** 
px tsc --noEmit para asegurar coherencia tipológica entre Prisma, Supabase y componentes de React.
- **Generación de Prisma:** 
px prisma generate para validar la sintaxis y relaciones del modelo relacional.
- **Build de Producción:** 
pm run build o pnpm build para confirmar que Next.js emite las rutas estáticas y dinámicas sin advertencias críticas de empaquetado.
- **Criterios no automatizables / UX:**
  - Inspección de contraste en textos sobre glassmorphism para cumplir WCAG AA.
  - Verificación visual de fondos opacos (g-bg-elevated) en menús desplegables y modales.

---

## 7. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Incompatibilidad de peer dependencies entre Next.js 15 y React 19 con librerías accesorias | MEDIA | MEDIO | Fijar versiones exactas probadas en package.json (Next 15.1+, React 19, @supabase/ssr latest) y verificar dependencias durante PASO-01. |
| Fuga de cookies de sesión en redirecciones del middleware | MEDIA | ALTO | Implementar patrón estricto del skill 
extjs-server-first-auth: copiar supabaseResponse.cookies explícitamente a cualquier NextResponse.redirect(). |
| Conflictos de conectividad con Supabase PgBouncer en transacciones de taller | BAJA | ALTO | Asegurar que directUrl esté presente en schema.prisma para migraciones y operaciones que requieran conexión directa al puerto 5432. |
| Inconsistencia de estados en el Stepper del taller electrónico | BAJA | MEDIO | Utilizar transacciones atómicas prisma. al completar un paso y avanzar el currentStepId de la tarjeta. |

---

## 8. Permisos y Puntos de Aprobación

- **Dependencias externas:** Se requiere instalación de paquetes npm oficiales (
ext, eact, eact-dom, @supabase/ssr, @supabase/supabase-js, @prisma/client, prisma, lucide-react, zod, 	ailwindcss).
- **Migraciones de BD:** Se proporcionará el schema y seed listos; la aplicación contra base de datos remota Supabase requerirá las credenciales del usuario en .env.
- **Operaciones destructivas:** Ninguna. Se respetará la integridad de los datos existentes usando Soft Delete.

---

## 9. Reversión / Recuperación

- Todos los archivos se crean en el espacio de trabajo local de Nexo_TI. En caso de cualquier incidencia en un paso, los cambios pueden revertirse paso por paso mediante git checkout o eliminando los archivos correspondientes sin afectar ningún otro repositorio en el sistema.

---

## 10. Manifiesto Breve

- **Pasos:** 10 pasos estructurados y atómicos.
- **Archivos Clave:**
  - Configs: package.json, 	sconfig.json, 	ailwind.config.ts, ercel.json
  - Persistencia: prisma/schema.prisma, src/lib/prisma.ts, prisma/seed.ts
  - Auth: src/lib/supabase/server.ts, src/lib/supabase/client.ts, src/middleware.ts
  - UI Core: src/app/globals.css, src/components/layout/*, src/app/(dashboard)/layout.tsx
  - Negocio: src/app/(dashboard)/tickets/*, src/app/(dashboard)/taller/*, src/app/(dashboard)/kb/*
- **Riesgo:** MEDIO (Mitigado por arquitectura unificada y validación de tipos).
- **Bloqueos:** Ninguno identificado.
- **Skills Aplicadas:** cyber-glassmorphism-ui, 
extjs-server-first-auth, workflow-driven-saas.
