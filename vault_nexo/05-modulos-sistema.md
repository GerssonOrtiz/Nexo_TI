---
title: Módulos del Sistema
aliases: [Módulos, Tickets, Taller, KB, Admin, RBAC]
tags: [modulos, tickets, taller, kb, admin, rbac, negocio]
created: 2026-11-05
updated: 2026-11-05
---

# 📦 Módulos del Sistema

Nexo TI V2 integra cuatro subsistemas funcionales apoyados sobre una capa robusta de autenticación y control de acceso por roles.

---

## 🔐 1. Auth & RBAC (Control de Acceso)

El acceso al sistema está jerarquizado por roles validados criptográficamente en servidor:

- **`SOLICITANTE`**:
  - Puede crear y consultar exclusivamente sus propios tickets.
  - Puede leer artículos publicados de la Base de Conocimiento.
- **`ADMIN_TI`**:
  - Gestión integral de todos los tickets (asignación, cambio de estado, notas internas).
  - Control completo del taller electrónico (creación de tarjetas, avance de pasos, BOM, bitácora).
  - Redacción y publicación de artículos en la Base de Conocimiento (incluyendo borradores).
  - Administración de usuarios y visualización de la bitácora global de auditoría (`AuditLog`).

### Componentes de Soporte:
- `src/middleware.ts`: Guardia perimetral que intercepta requests y propaga cookies.
- `src/lib/auth.ts`: Funciones `getAuthUser()`, `requireAuth()`, `requireAdmin()`.
- `src/hooks/useUser.tsx`: `UserProvider` síncrono alimentado desde el Server Component `(dashboard)/layout.tsx`.

---

## 🎫 2. Mesa de Ayuda (Tickets)

Módulo concebido para la gestión ágil de incidencias técnicas en la organización:

- **Tablero Kanban Interactivo**:
  - Columnas correspondientes a los 5 estados: `ABIERTO`, `EN_PROGRESO`, `EN_ESPERA`, `RESUELTO`, `CERRADO`.
  - Tarjetas estilo glassmorphism con prioridad, categoría y asignación visual.
- **Seguridad contra IDOR**:
  - Las consultas en backend filtran forzosamente por `creatorId` si el usuario autenticado tiene rol `SOLICITANTE`.
- **Comentarios y Notas Internas**:
  - Comentarios públicos para comunicación con el solicitante.
  - Flag `isInternal = true` para notas técnicas privadas visibles únicamente por administradores de TI.
- **Auditoría y Trazabilidad**:
  - Todo cambio de estado genera un `AuditLog` inmutable.
  - Registro de `resolvedAt` y `closedAt` al alcanzar estados terminales.

---

## ⚡ 3. Taller Electrónico

Módulo especializado en el diagnóstico, reparación y control de componentes de tarjetas electrónicas:

- **Nomenclatura Estandarizada**:
  - Generación automática de identificador secuencial anual: `TRJ-{YYYY}-{NNN}` (e.g. `TRJ-2026-001`).
- **Pipeline de Reparación Configurable**:
  - Flujo por etapas ordenadas con validación de obligatoriedad (`isMandatory`).
  - *Pipeline Estándar inicial (seeded):*
    1. Recepción
    2. Diagnóstico Eléctrico
    3. Reparación
    4. Pruebas y Validación
    5. Documentación y Entrega
- **Stepper Transaccional Atómico**:
  - El avance de etapas se ejecuta dentro de un `prisma.$transaction`:
    1. Marca el paso actual como `COMPLETADO`.
    2. Identifica el siguiente paso y crea su registro `EN_PROGRESO`.
    3. Si no existen pasos restantes, actualiza el estado general de la tarjeta a `REPARADA`.
- **Gestión de Lista de Materiales (BOM - Bill of Materials)**:
  - Registro de piezas por designador esquemático (ej. `R12`, `C45`, `U3`), número de parte (P/N), encapsulado y estado (`REQUERIDO`, `EN_STOCK`, `SOLICITADO`, `INSTALADO`).
- **Bitácora Técnica Cronológica**:
  - Registro de bitácora con categorías especializadas: `NOTA_TECNICA`, `MEDICION`, `CAMBIO_ESTADO`, `ALERTA`.

---

## 📚 4. Base de Conocimiento (KB)

Repositorio centralizado de manuales, soluciones frecuentes y documentación técnica:

- **Markdown Sanitizado**:
  - Renderizado seguro con sanitización de HTML para mitigación rigurosa de vulnerabilidades XSS.
- **Auto-generación de Slugs**:
  - Normalización Unicode automática a partir del título para URLs limpias y amigables.
- **Métricas de Consulta**:
  - Contador atómico de lecturas (`viewCount`) con incremento automático al visualizar el artículo.
- **Control Editorial por Roles**:
  - Los usuarios solicitantes únicamente visualizan artículos con `isPublished = true`.
  - Los administradores pueden gestionar y revisar borradores no publicados.

---

## 🛡️ 5. Administración y Auditoría

Panel de control reservado para administradores `ADMIN_TI`:

- **Gestión de Cuentas de Usuario**:
  - Catálogo de usuarios, control de activación (`isActive`) y eliminación lógica (`deletedAt`).
- **Bitácora de Auditoría (Audit Logs)**:
  - Línea de tiempo cronológica con los últimos eventos registrados en la base de datos (creaciones, modificaciones, cambios de estado y accesos).
  - Códigos de color y badges para una lectura visual rápida de incidentes y auditorías.

---

*Ver más:* [[00-INDEX|Índice General]] · [[03-modelo-datos|Modelo de Datos]] · [[06-api-reference|API Reference]]
