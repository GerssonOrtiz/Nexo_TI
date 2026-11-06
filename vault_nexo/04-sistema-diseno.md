---
title: Sistema de Diseño — Dark Cyber Glassmorphism
aliases: [Sistema de Diseño, Glassmorphism, Tokens UI, CSS]
tags: [design-system, glassmorphism, tailwind, ui-ux, css]
created: 2026-11-05
updated: 2026-11-05
---

# 🎨 Sistema de Diseño — Dark Cyber Glassmorphism

La interfaz de Nexo TI V2 sigue una estética industrial técnica denominada **Dark Forge Glassmorphism**, inspirada en consolas cibernéticas y sistemas espaciales (Apple Vision Pro HUD).

---

## 🎨 Paleta de Colores y Tokens

Tokens definidos en `tailwind.config.ts`:

| Token | Valor Hex / CSS | Rol en Interfaz |
|---|---|---|
| `bg-forge` | `#050811` | Fondo general de la aplicación |
| `bg-forge-mid` | `#090D1A` | Superficies secundarias intermedias |
| `bg-forge-high` | `#0E1424` | Contenedores y paneles elevados |
| `bg-base` | `#0A0F1E` | Fondo base complementario |
| `bg-surface` | `#111827` | Fondos de tarjetas y contenedores |
| `bg-elevated` | `#1a2236` | **100% opaco**: Dropdowns, modales, tooltips (WCAG) |
| `neon-blue` | `#00D2FF` | Acento primario, foco activo, terminal highlights |
| `neon-purple` | `#818CF8` | Acento secundario, gradientes y estados de hover |
| `text-primary` | `#F1F5F9` | Tipografía principal (alto contraste) |
| `text-secondary` | `#94A3B8` | Textos de apoyo, etiquetas, metadatos |
| `border-subtle` | `rgba(255, 255, 255, 0.08)` | Bordes sutiles para delimitar zonas vítreas |

---

## 💎 Componentes CSS Clave (`src/app/globals.css`)

- **`.glass-card`**: Superficie translúcida con `backdrop-blur(28px)`, gradiente especular superior y sombra profunda para generar sensación de elevación y profundidad.
- **`.vision-sidebar-capsule`**: Cápsula de navegación flotante estilo Apple Vision Pro con esquinas redondeadas (`rounded-3xl` / `1.5rem`), fijada y flotante respecto al marco exterior.
- **`.vision-item-bubble`**: Items de navegación con microinteracción al pasar el cursor (`transform: scale(1.02)` y resplandor sutil).
- **`.linux-grid-bg`**: Patrón de cuadrícula ciberespacial (líneas cyan con 3% de opacidad) que aporta textura sin restar legibilidad.
- **`.btn-neon-primary`**: Botón de acción principal con gradiente `neon-blue → neon-purple` y sombra de resplandor.
- **`.btn-glass-secondary`**: Botón secundario translúcido con borde sutil.
- **`.input-cyber`**: Input de formulario con fondo opaco `#1a2236`, borde reactivo y focus ring en `neon-blue`.

---

## ♿ Reglas de Accesibilidad y Buenas Prácticas

1. **Opacidad estricta en elementos flotantes interactivos**:
   - Menús desplegables (dropdowns), selectores de fecha, tooltips y modales emergentes deben usar **`bg-elevated`** (100% opaco). Queda prohibido aplicar translucidez en zonas de lectura crítica o de interacción superpuesta para evitar fallos de contraste.
2. **Contraste WCAG AA**:
   - Todo texto informativo debe mantener al menos un ratio de contraste de `4.5:1` frente a su fondo.
3. **Animaciones ligeras y nativas**:
   - Prohibido el uso de librerías de animación pesadas (e.g. Framer Motion). Las animaciones se limitan a utilidades nativas de Tailwind CSS (`transition-all`, `duration-200`, `ease-in-out`, transiciones de opacidad y escala).

---

*Ver más:* [[00-INDEX|Índice General]] · [[02-estructura-proyecto|Estructura del Proyecto]] · [[05-modulos-sistema|Módulos del Sistema]]
