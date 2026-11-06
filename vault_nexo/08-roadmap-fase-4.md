---
title: Roadmap — Fase 4: Mejoras de Alto Impacto
aliases: [Roadmap, Fase 4, Pendientes, Features Futuras]
tags: [roadmap, fase-4, qr, command-palette, auditoria, reportes]
created: 2026-11-05
updated: 2026-11-05
---

# 🚀 Roadmap — Fase 4: Mejoras de Alto Impacto

Plan de evolución técnica y funcional para maximizar la productividad y operatividad del sistema en producción.

---

## 📱 4.1 — Códigos QR para Tarjetas Electrónicas

- **Objetivo:** Generar etiquetas físicas con código QR que codifiquen el identificador `internalCode` (`TRJ-{YYYY}-{NNN}`) para escaneo y trazabilidad instantánea desde dispositivos móviles en el taller.
- **Tecnología recomendada:** `qrcode.react` (renderizado SVG / Canvas ultraligero).
- **Alcance planificado:**
  - [ ] Componente reutilizable `<BoardQRCode boardCode={string} />`.
  - [ ] Botón de acción rápida *"Imprimir etiqueta"* en la vista de detalle de tarjeta (`/taller/[id]`).
  - [ ] Hoja de estilo CSS de impresión optimizada para impresoras térmicas de etiquetas (`@media print`).
  - [ ] Ruta de escaneo `/taller/scan` que reciba el código detectado por cámara y redirija al detalle correspondiente.

---

## 🔍 4.2 — Command Palette (`Ctrl + K`)

- **Objetivo:** Proveer un menú de comandos y buscador global tipo Spotlight para navegación instantánea a tickets, tarjetas, artículos o usuarios sin emplear el ratón.
- **Tecnología recomendada:** `cmdk` o modal dialog accesible con Radix UI primitives.
- **Alcance planificado:**
  - [ ] Montaje global del componente `<CommandPalette />` dentro del `DashboardShell`.
  - [ ] Endpoint de búsqueda unificada `/api/search` que consulte paralelamente tickets, tarjetas, artículos KB y usuarios.
  - [ ] Prefijos y filtros rápidos de teclado (`> ticket`, `> tarjeta`, `> kb`).
  - [ ] Lista de resultados agrupados por tipo con badges distintivos e iconografía.
  - [ ] Atajos globales `Ctrl + K` (Windows/Linux) y `Cmd + K` (macOS).

---

## 🛡️ 4.3 — Visor de Auditoría Avanzado

- **Objetivo:** Dotar al equipo de administración de una consola interactiva para investigar incidentes, cambios de estado y modificaciones de datos.
- **Alcance planificado:**
  - [ ] Página `/admin/audit` con vista en tabla y filtros combinados (entidad, acción, autor, rango de fechas).
  - [ ] Línea de tiempo visual agrupada por días e hitos de actividad.
  - [ ] Modal emergente con visualizador JSON para inspeccionar el `diff` de metadata de cada evento.
  - [ ] Capacidad de exportación de registros filtrados a formato CSV.
  - [ ] Endpoint `/api/admin/audit` con soporte para paginación basada en cursor (*cursor-based pagination*).

---

## 📄 4.4 — Exportación a PDF y Excel

- **Objetivo:** Emisión de dictámenes técnicos y reportes gerenciales para entrega a clientes internos y rendición de cuentas.
- **Tecnología recomendada:** `@react-pdf/renderer` para renderizado de documentos server-side y `xlsx` para hojas de cálculo.
- **Alcance planificado:**
  - [ ] **Ficha Técnica de Tarjeta (PDF):** Documento formal con resumen del equipo, historial de pasos con firmas, lista BOM de componentes reemplazados, bitácora técnica y QR de validación.
  - [ ] **Reporte Operativo de Tickets (Excel):** Exportación con filtros aplicados (por fechas, áreas o resolutores).
  - [ ] **Reporte Mensual del Taller (PDF):** Estadísticas de rendimiento (MTTR, volumen de tarjetas reparadas vs. irreparables, componentes más utilizados).
  - [ ] Rutas dedicadas: `/api/export/board/[id]/pdf` y `/api/export/tickets/excel`.

---

*Ver más:* [[00-INDEX|Índice General]] · [[07-estado-actual|Estado Actual]] · [[05-modulos-sistema|Módulos del Sistema]]
