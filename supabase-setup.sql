-- ============================================================
-- GILDED GLOW SKIN — Setup SQL para Supabase
-- Ejecutar en: Dashboard → SQL Editor → New query
-- ============================================================

-- 1. TABLAS
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS categorias (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      text NOT NULL,
  slug        text NOT NULL UNIQUE,
  descripcion text,
  orden       int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS guias (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id     uuid,
  slug            text NOT NULL UNIQUE,
  titulo          text NOT NULL,
  subtitulo       text,
  ingredientes    jsonb,
  pasos_uso       jsonb,
  beneficios      text[],
  para_quien_es   text,
  tips            text,
  contenido_rico  text,
  imagen_banner   text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS productos (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre            text NOT NULL,
  slug              text NOT NULL UNIQUE,
  descripcion_corta text NOT NULL,
  descripcion_larga text,
  precio            numeric(10,2) NOT NULL,
  precio_tachado    numeric(10,2),
  imagen_principal  text NOT NULL DEFAULT '',
  imagenes_extra    text[],
  categoria_id      uuid REFERENCES categorias(id),
  stock             int NOT NULL DEFAULT 0,
  activo            boolean DEFAULT true,
  destacado         boolean DEFAULT false,
  orden             int DEFAULT 0,
  guia_id           uuid REFERENCES guias(id),
  tags              text[],
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

-- Agregar FK de guias → productos después de crear productos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'guias_producto_id_fkey'
  ) THEN
    ALTER TABLE guias
      ADD CONSTRAINT guias_producto_id_fkey
      FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS reseñas (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id uuid REFERENCES productos(id) ON DELETE CASCADE,
  autor       text NOT NULL,
  tipo_piel   text,
  texto       text NOT NULL,
  estrellas   int CHECK (estrellas BETWEEN 1 AND 5),
  foto_url    text,
  activa      boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faqs (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pregunta  text NOT NULL,
  respuesta text NOT NULL,
  orden     int DEFAULT 0,
  activa    boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS configuracion (
  clave  text PRIMARY KEY,
  valor  text
);


-- 2. ROW LEVEL SECURITY
-- ------------------------------------------------------------

ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE guias ENABLE ROW LEVEL SECURITY;
ALTER TABLE reseñas ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;

-- Lectura pública para todos
CREATE POLICY "public_select_categorias" ON categorias FOR SELECT USING (true);
CREATE POLICY "public_select_productos"  ON productos  FOR SELECT USING (true);
CREATE POLICY "public_select_guias"      ON guias      FOR SELECT USING (true);
CREATE POLICY "public_select_resenas"    ON reseñas    FOR SELECT USING (activa = true);
CREATE POLICY "public_select_faqs"       ON faqs       FOR SELECT USING (activa = true);
CREATE POLICY "public_select_config"     ON configuracion FOR SELECT USING (true);

-- Escritura solo para usuarios autenticados (admin)
CREATE POLICY "auth_all_categorias" ON categorias FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_productos"  ON productos  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_guias"      ON guias      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_resenas"    ON reseñas    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_faqs"       ON faqs       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_config"     ON configuracion FOR ALL USING (auth.role() = 'authenticated');


-- Grants para que el rol anon pueda leer las tablas públicas
GRANT SELECT ON categorias    TO anon;
GRANT SELECT ON productos     TO anon;
GRANT SELECT ON guias         TO anon;
GRANT SELECT ON faqs          TO anon;
GRANT SELECT ON configuracion TO anon;
GRANT SELECT ON reseñas       TO anon;

-- Grants para que el rol authenticated pueda hacer todo
GRANT ALL ON categorias    TO authenticated;
GRANT ALL ON productos     TO authenticated;
GRANT ALL ON guias         TO authenticated;
GRANT ALL ON faqs          TO authenticated;
GRANT ALL ON configuracion TO authenticated;
GRANT ALL ON reseñas       TO authenticated;


-- 3. STORAGE BUCKETS
-- ------------------------------------------------------------
-- Ir a Storage → Create bucket → "productos" (público)
-- Ir a Storage → Create bucket → "guias" (público)
-- O ejecutar esto si tenés permisos de API:

-- INSERT INTO storage.buckets (id, name, public) VALUES ('productos', 'productos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('guias', 'guias', true);


-- 4. DATOS INICIALES
-- ------------------------------------------------------------

INSERT INTO categorias (nombre, slug, orden) VALUES
  ('Sérums',             'serums',         1),
  ('Hidratantes',        'hidratantes',    2),
  ('Limpiadores',        'limpiadores',    3),
  ('Mascarilla Hidrogel','mascarilla-hidrogel', 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO faqs (pregunta, respuesta, orden) VALUES
  ('¿Los productos son aptos para piel sensible?',
   'Sí, nuestras fórmulas están pensadas para todo tipo de piel, incluyendo piel sensible.',
   1),
  ('¿Cómo hago un pedido?',
   'Los pedidos se realizan por WhatsApp al +54 3329 516376. Hacé click en cualquier botón "Pedir por WhatsApp".',
   2),
  ('¿Hacen envíos? ¿Cuál es el costo?',
   'Sí, realizamos envíos. Consultanos por WhatsApp para costos y disponibilidad según tu zona.',
   3),
  ('¿Cuánto tarda en llegar mi pedido?',
   'Los envíos locales se realizan en 24-48hs. Consultanos para info de tu zona.',
   4),
  ('¿Tienen política de devoluciones?',
   'Si hay algún problema con tu pedido, contactanos por WhatsApp y lo resolvemos. Tu satisfacción es nuestra prioridad.',
   5)
ON CONFLICT DO NOTHING;

INSERT INTO configuracion (clave, valor) VALUES
  ('banner_envios_texto', 'Realizamos envíos. Consultanos por WhatsApp para más información sobre costos y plazos.'),
  ('whatsapp_number', '5493329516376'),
  ('hero_cta_texto', 'Explorar Colección')
ON CONFLICT (clave) DO NOTHING;


-- 5. PRODUCTOS INICIALES (sin imágenes por ahora)
-- ------------------------------------------------------------
-- Primero obtenemos el id de las categorías para usarlo
-- Luego insertamos los productos manualmente desde el admin
-- o con este script (reemplazar categoria_id con el UUID real de tu BD):

INSERT INTO productos (nombre, slug, descripcion_corta, precio, stock, activo, imagen_principal)
VALUES
  ('Medicube PDRN Pink Vita Coating Mask - Mascarilla de Hidrogel',
   'medicube-pdrn-pink-vita-coating-mask',
   'Mascarilla de hidrogel con PDRN para una hidratación profunda y reparación cutánea.',
   12000, 20, true, ''),

  ('Medicube PDRN Pink Collagen Capsule Cream',
   'medicube-pdrn-pink-collagen-capsule-cream',
   'Crema de cápsulas con colágeno y PDRN para una piel más firme y luminosa.',
   15000, 20, true, ''),

  ('Medicube TXA + Niacinamide Capsule Cream',
   'medicube-txa-niacinamide-capsule-cream',
   'Crema de cápsulas con ácido tranexámico y niacinamida para unificar el tono.',
   15000, 20, true, ''),

  ('Celimax Retinal Shot Tightening Booster 15ml',
   'celimax-retinal-shot-tightening-booster',
   'Booster concentrado con retinal para tensar la piel y reducir signos de edad.',
   11000, 15, true, ''),

  ('Zero Pore One Day Cream - Medicube - 50ml',
   'medicube-zero-pore-one-day-cream',
   'Crema que minimiza los poros visiblemente en el día, textura ligera y no comedogénica.',
   13000, 15, true, ''),

  ('Medicube Triple Collagen Cream - 50ml',
   'medicube-triple-collagen-cream',
   'Crema con triple acción de colágeno para firmeza, elasticidad e hidratación intensa.',
   16000, 15, true, '')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
-- PASOS FINALES:
-- 1. Ejecutar este script completo en Supabase SQL Editor
-- 2. Crear los buckets "productos" y "guias" en Storage
-- 3. Crear el usuario admin en Authentication → Users → Invite user
-- 4. Agregar imágenes de los productos desde /admin/productos
-- ============================================================
