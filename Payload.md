# Guía Completa: Payload CMS + Astro + Vercel Blobs + i18n

## Introducción

Payload CMS es una excelente elección para tu caso. Su integración nativa con Vercel Blobs y soporte para i18n lo hace perfecto para tu proyecto de agencia multiidioma.

## Parte 1: Instalación y Configuración Inicial

### Requisitos Previos

- Node.js 18.20.0 o superior
- Cuenta de Vercel
- Cuenta de MongoDB Atlas (gratuita)
- Proyecto Astro existente

### Crear Proyecto Payload

Puedes integrar Payload de dos formas:

**Opción A: Proyecto separado (Recomendado para producción)**

```bash
# En una carpeta diferente
npx create-payload-app@latest my-payload-cms
cd my-payload-cms
```

Selecciona:
- Template: **blank**
- Database: **MongoDB**
- Package manager: **npm** (o tu preferencia)

**Opción B: Monorepo (Avanzado)**

Mantén Payload y Astro en el mismo repositorio usando workspaces.

### Instalar Dependencias Esenciales

```bash
npm install @payloadcms/plugin-cloud-storage
npm install @payloadcms/storage-vercel-blob
npm install @payloadcms/plugin-seo
npm install @payloadcms/richtext-lexical
```

## Parte 2: Configuración de MongoDB Atlas

### Crear Base de Datos Gratuita

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta y un cluster gratuito (M0)
3. Configura acceso de red: **Allow Access from Anywhere** (0.0.0.0/0)
4. Crea un usuario de base de datos
5. Obtén tu connection string

### Variables de Entorno

Crea `.env` en tu proyecto Payload:

```env
# MongoDB
DATABASE_URI=mongodb+srv://usuario:password@cluster.mongodb.net/payload-db?retryWrites=true&w=majority

# Payload
PAYLOAD_SECRET=tu-secreto-super-seguro-aqui
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# Vercel Blobs
BLOB_READ_WRITE_TOKEN=tu-vercel-blob-token

# Opcional: Para envío de emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-password
```

**Obtener Vercel Blob Token**:
1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Storage → Blob
3. Copia el token `BLOB_READ_WRITE_TOKEN`

## Parte 3: Configuración de Payload con i18n

### Configuración Principal

Edita `payload.config.ts`:

```typescript
import { buildConfig } from 'payload/config';
import path from 'path';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { cloudStorage } from '@payloadcms/plugin-cloud-storage';
import { seoPlugin } from '@payloadcms/plugin-seo';

// Importa tus colecciones
import { Users } from './collections/Users';
import { Posts } from './collections/Posts';
import { Projects } from './collections/Projects';
import { Media } from './collections/Media';
import { Categories } from './collections/Categories';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- Agencia Marketing CMS',
      favicon: '/favicon.ico',
    },
    css: path.resolve(__dirname, './custom.css'), // Opcional: estilos personalizados
  },
  
  editor: lexicalEditor({}),
  
  // Configuración i18n
  localization: {
    locales: [
      {
        label: 'Español',
        code: 'es',
      },
      {
        label: 'English',
        code: 'en',
      },
      {
        label: 'Français',
        code: 'fr',
      },
    ],
    defaultLocale: 'es',
    fallback: true, // Si no hay traducción, usa el idioma por defecto
  },
  
  collections: [
    Users,
    Posts,
    Projects,
    Media,
    Categories,
  ],
  
  globals: [
    {
      slug: 'settings',
      label: 'Configuración del Sitio',
      fields: [
        {
          name: 'siteName',
          type: 'text',
          label: 'Nombre del Sitio',
          required: true,
          localized: true,
        },
        {
          name: 'siteDescription',
          type: 'textarea',
          label: 'Descripción del Sitio',
          localized: true,
        },
        {
          name: 'logo',
          type: 'upload',
          label: 'Logo',
          relationTo: 'media',
        },
        {
          name: 'socialMedia',
          type: 'group',
          label: 'Redes Sociales',
          fields: [
            {
              name: 'facebook',
              type: 'text',
              label: 'Facebook URL',
            },
            {
              name: 'twitter',
              type: 'text',
              label: 'Twitter/X URL',
            },
            {
              name: 'instagram',
              type: 'text',
              label: 'Instagram URL',
            },
            {
              name: 'linkedin',
              type: 'text',
              label: 'LinkedIn URL',
            },
          ],
        },
      ],
    },
  ],
  
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  
  db: mongooseAdapter({
    url: process.env.DATABASE_URI!,
  }),
  
  plugins: [
    // Vercel Blob Storage para media
    cloudStorage({
      collections: {
        media: {
          adapter: vercelBlobStorage({
            token: process.env.BLOB_READ_WRITE_TOKEN!,
            addRandomSuffix: true, // Evita conflictos de nombres
          }),
        },
      },
    }),
    
    // SEO plugin
    seoPlugin({
      collections: ['posts', 'projects'],
      generateTitle: ({ doc }) => `${doc.title} | Tu Agencia`,
      generateDescription: ({ doc }) => doc.excerpt || doc.description,
    }),
  ],
});
```

## Parte 4: Colecciones con i18n

### Colección de Media (con Vercel Blobs)

Crea `src/collections/Media.ts`:

```typescript
import { CollectionConfig } from 'payload/types';

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  access: {
    read: () => true, // Público
  },
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 512,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texto Alternativo',
      required: true,
      localized: true, // Traducible
    },
    {
      name: 'caption',
      type: 'textarea',
      label: 'Descripción',
      localized: true,
    },
  ],
};
```

### Colección de Posts (Blog multiidioma)

Crea `src/collections/Posts.ts`:

```typescript
import { CollectionConfig } from 'payload/types';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Post',
    plural: 'Posts',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'category', 'status', 'publishedDate'],
    group: 'Contenido',
  },
  access: {
    read: ({ req: { user } }) => {
      // Público solo posts publicados, admin ve todo
      if (user) return true;
      return {
        status: {
          equals: 'published',
        },
      };
    },
  },
  versions: {
    drafts: true, // Borradores automáticos
    maxPerDoc: 50,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      required: true,
      localized: true, // Traducible
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      // Auto-genera slug desde title
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            }
            return value;
          },
        ],
      },
    },
    {
      name: 'author',
      type: 'relationship',
      label: 'Autor',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      label: 'Fecha de Publicación',
      required: true,
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'category',
      type: 'relationship',
      label: 'Categoría',
      relationTo: 'categories',
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      label: 'Tags',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      label: 'Imagen Destacada',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Resumen',
      required: true,
      maxLength: 200,
      localized: true,
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Contenido',
      required: true,
      localized: true, // Contenido traducible
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          // Aquí puedes agregar features personalizados
        ],
      }),
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: '¿Destacar en portada?',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Estado',
      required: true,
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
      options: [
        {
          label: 'Borrador',
          value: 'draft',
        },
        {
          label: 'Publicado',
          value: 'published',
        },
        {
          label: 'Archivado',
          value: 'archived',
        },
      ],
    },
    {
      name: 'readingTime',
      type: 'number',
      label: 'Tiempo de Lectura (minutos)',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      // Auto-calcula tiempo de lectura
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (data?.content) {
              const text = JSON.stringify(data.content);
              const words = text.split(/\s+/).length;
              return Math.ceil(words / 200); // 200 palabras por minuto
            }
            return 5;
          },
        ],
      },
    },
  ],
  timestamps: true,
};
```

### Colección de Proyectos (para portafolio)

Crea `src/collections/Projects.ts`:

```typescript
import { CollectionConfig } from 'payload/types';

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Proyecto',
    plural: 'Proyectos',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'category', 'featured', 'completedDate'],
    group: 'Contenido',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título del Proyecto',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            }
            return value;
          },
        ],
      },
    },
    {
      name: 'client',
      type: 'text',
      label: 'Cliente',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      label: 'Categoría',
      required: true,
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'Branding', value: 'branding' },
        { label: 'Web Design', value: 'web-design' },
        { label: 'Marketing Digital', value: 'marketing-digital' },
        { label: 'Social Media', value: 'social-media' },
        { label: 'SEO', value: 'seo' },
        { label: 'Content Marketing', value: 'content-marketing' },
      ],
    },
    {
      name: 'services',
      type: 'select',
      label: 'Servicios Aplicados',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'Diseño de Logo', value: 'logo' },
        { label: 'Identidad Corporativa', value: 'identity' },
        { label: 'Desarrollo Web', value: 'web-dev' },
        { label: 'SEO', value: 'seo' },
        { label: 'Redes Sociales', value: 'social' },
        { label: 'Fotografía', value: 'photography' },
        { label: 'Video Marketing', value: 'video' },
      ],
    },
    {
      name: 'completedDate',
      type: 'date',
      label: 'Fecha de Finalización',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: '¿Mostrar en Portada?',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'mainImage',
      type: 'upload',
      label: 'Imagen Principal',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Galería de Imágenes',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Descripción del Proyecto',
      required: true,
      localized: true,
    },
    {
      name: 'challenge',
      type: 'richText',
      label: 'Desafío',
      localized: true,
    },
    {
      name: 'solution',
      type: 'richText',
      label: 'Solución',
      localized: true,
    },
    {
      name: 'results',
      type: 'group',
      label: 'Resultados',
      fields: [
        {
          name: 'metrics',
          type: 'array',
          label: 'Métricas',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Etiqueta',
              required: true,
              localized: true,
            },
            {
              name: 'value',
              type: 'text',
              label: 'Valor',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'testimonial',
      type: 'group',
      label: 'Testimonio del Cliente',
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          label: 'Cita',
          localized: true,
        },
        {
          name: 'author',
          type: 'text',
          label: 'Autor',
        },
        {
          name: 'position',
          type: 'text',
          label: 'Cargo',
          localized: true,
        },
      ],
    },
    {
      name: 'url',
      type: 'text',
      label: 'URL del Proyecto',
      admin: {
        placeholder: 'https://ejemplo.com',
      },
    },
  ],
  timestamps: true,
};
```

### Colección de Categorías

Crea `src/collections/Categories.ts`:

```typescript
import { CollectionConfig } from 'payload/types';

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Categoría',
    plural: 'Categorías',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Configuración',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nombre',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            }
            return value;
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
      localized: true,
    },
  ],
};
```

### Colección de Usuarios

Crea `src/collections/Users.ts`:

```typescript
import { CollectionConfig } from 'payload/types';

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Usuario',
    plural: 'Usuarios',
  },
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nombre',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Rol',
      required: true,
      defaultValue: 'editor',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'Cliente',
          value: 'client',
        },
      ],
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      label: 'Avatar',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Biografía',
    },
  ],
};
```

## Parte 5: Integración con Astro

### Setup del Cliente Payload en Astro

Instala el cliente en tu proyecto Astro:

```bash
npm install payload
```

Crea `src/lib/payload.ts`:

```typescript
import type { Payload } from 'payload';

let cached: Payload | null = null;

export async function getPayload(): Promise<Payload> {
  if (cached) {
    return cached;
  }

  const payload = await import('payload').then((m) => m.default);
  
  await payload.init({
    secret: import.meta.env.PAYLOAD_SECRET,
    mongoURL: import.meta.env.DATABASE_URI,
    local: true,
  });

  cached = payload;
  return payload;
}

// Función helper para obtener posts
export async function getPosts(locale: string = 'es') {
  const payload = await getPayload();
  
  const posts = await payload.find({
    collection: 'posts',
    locale,
    where: {
      status: {
        equals: 'published',
      },
    },
    sort: '-publishedDate',
    limit: 100,
  });

  return posts.docs;
}

// Función helper para obtener proyectos
export async function getProjects(locale: string = 'es') {
  const payload = await getPayload();
  
  const projects = await payload.find({
    collection: 'projects',
    locale,
    sort: '-completedDate',
    limit: 100,
  });

  return projects.docs;
}

// Función helper para obtener configuración
export async function getSettings(locale: string = 'es') {
  const payload = await getPayload();
  
  const settings = await payload.findGlobal({
    slug: 'settings',
    locale,
  });

  return settings;
}
```

### Configuración de i18n en Astro

Actualiza `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'fr'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  output: 'hybrid', // Para SSR cuando sea necesario
});
```

### Estructura de Páginas con i18n

```
src/pages/
├── index.astro                    (español por defecto)
├── blog/
│   ├── index.astro
│   └── [slug].astro
├── proyectos/
│   ├── index.astro
│   └── [slug].astro
├── en/
│   ├── index.astro
│   ├── blog/
│   │   ├── index.astro
│   │   └── [slug].astro
│   └── projects/
│       ├── index.astro
│       └── [slug].astro
└── fr/
    ├── index.astro
    ├── blog/
    │   ├── index.astro
    │   └── [slug].astro
    └── projets/
        ├── index.astro
        └── [slug].astro
```

### Página de Blog (Español)

Crea `src/pages/blog/index.astro`:

```astro
---
import { getPosts } from '../../lib/payload';

const posts = await getPosts('es');
---

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog | Tu Agencia</title>
</head>
<body>
  <main>
    <h1>Blog</h1>
    
    <div class="posts-grid">
      {posts.map((post) => (
        <article class="post-card">
          <a href={`/blog/${post.slug}`}>
            {post.featuredImage && typeof post.featuredImage === 'object' && (
              <img 
                src={post.featuredImage.url} 
                alt={post.featuredImage.alt}
                loading="lazy"
              />
            )}
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <div class="meta">
              <time datetime={post.publishedDate}>
                {new Date(post.publishedDate).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span>{post.readingTime} min de lectura</span>
            </div>
          </a>
        </article>
      ))}
    </div>
  </main>
</body>
</html>

<style>
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
    padding: 2rem;
  }
  
  .post-card {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: transform 0.3s;
  }
  
  .post-card:hover {
    transform: translateY(-4px);
  }
  
  .post-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .post-card h2 {
    padding: 1rem;
    margin: 0;
  }
  
  .post-card p {
    padding: 0 1rem;
    color: #666;
  }
  
  .meta {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    color: #999;
  }
</style>
```

### Página Individual de Post

Crea `src/pages/blog/[slug].astro`:

```astro
---
import { getPayload } from '../../lib/payload';

export async function getStaticPaths() {
  const payload = await getPayload();
  
  const posts = await payload.find({
    collection: 'posts',
    locale: 'all', // Obtiene todos los idiomas
    where: {
      status: {
        equals: 'published',
      },
    },
  });

  // Genera rutas para todos los idiomas
  const paths = posts.docs.flatMap((post) => [
    { params: { slug: post.slug }, props: { post, locale: 'es' } },
    { params: { slug: `en/blog/${post.slug}` }, props: { post, locale: 'en' } },
    { params: { slug: `fr/blog/${post.slug}` }, props: { post, locale: 'fr' } },
  ]);

  return paths;
}

const { post, locale } = Astro.props;
const payload = await getPayload();

// Obtiene el post en el idioma correcto
const localizedPost = await payload.findByID({
  collection: 'posts',
  id: post.id,
  locale,
});

// Obtiene el autor
const author = typeof localizedPost.author === 'object' 
  ? localizedPost.author 
  : await payload.findByID({
      collection: 'users',
      id: localizedPost.author,
    });
---

<!DOCTYPE html>
<html lang={locale}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{localizedPost.title} | Blog</title>
  <meta name="description" content={localizedPost.excerpt}>
</head>
<body>
  <article class="post">
    {localizedPost.featuredImage && typeof localizedPost.featuredImage === 'object' && (
      <img 
        src={localizedPost.featuredImage.url} 
        alt={localizedPost.featuredImage.alt}
        class="featured-image"
      />
    )}
    
    <header>
      <h1>{localizedPost.title}</h1>
      
      <div class="meta">
        <div class="author">
          {author.avatar && typeof author.avatar === 'object' && (
            <img src={author.avatar.url} alt={author.name} />
          )}
          <span>Por {author.name}</span>
        </div>
        
        <time datetime={localizedPost.publishedDate}>
          {new Date(localizedPost.publishedDate).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
        
        <span>{localizedPost.readingTime} min de lectura</span>
      </div>
    </header>
    
    <div class="content">
      <!-- Renderiza el contenido de Lexical -->
      {/* Necesitarás un componente para renderizar Lexical JSON */}
      <div set:html={renderLexicalContent(localizedPost.content)} />
    </div>
    
    {localizedPost.tags && localizedPost.tags.length > 0 && (
      <footer>
        <div class="tags">
          {localizedPost.tags.map((tag) => (
            <span class="tag">{typeof tag === 'object' ? tag.name : tag}</span>
          ))}
        </div>
      </footer>
    )}
  </article>
</body>
</html>

<style>
  .post {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .featured-image {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 2rem;
  }
  
  header h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .meta {
    display: flex;
    gap: 2rem;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid #eee;
    margin-bottom: 2rem;
  }
  
  .author {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .author img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  
  .content {
    line-height: 1.8;
    font-size: 1.125rem;
  }
  
  .tags {
    display: flex;
    gap: 0.5rem;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #eee;
  }
  
  .tag {
    background: #f0f0f0;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.875rem;
  }
</style>
```

### Renderizar Contenido de Lexical

Crea `src/utils/renderLexical.ts`:

```typescript
export function renderLexicalContent(content: any): string {
  if (!content || !content.root) return '';
  
  const renderNode = (node: any): string => {
    if (!node) return '';
    
    switch (node.type) {
      case 'paragraph':
        return `<p>${node.children?.map(renderNode).join('') || ''}</p>`;
      
      case 'heading':
        const level = node.tag || 'h2';
        return `<${level}>${node.children?.map(renderNode).join('') || ''}</${level}>`;
      
      case 'text':
        let text = node.text || '';
        
        if (node.format) {
          if (node.format & 1) text = `<strong>${text}</strong>`;
          if (node.format & 2) text = `<em>${text}</em>`;
          if (node.format & 4) text = `<u>${text}</u>`;
          if (node.format & 8) text = `<code>${text}</code>`;
        }
        
        return text;
      
      case 'link':
        return `<a href="${node.url}" ${node.newTab ? 'target="_blank" rel="noopener"' : ''}>${node.children?.map(renderNode).join('') || ''}</a>`;
      
      case 'list':
        const listTag = node.listType === 'number' ? 'ol' : 'ul';
        return `<${listTag}>${node.children?.map(renderNode).join('') || ''}</${listTag}>`;
      
      case 'listitem':
        return `<li>${node.children?.map(renderNode).join('') || ''}</li>`;
      
      case 'quote':
        return `<blockquote>${node.children?.map(renderNode).join('') || ''}</blockquote>`;
      
      default:
        return node.children?.map(renderNode).join('') || '';
    }
  };
  
  return content.root.children?.map(renderNode).join('') || '';
}
```

Actualiza el import en `[slug].astro`:

```astro
---
import { renderLexicalContent } from '../../utils/renderLexical';
// ... resto del código
---
```

### Componente de Selector de Idioma

Crea `src/components/LanguageSwitcher.astro`:

```astro
---
interface Props {
  currentLocale: string;
  currentPath: string;
}

const { currentLocale, currentPath } = Astro.props;

const locales = {
  es: { label: 'Español', flag: '🇪🇸' },
  en: { label: 'English', flag: '🇺🇸' },
  fr: { label: 'Français', flag: '🇫🇷' },
};

function getLocalizedPath(locale: string) {
  if (locale === 'es') {
    return currentPath.replace(/^\/(en|fr)/, '');
  }
  
  const basePath = currentPath.replace(/^\/(en|fr)/, '');
  return `/${locale}${basePath}`;
}
---

<div class="language-switcher">
  {Object.entries(locales).map(([code, { label, flag }]) => (
    <a 
      href={getLocalizedPath(code)}
      class:list={['lang-link', { active: currentLocale === code }]}
      aria-label={`Switch to ${label}`}
    >
      <span class="flag">{flag}</span>
      <span class="label">{label}</span>
    </a>
  ))}
</div>

<style>
  .language-switcher {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  
  .lang-link {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    text-decoration: none;
    color: #666;
    transition: all 0.2s;
  }
  
  .lang-link:hover {
    background: #f0f0f0;
  }
  
  .lang-link.active {
    background: #007bff;
    color: white;
  }
  
  .flag {
    font-size: 1.25rem;
  }
  
  .label {
    font-size: 0.875rem;
  }
  
  @media (max-width: 640px) {
    .label {
      display: none;
    }
  }
</style>
```

## Parte 6: Deployment en Vercel

### Preparar Payload para Producción

Crea `vercel.json` en tu proyecto Payload:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

Actualiza `package.json` en Payload:

```json
{
  "scripts": {
    "dev": "cross-env PAYLOAD_CONFIG_PATH=src/payload.config.ts nodemon",
    "build": "cross-env PAYLOAD_CONFIG_PATH=src/payload.config.ts payload build",
    "serve": "cross-env PAYLOAD_CONFIG_PATH=src/payload.config.ts payload serve",
    "build:vercel": "npm run build && npm run serve"
  }
}
```

### Variables de Entorno en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega:

```
DATABASE_URI=mongodb+srv://...
PAYLOAD_SECRET=tu-secret-super-seguro
PAYLOAD_PUBLIC_SERVER_URL=https://tu-payload-cms.vercel.app
BLOB_READ_WRITE_TOKEN=vercel_blob_token
```

### Deploy Payload CMS

```bash
# En tu carpeta de Payload
vercel
```

Guarda la URL de producción (ej: `https://tu-payload-cms.vercel.app`)

### Actualizar Astro para usar Payload en Producción

Actualiza `src/lib/payload.ts`:

```typescript
// Opción 1: Usar API REST de Payload
export async function getPostsFromAPI(locale: string = 'es') {
  const response = await fetch(
    `${import.meta.env.PAYLOAD_API_URL}/api/posts?locale=${locale}&where[status][equals]=published&sort=-publishedDate`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  
  const data = await response.json();
  return data.docs;
}

export async function getProjectsFromAPI(locale: string = 'es') {
  const response = await fetch(
    `${import.meta.env.PAYLOAD_API_URL}/api/projects?locale=${locale}&sort=-completedDate`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  
  const data = await response.json();
  return data.docs;
}

export async function getPostBySlug(slug: string, locale: string = 'es') {
  const response = await fetch(
    `${import.meta.env.PAYLOAD_API_URL}/api/posts?where[slug][equals]=${slug}&locale=${locale}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  
  const data = await response.json();
  return data.docs[0];
}
```

Actualiza `.env` en Astro:

```env
PAYLOAD_API_URL=https://tu-payload-cms.vercel.app
```

### Deploy Astro

```bash
# En tu proyecto Astro
vercel
```

## Parte 7: Optimizaciones y Best Practices

### Caché de Datos

Crea `src/lib/cache.ts`:

```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = cache.get(key);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const data = await fetcher();
  cache.set(key, { data, timestamp: Date.now() });
  
  return data;
}

export function clearCache(key?: string) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}
```

Úsalo en tus páginas:

```astro
---
import { getCached } from '../../lib/cache';
import { getPostsFromAPI } from '../../lib/payload';

const posts = await getCached('posts-es', () => getPostsFromAPI('es'));
---
```

### Imágenes Optimizadas con Vercel Blobs

```astro
---
// Las imágenes ya vienen optimizadas de Vercel Blobs
// Puedes agregar transformaciones en la URL
const optimizedImage = `${post.featuredImage.url}?w=800&h=600&fit=cover&q=80`;
---

<img 
  src={optimizedImage}
  alt={post.featuredImage.alt}
  loading="lazy"
  decoding="async"
/>
```

### Sitemap Multiidioma

Crea `src/pages/sitemap.xml.ts`:

```typescript
import type { APIRoute } from 'astro';
import { getPostsFromAPI, getProjectsFromAPI } from '../lib/payload';

const SITE_URL = 'https://tudominio.com';
const LOCALES = ['es', 'en', 'fr'];

export const GET: APIRoute = async () => {
  const urls: string[] = [];
  
  // Páginas estáticas
  urls.push(`${SITE_URL}/`);
  urls.push(`${SITE_URL}/en`);
  urls.push(`${SITE_URL}/fr`);
  
  // Posts dinámicos
  for (const locale of LOCALES) {
    const posts = await getPostsFromAPI(locale);
    const basePath = locale === 'es' ? '/blog' : `/${locale}/blog`;
    
    posts.forEach(post => {
      urls.push(`${SITE_URL}${basePath}/${post.slug}`);
    });
  }
  
  // Proyectos dinámicos
  for (const locale of LOCALES) {
    const projects = await getProjectsFromAPI(locale);
    const basePath = locale === 'es' ? '/proyectos' : `/${locale}/${locale === 'fr' ? 'projets' : 'projects'}`;
    
    projects.forEach(project => {
      urls.push(`${SITE_URL}${basePath}/${project.slug}`);
    });
  }
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;
  
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
```

### Webhooks para Rebuild Automático

En Payload, crea `src/collections/hooks/revalidate.ts`:

```typescript
import { CollectionAfterChangeHook } from 'payload/types';

export const revalidateHook: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  if (operation === 'create' || operation === 'update') {
    try {
      // Trigger revalidation en Vercel
      await fetch(
        `https://api.vercel.com/v1/integrations/deploy/${process.env.VERCEL_DEPLOY_HOOK_ID}`,
        {
          method: 'POST',
        }
      );
      
      console.log('✅ Site revalidation triggered');
    } catch (error) {
      console.error('❌ Error triggering revalidation:', error);
    }
  }
  
  return doc;
};
```

Agrégalo a tus colecciones:

```typescript
// En Posts.ts
import { revalidateHook } from './hooks/revalidate';

export const Posts: CollectionConfig = {
  // ...
  hooks: {
    afterChange: [revalidateHook],
  },
};
```

Obtén el Deploy Hook ID:
1. Vercel Dashboard → Tu proyecto
2. Settings → Git → Deploy Hooks
3. Crea un nuevo hook
4. Copia el ID y agrégalo a las env vars de Payload

## Conclusión

¡Ahora tienes un CMS completamente funcional con Payload + Astro + Vercel Blobs + i18n!

**Tu cliente puede**:
- Acceder a `https://tu-payload-cms.vercel.app/admin`
- Crear posts y proyectos en múltiples idiomas
- Subir imágenes que se almacenan en Vercel Blobs
- Ver cambios reflejados automáticamente en el sitio

**Tú tienes**:
- Control total del código
- Hosting gratuito (hasta cierto límite)
- Integración perfecta con tu infraestructura existente
- Soporte i18n completo
- Type-safety con TypeScript

**Costos totales**:
- MongoDB Atlas: $0 (M0 cluster)
- Vercel (Payload): $0 (hobby plan)
- Vercel (Astro): $0 (hobby plan)
- Vercel Blobs: $0 (hasta 1GB de storage)

¡Todo gratis hasta que realmente crezcas!