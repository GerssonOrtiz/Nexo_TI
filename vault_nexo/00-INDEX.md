---
title: Nexo TI V2 — Índice General del Cerebro
aliases: [Home, Nexo TI Brain, Índice]
tags: [cerebro, moc, indice, nexo-ti]
created: 2026-11-05
updated: 2026-11-05
status: core-completado
---

# 🧠 Nexo TI V2 — Vault Brain (MOC)

> Sistema unificado de **Mesa de Ayuda TI**, **Taller de Reparación de Tarjetas Electrónicas** y **Base de Conocimiento**, desarrollado con **Next.js 15+ (App Router)** y desplegado en **Vercel**.

Este vault modulariza y conecta todas las dimensiones arquitectónicas, de diseño, datos y operativas del proyecto.

---

## 🗺️ Mapa de Navegación (MOC)

```
🧠 NEXO TI BRAIN
├── 🏗️ [[01-arquitectura|Arquitectura]] (Stack, ADRs, Auth Server-First)
├── 🗂️ [[02-estructura-proyecto|Estructura del Proyecto]] (Mapa de archivos y árbol de directorios)
├── 📊 [[03-modelo-datos|Modelo de Datos]] (14 modelos, Diagrama ER, Enums Prisma)
├── 🎨 [[04-sistema-diseno|Sistema de Diseño]] (Dark Cyber Glassmorphism, Tokens, Reglas UI)
├── 📦 [[05-modulos-sistema|Módulos del Sistema]] (Auth, Tickets, Taller, KB, Admin)
├── 🔌 [[06-api-reference|API Reference]] (Endpoints REST, Contratos JSON, Roles)
├── ✅ [[07-estado-actual|Estado Actual]] (Fases completadas 1, 2 y 3)
├── 🚀 [[08-roadmap-fase-4|Roadmap — Fase 4]] (QR, Command Palette, Auditoría, Exportación)
└── 🔧 [[09-guias-operativas|Guías Operativas]] (Variables de entorno, Comandos, Despliegue, Reglas)
```

---

## ⚡ Accesos Rápidos por Módulo

- **Núcleo de Autenticación y Permisos:** [[01-arquitectura#flujo-de-autenticacion|Flujo Auth SSR]] · [[05-modulos-sistema#auth--rbac|Módulo Auth & RBAC]]
- **Mesa de Ayuda (Helpdesk):** [[05-modulos-sistema#mesa-de-ayuda-tickets|Kanban & IDOR]] · [[06-api-reference#tickets|Rutas /api/tickets]]
- **Taller Electrónico:** [[05-modulos-sistema#taller-electronico|Pipeline, Stepper & BOM]] · [[06-api-reference#taller-electronico|Rutas /api/taller]]
- **Base de Conocimiento:** [[05-modulos-sistema#base-de-conocimiento-kb|Artículos Markdown Sanitizados]]
- **Base de Datos & Esquema:** [[03-modelo-datos#entidades-principales|Tablas PostgreSQL / Supabase]] · [[03-modelo-datos#diagrama-er|Diagrama Entidad-Relación]]
- **Próximas Tareas:** [[08-roadmap-fase-4|Roadmap Fase 4: QR, Command Palette, PDF]]
