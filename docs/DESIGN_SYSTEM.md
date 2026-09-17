# Sistema de Diseño — UPMINA Web

Documento que define los tokens visuales y las reglas de diseño para mantener
coherencia estética con la marca UPMINA.

---

## 🎨 Paleta de colores

### Colores base
| Token | Valor | Uso |
|---|---|---|
| `bg-base` | `#0a0a0a` | Fondo principal |
| `bg-surface` | `#141414` | Tarjetas, secciones |
| `bg-elevated` | `#1e1e1e` | Modales, dropdowns |
| `border-subtle` | `#2a2a2a` | Bordes suaves |
| `border-strong` | `#3a3a3a` | Bordes marcados |

### Colores de acento
| Token | Valor | Uso |
|---|---|---|
| `accent-primary` | `#ff2d95` | Fucsia neón (CTA, links) |
| `accent-secondary` | `#00f0ff` | Cian eléctrico (highlights) |
| `accent-live` | `#ff0033` | Rojo para estado EN VIVO |
| `accent-success` | `#00ff88` | Confirmaciones |
| `accent-warning` | `#ffb800` | Advertencias |

### Colores de texto
| Token | Valor | Uso |
|---|---|---|
| `text-primary` | `#f5f5f5` | Texto principal |
| `text-secondary` | `#a0a0a0` | Texto secundario |
| `text-muted` | `#666666` | Texto deshabilitado |
| `text-inverse` | `#0a0a0a` | Texto sobre fondos claros |

---

## 🔤 Tipografía

### Familias
- **Display / Títulos**: `Bebas Neue` (mayúsculas, condensada, contundente)
- **Body / UI**: `Inter` (legible, moderna, amplia gama de pesos)
- **Monoespaciada**: `JetBrains Mono` (para código o datos técnicos)

### Escala
| Token | Tamaño | Uso |
|---|---|---|
| `text-xs` | 0.75rem | Labels, badges |
| `text-sm` | 0.875rem | Texto secundario |
| `text-base` | 1rem | Cuerpo de texto |
| `text-lg` | 1.125rem | Subtítulos |
| `text-xl` | 1.25rem | Títulos de tarjetas |
| `text-3xl` | 1.875rem | Títulos de sección |
| `text-5xl` | 3rem | Hero |
| `text-7xl` | 4.5rem | Nombre "UPMINA" |

---

## 📐 Espaciados

Base de 4px. Escala de Tailwind estándar:

`0, 1 (4px), 2 (8px), 3 (12px), 4 (16px), 6 (24px), 8 (32px), 12 (48px), 16 (64px)`

---

## 🔘 Bordes y radios

| Token | Valor | Uso |
|---|---|---|
| `rounded-sm` | 4px | Badges pequeños |
| `rounded-md` | 8px | Botones, inputs |
| `rounded-lg` | 12px | Tarjetas |
| `rounded-xl` | 16px | Modales |
| `rounded-full` | 9999px | Avatares, pills |

---

## 🌟 Efectos visuales

- **Glow neón**: `box-shadow: 0 0 20px rgba(255, 45, 149, 0.5)` para CTAs.
- **Gradientes**: lineales de fucsia a cian para hovers destacados.
- **Ruido sutil**: textura de grano al 3% de opacidad en fondos.
- **Backdrop blur**: `backdrop-blur-md` en headers sticky y modales.

---

## 🧩 Componentes base (HeroUI)

| Componente | Uso |
|---|---|
| `Button` | CTA, acciones |
| `Card` | Contenedores de contenido |
| `Modal` | Diálogos, previews |
| `Input` / `Textarea` | Formularios |
| `Avatar` | Perfiles de usuario |
| `Badge` | Estados (LIVE, pending) |
| `Tabs` | Navegación dentro de secciones |
| `Tooltip` | Información contextual |

---

## 📱 Breakpoints

| Nombre | Ancho mínimo |
|---|---|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

---

## ♿ Accesibilidad

- Contraste mínimo WCAG AA (4.5:1 en texto normal, 3:1 en grande).
- Foco visible en todos los elementos interactivos (outline cian).
- Navegación completa por teclado.
- `aria-label` en todos los iconos sin texto.
- Respeto por `prefers-reduced-motion`.

---

## 🎬 Componentes específicos: YouTube

### `<HeroVideo>`
- Contenedor con aspecto 16:9 y ancho completo de su sección.
- Sombra externa con `accent-primary` al 30% para destacar.
- Overlay inferior con gradiente `linear-gradient(to top, rgba(0,0,0,0.9), transparent)`.
- Título en `text-2xl` (desktop) / `text-lg` (móvil), con `font-display`.
- Metadatos en `text-sm` y `text-secondary`: fecha relativa + duración.
- Botón "Ver en YouTube" con icono, en `text-muted` al hover.

### `<VideoCard>`
- Aspecto 16:9 para la miniatura.
- Radio `rounded-lg`.
- Borde de `2px` transparente por defecto.
- Al hover: borde `accent-secondary` y ligera elevación (`translateY(-2px)`).
- Cuando está seleccionado: borde `accent-primary` + badge "Reproduciendo".
- Duración superpuesta en la esquina inferior derecha con fondo negro
  semitransparente y texto blanco.
- Título limitado a 2 líneas con `line-clamp-2`.

### `<VideoGrid>`
- 4 columnas en `lg`, 3 en `md`, 2 en `sm`, 1 en móvil.
- Gap de `gap-4`.
- Scroll infinito o paginación en fase futura.
