# 🧠 Nexo TI V2 — Instrucciones y Cerebro del Proyecto

> Este archivo es cargado **automáticamente por el agente en cada sesión y en el primer prompt** como regla de espacio de trabajo (*Workspace Rules*).

---

## 📌 Identidad y Propósito
- **Proyecto:** Nexo TI V2 — Sistema unificado de **Mesa de Ayuda TI**, **Taller de Reparación de Tarjetas Electrónicas** y **Base de Conocimiento**.
- **Stack:** Next.js 15.1.7 (App Router), React 19, TypeScript 5 (estricto), Tailwind CSS 3, Prisma 5.22, PostgreSQL (Supabase Auth SSR), Zod 3.24.
- **Despliegue:** Vercel (Full-Stack unificado).

---

## 📚 Mapa del Cerebro (Vault)
Para detalles profundos y especificaciones técnicas, consulta los archivos en `vault_nexo/` o el consolidado `NEXO_TI_BRAIN.md`:
- **Arquitectura y ADRs:** `vault_nexo/01-arquitectura.md` (ADR-001 a ADR-004, Flujo Server-First)
- **Estructura del Proyecto:** `vault_nexo/02-estructura-proyecto.md` (Rutas y mapa de archivos)
- **Modelo de Datos y ER:** `vault_nexo/03-modelo-datos.md` (14 modelos, 9 enums, pooling + directUrl)
- **Sistema de Diseño:** `vault_nexo/04-sistema-diseno.md` (Dark Cyber Glassmorphism, tokens de color, accesibilidad)
- **Módulos del Sistema:** `vault_nexo/05-modulos-sistema.md` (Auth SSR, Tickets Kanban, Taller con Stepper/BOM, KB, Admin)
- **API Reference:** `vault_nexo/06-api-reference.md` (Endpoints REST, Zod, respuestas `{ success, data?, error? }`)
- **Estado Actual:** `vault_nexo/07-estado-actual.md` (Fases 1, 2 y 3 completadas; compilación verificada)
- **Roadmap Pendiente:** `vault_nexo/08-roadmap-fase-4.md` (QR en tarjetas, Command Palette Ctrl+K, Visor de Auditoría, PDF/Excel)
- **Guías Operativas:** `vault_nexo/09-guias-operativas.md` (Variables de entorno, pnpm, comandos Prisma y despliegue)

---

## ⚡ Reglas Críticas de Desarrollo (Siempre Activas)
1. **Server Components por Defecto:** Mantener páginas y layouts como Server Components. Solo usar `'use client'` para componentes interactivos (hooks de estado, eventos, formularios reactivos).
2. **Autenticación Server-First:** Usar siempre `supabase.auth.getUser()` para validar autorización; **nunca** `getSession()` ya que no valida criptográficamente en servidor.
3. **Validación Zod:** Toda entrada en Route Handlers (`src/app/api/...`) debe validarse con esquemas Zod antes de operar en la BD.
4. **Respuestas API Homogéneas:** Devolver siempre la estructura `{ success: true, data?: T }` o `{ success: false, error: string }`.
5. **Auditoría Inmutable:** Toda mutación (`CREATE`, `UPDATE`, `DELETE`, `STATUS_CHANGE`) debe registrarse en `prisma.auditLog.create`.
6. **Accesibilidad Glassmorphism:** Dropdowns, tooltips y modales deben tener fondo 100% opaco (`bg-elevated` / `#1a2236`), nunca transparentes (WCAG AA).
7. **Rendimiento Visual:** Cero librerías pesadas de animación (no Framer Motion); usar exclusivamente transiciones nativas de Tailwind CSS.
