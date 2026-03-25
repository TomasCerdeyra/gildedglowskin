export type Categoria = {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  orden: number;
  created_at: string;
};

export type Producto = {
  id: string;
  nombre: string;
  slug: string;
  descripcion_corta: string;
  descripcion_larga: string | null;
  precio: number;
  precio_tachado: number | null;
  imagen_principal: string;
  imagenes_extra: string[] | null;
  categoria_id: string | null;
  stock: number;
  activo: boolean;
  destacado: boolean;
  orden: number;
  guia_id: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  categorias?: Categoria;
};

export type Guia = {
  id: string;
  producto_id: string | null;
  slug: string;
  titulo: string;
  subtitulo: string | null;
  ingredientes: { nombre: string; descripcion: string; beneficio: string }[] | null;
  pasos_uso: { numero: number; titulo: string; descripcion: string }[] | null;
  beneficios: string[] | null;
  para_quien_es: string | null;
  tips: string | null;
  contenido_rico: string | null;
  imagen_banner: string | null;
  created_at: string;
  updated_at: string;
  productos?: Producto;
};

export type Resena = {
  id: string;
  producto_id: string;
  autor: string;
  tipo_piel: string | null;
  texto: string;
  estrellas: number;
  foto_url: string | null;
  activa: boolean;
  created_at: string;
};

export type Faq = {
  id: string;
  pregunta: string;
  respuesta: string;
  orden: number;
  activa: boolean;
};

export type Configuracion = {
  clave: string;
  valor: string;
};
