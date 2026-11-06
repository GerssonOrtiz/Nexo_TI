---
title: API Reference y Rutas del Sistema
aliases: [API Reference, Endpoints, Rutas API, REST]
tags: [api, rest, endpoints, next-js, routes]
created: 2026-11-05
updated: 2026-11-05
---

# 🔌 API Reference y Contratos REST

Todas las rutas API residen en `src/app/api/` y adoptan convenciones homogéneas de validación con **Zod** y respuestas tipadas en formato JSON.

---

## 📦 Formato Estándar de Respuesta (`ApiResponse<T>`)

```typescript
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

---

## 📑 Tabla de Endpoints

| Método | Ruta | Nivel de Auth | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/login` | Público | Autenticación de usuario con email y contraseña |
| `POST` | `/api/auth/logout` | Autenticado | Cierre de sesión y limpieza de cookies |
| `GET` | `/api/tickets` | Autenticado | Listado de tickets (con filtrado IDOR por solicitante) |
| `POST` | `/api/tickets` | Autenticado | Creación de ticket validado con Zod |
| `GET` | `/api/tickets/[id]` | Autenticado | Detalle completo de ticket con comentarios |
| `PATCH` | `/api/tickets/[id]` | `ADMIN_TI` | Actualización de estado, prioridad o asignación con audit log |
| `GET` | `/api/taller/boards` | `ADMIN_TI` | Listado general de tarjetas electrónicas |
| `POST` | `/api/taller/boards` | `ADMIN_TI` | Registro de tarjeta con código incremental `TRJ-YYYY-NNN` |
| `POST` | `/api/taller/boards/[id]/step` | `ADMIN_TI` | Transición atómica de paso en el pipeline de reparación |
| `GET` | `/api/taller/boards/[id]/components` | `ADMIN_TI` | Obtención de lista de materiales (BOM) de la tarjeta |
| `POST` | `/api/taller/boards/[id]/components` | `ADMIN_TI` | Adición o actualización de componentes en la BOM |
| `GET` | `/api/taller/boards/[id]/logs` | `ADMIN_TI` | Historial de bitácora técnica de la tarjeta |
| `POST` | `/api/taller/boards/[id]/logs` | `ADMIN_TI` | Nueva entrada en la bitácora técnica de la tarjeta |
| `GET` | `/api/taller/pipelines` | `ADMIN_TI` | Catálogo de pipelines y flujos de reparación activos |
| `GET` | `/api/kb` | Autenticado | Artículos de la base de conocimiento (filtrados por rol) |
| `POST` | `/api/kb` | `ADMIN_TI` | Publicación o guardado de nuevo artículo técnico |

---

## 🔒 Convenciones de Seguridad en APIs

1. **Extracción y Validación de Sesión**:
   - Cada handler protegido invoca `getAuthUser()` (`src/lib/auth.ts`), la cual evalúa criptográficamente el token contra Supabase con `supabase.auth.getUser()`.
2. **Validación de Schemas**:
   - Todo payload entrante (`req.json()`) se procesa mediante `.parse()` o `.safeParse()` de Zod antes de alcanzar la base de datos.
3. **Auditoría Sistemática**:
   - Acciones que alteran datos (`POST`, `PATCH`, `DELETE`) emiten un registro en `prisma.auditLog.create` documentando usuario, acción, entidad y metadata antes de responder.

---

*Ver más:* [[00-INDEX|Índice General]] · [[01-arquitectura|Arquitectura]] · [[05-modulos-sistema|Módulos del Sistema]]
