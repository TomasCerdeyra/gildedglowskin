# Prompt de Desarrollo: Gilded Glow Skin — E-commerce de Skincare

---

## 🎨 Identidad Visual y Paleta de Colores

Estética general: **"Soft Premium"** — elegante, limpio, femenino sin ser infantil. Que transmita que el producto es de calidad sin ser inalcanzable.

| Rol | Hex | Uso |
|---|---|---|
| Primario (Brand) | `#D79A9A` | Fondos de sección, acentos decorativos, bordes suaves |
| Acento / CTA | `#8B1E2D` | Títulos H1/H2, botones principales, links activos |
| Fondo Base | `#FFF9F9` | Background general de la página |
| Texto Cuerpo | `#4A4A4A` | Párrafos, descripciones largas |
| Glow / Detalle | `#D4AF37` | Badges, estrellas, detalles decorativos dorados |
| Blanco puro | `#FFFFFF` | Cards, modales, navbar con glassmorphism |

**Tipografía:**
- Títulos (H1, H2, H3): `Playfair Display` (Google Fonts) — serif elegante que transmite lujo.
- Cuerpo y UI (párrafos, botones, labels): `DM Sans` — sans-serif legible y moderno.
- Cargalas vía `next/font/google` para que no bloqueen el render.

---

## 🛠 Stack Tecnológico

- **Framework:** Next.js 14+ con App Router. Usar Server Components por defecto; Client Components solo donde haya interactividad.
- **Estilos:** Tailwind CSS con los colores de marca extendidos en `tailwind.config.ts`.
- **Base de datos y Auth:** Supabase (PostgreSQL + Auth + Storage para imágenes).
- **Imágenes:** `next-cloudinary` o `next/image` con Supabase Storage como fuente. Optimización automática con `sizes` y `priority` en el hero.
- **Iconos:** `lucide-react`.
- **Animaciones:** `framer-motion` para transiciones de página, apariciones al hacer scroll (viewport animations) y micro-interacciones en cards.
- **Formularios/Validación (panel admin):** `react-hook-form` + `zod`.
- **Editor de texto enriquecido (Guía Glow):** `Tiptap` o `react-quill` para el panel admin.

---

## 🗄 Schema de Base de Datos (Supabase / PostgreSQL)

Crear las siguientes tablas exactamente con estos campos:

### Tabla: `categorias`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
nombre      text NOT NULL          -- ej: "Sérums", "Hidratantes"
slug        text NOT NULL UNIQUE   -- ej: "serums", "hidratantes"
descripcion text
orden       int DEFAULT 0
created_at  timestamptz DEFAULT now()
```

### Tabla: `productos`
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
nombre            text NOT NULL
slug              text NOT NULL UNIQUE        -- para URLs /productos/[slug]
descripcion_corta text NOT NULL              -- máx 120 caracteres, para la card
descripcion_larga text                       -- texto completo para la página del producto
precio            numeric(10,2) NOT NULL
precio_tachado    numeric(10,2)              -- NULL si no está en oferta
imagen_principal  text NOT NULL              -- URL de Supabase Storage o Cloudinary
imagenes_extra    text[]                     -- array de URLs adicionales
categoria_id      uuid REFERENCES categorias(id)
stock             int NOT NULL DEFAULT 0     -- para mostrar "Últimas X unidades"
activo            boolean DEFAULT true       -- para ocultar sin borrar
destacado         boolean DEFAULT false      -- para mostrar en el hero o sección especial
orden             int DEFAULT 0              -- para drag & drop en el admin
guia_id           uuid REFERENCES guias(id) -- nullable, se linkea después
tags              text[]                     -- ej: ["piel seca", "anti-edad"]
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
```

### Tabla: `guias`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
producto_id     uuid REFERENCES productos(id) ON DELETE CASCADE
slug            text NOT NULL UNIQUE          -- para URLs /guia/[slug]
titulo          text NOT NULL
subtitulo       text                          -- bajada del artículo
ingredientes    jsonb                         -- array de { nombre, descripcion, beneficio }
pasos_uso       jsonb                         -- array de { numero, titulo, descripcion }
beneficios      text[]                        -- lista de beneficios cortos
para_quien_es   text                          -- descripción del tipo de piel ideal
tips            text                          -- texto libre con consejos extra
contenido_rico  text                          -- HTML del editor Tiptap
imagen_banner   text                          -- URL de imagen de cabecera de la guía
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

### Tabla: `reseñas` *(estructura lista para cuando lleguen las reseñas reales)*
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
producto_id uuid REFERENCES productos(id) ON DELETE CASCADE
autor       text NOT NULL
tipo_piel   text              -- ej: "Piel mixta", "Piel seca"
texto       text NOT NULL
estrellas   int CHECK (estrellas BETWEEN 1 AND 5)
foto_url    text              -- opcional
activa      boolean DEFAULT false   -- el admin aprueba antes de publicar
created_at  timestamptz DEFAULT now()
```

### Políticas de Row Level Security (RLS)
- Tablas `productos`, `categorias`, `guias`, `reseñas`: **lectura pública** (SELECT para anon).
- **Escritura (INSERT, UPDATE, DELETE):** solo para usuarios autenticados con rol `admin`.
- El admin se crea manualmente en Supabase Auth con el email del negocio.

---

## 🏗 Estructura de Rutas (App Router)

```
app/
├── layout.tsx                  ← Layout global: fuentes, navbar, footer, Meta Pixel placeholder
├── page.tsx                    ← Landing page (home)
├── productos/
│   └── [slug]/
│       └── page.tsx            ← Página de detalle de producto
├── guia/
│   ├── page.tsx                ← Índice de todas las guías
│   └── [slug]/
│       └── page.tsx            ← Guía individual
├── admin/
│   ├── layout.tsx              ← Protección de ruta con middleware de Supabase Auth
│   ├── page.tsx                ← Dashboard del admin
│   ├── productos/
│   │   ├── page.tsx            ← Lista de productos con drag & drop
│   │   ├── nuevo/page.tsx      ← Formulario de creación
│   │   └── [id]/page.tsx       ← Formulario de edición
│   ├── guias/
│   │   ├── page.tsx
│   │   ├── nueva/page.tsx
│   │   └── [id]/page.tsx
│   ├── categorias/page.tsx
│   └── reseñas/page.tsx        ← Moderación (para el futuro)
└── auth/
    └── login/page.tsx          ← Login del admin
```

---

## 📄 Landing Page — Secciones Detalladas

### 1. Navbar

- **Comportamiento:** Sticky. Al hacer scroll hacia abajo, fondo con glassmorphism (`backdrop-blur-md bg-white/70`). Al estar en el top de la página, transparente.
- **Logo:** SVG o imagen desde `/public`, linkea a `/`.
- **Links de navegación:** Inicio · Productos · Guía Glow · FAQ
- **CTA derecha:** Botón pequeño "Contacto por WhatsApp" con ícono de WhatsApp (lucide o SVG), color `#8B1E2D`.
- **Responsive:** En mobile, hamburger menu con drawer lateral animado con framer-motion.

### 2. Hero Section

- **Layout:** Full-screen (100vh) con imagen de fondo de alta calidad + overlay con gradiente sutil (`from-[#FFF9F9]/80 to-transparent`) para que el texto respire.
- **Contenido izquierdo (o centrado en mobile):**
  - Tag pequeño superior: "✦ Skincare de autor" en color `#D79A9A`
  - H1: Título de impacto en `Playfair Display`, color `#8B1E2D`. Ejemplo de copy: *"Tu piel merece el ritual que siempre soñó."*
  - Párrafo bajada: breve y aspiracional, max 2 líneas.
  - CTA principal: Botón grande "Explorar Colección" → hace scroll suave a `#catalogo`. Color `#8B1E2D` con texto blanco. Con animación de hover (leve elevación + sombra).
  - CTA secundario: Link con flecha "Ver Guía Glow →" que lleva a `/guia`.
- **Elemento decorativo:** Detalle dorado (`#D4AF37`) como línea, punto o forma geométrica sutil cerca del título.
- **Imagen:** Carrusel automático (3-4 imágenes) con autoplay lento y fade transition. Las imágenes se gestionan desde el admin. Placeholder con imagen de alta calidad de skincare mientras no haya fotos propias.

### 3. Banda de Beneficios (Trust Bar)

Justo debajo del hero. Fondo `#D79A9A` suave o `#FFF9F9` con borde. Fila horizontal de 3-4 ítems con ícono + texto corto. Ejemplos de contenido (editable desde admin):

- ✦ Fórmulas con ingredientes activos
- ✦ Apto todo tipo de piel
- ✦ Pedidos por WhatsApp
- ✦ Atención personalizada

Esta banda da confianza inmediata y ocupa el espacio donde irían los testimonios más adelante.

### 4. Catálogo de Productos *(id="catalogo")*

- **Filtros de categoría:** Tabs o pills horizontales al tope: "Todos · Sérums · Hidratantes · Limpiadores · Mascarilla Hidrogel". En mobile, scroll horizontal. El filtro activo tiene borde o fondo `#8B1E2D`.
- **Grid:**
  - Desktop: 3 columnas.
  - Tablet: 2 columnas.
  - Mobile: 1 columna (card wide) o 2 columnas compactas.
- **Card de Producto:**
  - Imagen con aspect-ratio fijo (4:3 o 1:1). Efecto hover: zoom suave (`scale-105`) con `transition-transform duration-300`.
  - Badge condicional de stock: si `stock <= 5`, mostrar badge rojo "Últimas {stock} unidades" sobre la imagen.
  - Badge de oferta: si `precio_tachado` no es null, mostrar badge dorado "OFERTA".
  - Nombre del producto en `Playfair Display`.
  - Descripción corta en `DM Sans`, color `#4A4A4A`, máx 2 líneas con truncado.
  - Precio: si hay `precio_tachado`, mostrarlo tachado y el precio nuevo en `#8B1E2D`.
  - **Botón principal:** "Pedir por WhatsApp" — fondo `#8B1E2D`, texto blanco, ícono de WhatsApp. El link debe construirse dinámicamente así:
    ```
    https://wa.me/5493329516376?text=Hola!%20Me%20interesa%20el%20producto%3A%20[NOMBRE_PRODUCTO]%20-%20%24[PRECIO]
    ```
  - **Link secundario:** "Ver detalles →" que lleva a `/productos/[slug]`.

### 5. Guía Glow — Preview Section

- **Título de sección:** "The Glow Bible" o "Tu Ritual Glow" en `Playfair Display`.
- **Descripción:** 1-2 líneas explicando qué es la guía.
- **Layout:** Grid de 3 cards (las 3 guías más recientes). Cada card muestra: imagen banner de la guía, título, primera línea de descripción y botón "Leer guía →" que lleva a `/guia/[slug]`.
- **CTA final:** Botón centrado "Ver todas las guías" → `/guia`.
- Estas guías se asocian a productos. En la card, mostrar el nombre del producto relacionado como un tag pequeño.

### 6. Banner de Envíos / Info Clave

- Bloque de ancho completo, fondo `#FFF9F9` con borde superior/inferior `#D79A9A`.
- **Contenido placeholder (editable desde admin):** Mostrar texto como "Realizamos envíos. Consultanos por WhatsApp para más info." hasta que el negocio defina los detalles.
- En el admin, este bloque debe ser un campo de texto editable (tipo "banner_envios_texto" en una tabla `configuracion`).

### 7. FAQ

- Diseño de acordeón moderno. Solo una pregunta abierta a la vez.
- Animación suave de apertura/cierre con framer-motion.
- Preguntas pre-cargadas en la base de datos o en el propio componente (editables desde admin):
  - ¿Los productos son aptos para piel sensible?
  - ¿Cómo hago un pedido?
  - ¿Hacen envíos? ¿Cuál es el costo?
  - ¿Cuánto tarda en llegar mi pedido?
  - ¿Tienen política de devoluciones?
- Tabla en Supabase: `faqs (id, pregunta, respuesta, orden, activa)`.

### 8. Footer

- **Columna 1:** Logo + tagline corto + ícono de Instagram linkeando a `https://instagram.com/gildedglowskin`.
- **Columna 2:** Links rápidos (Inicio, Productos, Guía Glow, FAQ).
- **Columna 3:** Contacto — ícono de WhatsApp con el número +54 3329 516376, ícono de Instagram.
- **Fila inferior:** Copyright "© 2025 Gilded Glow Skin. Todos los derechos reservados."
- Fondo: `#8B1E2D` oscuro o `#4A4A4A` con texto blanco para contraste. Detalles dorados `#D4AF37`.

---

## 📖 Guía Glow — Páginas Dinámicas

### `/guia` — Índice

- Grid de todas las guías disponibles, igual al catálogo de productos pero con imagen de banner de cada guía.
- Filtro por categoría de producto relacionado.

### `/guia/[slug]` — Artículo Individual

Estructura de la página:

1. **Banner superior:** imagen de cabecera full-width con overlay y título de la guía encima.
2. **Breadcrumb:** Inicio > Guía Glow > [Nombre de la guía]
3. **Para quién es:** Bloque destacado con tipo de piel recomendado.
4. **Ingredientes clave:** Grid o lista visual con nombre del ingrediente + descripción + beneficio. Ícono decorativo por ítem.
5. **Modo de uso paso a paso:** Timeline vertical numerado, un paso por ítem.
6. **Beneficios esperados:** Lista con checkmarks en `#8B1E2D`.
7. **Tips extra:** Bloque de texto libre con fondo `#D79A9A` suave, estilo "consejo destacado".
8. **Contenido Rico:** Sección renderizada desde el editor HTML (Tiptap output).
9. **CTA final:** Card con imagen del producto relacionado + botón "Pedir por WhatsApp" con el link dinámico.
10. **Guías relacionadas:** 2-3 guías de otros productos al final.

La página debe tener `generateMetadata` con título, descripción y OG image dinámica para SEO.

---

## 📄 Página de Detalle de Producto `/productos/[slug]`

1. **Galería:** Imagen principal grande + thumbnails de imágenes extra. Click para ver en grande (lightbox simple).
2. **Info del producto:**
   - Nombre en `Playfair Display`.
   - Precio (con precio tachado si aplica).
   - Badge de stock si `stock <= 5`.
   - Descripción larga en párrafos.
   - Tags de tipo de piel (de `tags[]`).
3. **CTA:** Botón "Pedir por WhatsApp" prominente con el link dinámico.
4. **Bloque "Cómo usarlo":** Link a la guía asociada si existe — card preview con botón "Ver guía completa →".
5. **Productos relacionados:** Grid de 3 productos de la misma categoría.
6. `generateMetadata` con SEO dinámico (título, descripción, OG image = imagen_principal).

---

## 🔍 SEO — Configuración Completa

Implementar en todas las páginas públicas:

### Metadata dinámica
- Usar `generateMetadata` de Next.js App Router en cada `page.tsx` de producto, guía y catálogo.
- Incluir: `title`, `description`, `openGraph` (con imagen), `twitter card`.
- Formato de título: `[Nombre Producto] | Gilded Glow Skin` o `[Título Guía] | The Glow Bible`.

### Schema.org (JSON-LD)
- En páginas de producto: schema tipo `Product` con nombre, descripción, precio, imagen y `offers`.
- En páginas de guía: schema tipo `Article` con headline, autor, fecha.
- Se inyecta como `<script type="application/ld+json">` en el `<head>` de cada página.

### URLs y Navegación
- Todas las URLs usan `slug` amigables (sin IDs numéricos).
- Canonical tags en todas las páginas.

### Archivos de sitio
- `app/sitemap.ts`: genera el sitemap automáticamente consultando Supabase para listar todos los slugs de productos y guías activos.
- `app/robots.ts`: permite indexación de páginas públicas, bloquea `/admin/*`.

---

## 🔐 Panel de Administración `/admin`

### Protección de ruta
- Middleware de Next.js (`middleware.ts`) que verifica la sesión de Supabase Auth en todas las rutas `/admin/*`.
- Si no hay sesión activa, redirige a `/auth/login`.
- La página de login es simple: email + contraseña, sin opción de registro (el admin se crea manualmente en Supabase).

### Dashboard `/admin`
- Cards de resumen: total de productos activos, total de guías, productos sin guía asociada, productos con stock bajo (≤ 5 unidades).
- Links rápidos a las secciones de gestión.

### Gestión de Productos `/admin/productos`

**Vista lista:**
- Tabla con columnas: imagen thumbnail, nombre, categoría, precio, stock, activo (toggle), orden, acciones (editar / eliminar).
- **Drag & Drop** para reordenar (actualiza el campo `orden` en Supabase). Usar `@dnd-kit/core` y `@dnd-kit/sortable`.
- Botón "Nuevo Producto" en el tope.

**Formulario de creación/edición:**
- Campos: nombre, slug (auto-generado desde el nombre, editable), categoría (select), descripción corta (textarea con contador de caracteres, máx 120), descripción larga (textarea), precio, precio tachado (opcional), tags (input de multi-tag), activo (checkbox), destacado (checkbox), orden (número).
- **Subida de imágenes:** 
  - Campo de imagen principal con preview inmediato.
  - Campo de imágenes extra (múltiple), con preview en grid y opción de eliminar cada una.
  - Las imágenes se suben a **Supabase Storage** en el bucket `productos`. El campo `imagen_principal` e `imagenes_extra` guardan la URL pública.
- Campo stock con input numérico.
- Selector de guía asociada (dropdown que lista todas las guías disponibles).
- Validación con `zod`: nombre requerido, precio > 0, slug único, etc.
- Botones: "Guardar" y "Cancelar".

### Gestión de Guías `/admin/guias`

**Vista lista:** tabla con título, producto asociado, fecha de actualización, acciones.

**Formulario de creación/edición:**
- Selector de producto asociado (obligatorio).
- Slug (auto-generado desde el título, editable).
- Título y subtítulo.
- **Para quién es:** textarea.
- **Ingredientes:** editor dinámico de lista — botón "Agregar ingrediente" que agrega una fila con 3 campos: nombre, descripción, beneficio. Los ítems son reordenables y eliminables.
- **Pasos de uso:** igual al anterior, con campos: número (auto), título del paso, descripción.
- **Beneficios:** input de lista simple, un beneficio por línea o tags.
- **Tips:** textarea.
- **Contenido Rico:** editor Tiptap con barra de herramientas (negrita, cursiva, títulos, listas, links, imágenes).
- **Imagen banner:** upload con preview, guardada en Supabase Storage bucket `guias`.

### Gestión de Categorías `/admin/categorias`
- Lista simple con nombre, slug y orden.
- CRUD completo. Las categorías disponibles son: Sérums, Hidratantes / Cremas, Limpiadores, Mascarilla Hidrogel. Se pueden agregar más desde aquí.

### Gestión de FAQs `/admin/faqs`
- Lista de preguntas con drag & drop para reordenar.
- CRUD: agregar, editar y eliminar preguntas/respuestas.
- Toggle para activar/desactivar cada FAQ sin borrarla.

### Configuración General `/admin/configuracion`
- Campos editables que afectan a toda la web:
  - Texto del banner de envíos (campo `banner_envios_texto`).
  - Items de la "Banda de Beneficios" (Trust Bar): lista de hasta 4 ítems con ícono y texto.
  - Número de WhatsApp (ya configurado pero editable).
  - Texto y URL del CTA del hero.
- Tabla en Supabase: `configuracion (clave TEXT PRIMARY KEY, valor TEXT)` con filas nombradas por clave.

### Gestión de Reseñas `/admin/reseñas` *(para el futuro)*
- Vista de reseñas pendientes de aprobación.
- Botones de aprobar / rechazar.
- La sección estará lista en el código aunque no haya reseñas todavía.

---

## 📱 Instrucciones Generales para el Agente

1. **Mobile First obligatorio.** Diseñar y codear primero para 375px de ancho. Escalar hacia tablet (768px) y desktop (1280px+). El skincare se compra desde el celular.

2. **Performance:** Usar `next/image` con `sizes` correctos y `priority` en las imágenes above-the-fold (hero). Lazy load en cards del catálogo.

3. **Server Components por defecto.** Solo usar `'use client'` donde haya estado local, eventos de usuario o animaciones con framer-motion.

4. **Generar `loading.tsx`** en las rutas de catálogo y guías con skeleton screens (no spinners genéricos).

5. **El link de WhatsApp siempre dinámico:**
   ```
   https://wa.me/5493329516376?text=Hola!%20Me%20interesa%20el%20producto%3A%20[nombre]%20-%20%24[precio]
   ```
   El nombre y precio del producto se encodean con `encodeURIComponent()`.

6. **Variables de entorno requeridas en `.env.local`:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=        # solo para operaciones admin server-side
   NEXT_PUBLIC_WHATSAPP_NUMBER=5493329516376
   NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/gildedglowskin
   ```

7. **Animaciones con framer-motion:**
   - Elementos del catálogo: aparecer con fade+slide-up al entrar al viewport (`whileInView`).
   - Hover en cards: escala suave en la imagen.
   - Apertura del menú mobile: slide desde la derecha.
   - Transición entre páginas: fade simple.

8. **Manejo de estados vacíos:** Si no hay productos en una categoría, mostrar un estado vacío elegante (no un error). Si no hay guías aún, mostrar la sección de preview del home con un mensaje de "Próximamente".

9. **Errores 404:** Crear `not-found.tsx` con diseño de marca para rutas de producto o guía no encontradas, con link de regreso al catálogo.

10. **Accesibilidad básica:** `alt` en todas las imágenes, `aria-label` en botones de ícono, contraste de color que cumpla WCAG AA, navegación por teclado funcional.
