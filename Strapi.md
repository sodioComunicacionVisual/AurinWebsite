Sí, **Strapi es completamente compatible con Astro**. Strapi es un CMS headless de código abierto que se integra perfectamente con Astro para crear sitios web rápidos y basados en contenido con un backend flexible.[1][2]

## Configuración de Strapi

Para comenzar con la integración, primero necesitas configurar tu servidor Strapi:[2]

```bash
npx create-strapi-app my-project --quickstart
```

Una vez que Strapi esté funcionando, accede al panel de administración (normalmente en `http://localhost:1337/admin`) para crear tipos de contenido y configurar los permisos de la API.[1][2]

## Configuración de Astro

### Instalación del paquete de integración

Puedes instalar el paquete de integración oficial de Strapi para Astro:[1]

```bash
npm install @astrojs/strapi
```

### Variables de entorno

Crea un archivo `.env` en la raíz de tu proyecto y agrega la URL de tu API de Strapi:[2][1]

```
STRAPI_URL=http://localhost:1337
```

Si deseas IntelliSense para tus variables de entorno, crea un archivo `env.d.ts` en el directorio `src/` y configura `ImportMetaEnv`:[2]

```typescript
interface ImportMetaEnv {
  readonly STRAPI_URL: string;
}
```

## Conexión de Astro con Strapi

### Crear una función wrapper

Crea un archivo en `src/lib/strapi.ts` (o `strapi.js`) para interactuar con la API de Strapi:[3][1][2]

```javascript
const strapiUrl = import.meta.env.STRAPI_URL;

export async function fetchPosts() {
  const response = await fetch(`${strapiUrl}/api/posts?populate=*`);
  const { data } = await response.json();
  return data;
}
```

### Usar el contenido en componentes Astro

Obtén el contenido en tus páginas o componentes de Astro:[1][2]

```astro
---
import { fetchPosts } from '../lib/strapi';

const posts = await fetchPosts();
---

<ul>
  {posts.map((post) => (
    <li>{post.attributes.title}</li>
  ))}
</ul>
```

## Recursos adicionales

La documentación oficial de Astro incluye una guía completa para la integración con Strapi, y el sitio web de Strapi ofrece tutoriales detallados sobre cómo construir sitios web con Astro y Strapi. También existe un loader personalizado de Strapi para Astro disponible en GitHub que utiliza la Content Layer API de Astro.[4][5][6][3][2][1]

[1](https://strapi.io/integrations/astro)
[2](https://docs.astro.build/es/guides/cms/strapi/)
[3](https://docs.astro.build/ar/guides/cms/strapi/)
[4](https://strapi.io/blog/astro-and-strapi-website-tutorial-part-1-intro-to-astro)
[5](https://github.com/VirtusLab-Open-Source/astro-strapi-loader)
[6](https://strapi.io/blog/how-to-create-a-custom-astro-loader-for-strapi-using-content-layer-api)
[7](http://www.scielo.br/scielo.php?script=sci_arttext&pid=S1982-21702017000300520&lng=en&tlng=en)
[8](https://www.semanticscholar.org/paper/2da196535a1ec0c812e72d7d81aa31d457ffd85a)
[9](https://www.semanticscholar.org/paper/f336f6ff1e886616c5e6e88b7e78da797bc22bc6)
[10](https://www.appliedradiationoncology.com/doi/10.37549/ARO1178)
[11](https://aapm.onlinelibrary.wiley.com/doi/10.1118/1.2962888)
[12](https://arxiv.org/pdf/1610.03159.pdf)
[13](https://arxiv.org/pdf/2206.14220.pdf)
[14](https://arxiv.org/pdf/2212.00805.pdf)
[15](https://arxiv.org/pdf/2207.03087.pdf)
[16](https://joss.theoj.org/papers/10.21105/joss.03283.pdf)
[17](http://arxiv.org/pdf/2401.05576.pdf)
[18](https://www.scienceopen.com/document_file/48f65b2e-557e-40b2-8b2a-f75456e3b621/ScienceOpen/001_Ferro.pdf)
[19](https://arxiv.org/html/2312.08802v1)
[20](http://arxiv.org/pdf/1112.4139.pdf)
[21](https://arxiv.org/abs/1602.06681)
[22](https://arxiv.org/abs/2308.01957)
[23](http://arxiv.org/pdf/1808.04428.pdf)
[24](http://arxiv.org/abs/2503.23225)
[25](http://arxiv.org/pdf/2111.11268.pdf)
[26](http://arxiv.org/pdf/2406.01817.pdf)
[27](https://arxiv.org/pdf/2208.10447.pdf)
[28](https://strapi.io/blog/lightning-fast-building-with-strapi-and-astro)
[29](https://strapi.io/blog/what-is-astro)
[30](https://strapi.io/blog/strapi-integrations)
[31](https://translate.google.com/translate?u=https%3A%2F%2Fstrapi.io%2Fintegrations%2Fastro&hl=es&sl=en&tl=es&client=srp)
[32](https://www.reddit.com/r/astrojs/comments/1blqa2p/seeking_advice_on_integrating_astro_with_cms/)
[33](https://docs.strapi.io/cms/quick-start)
[34](https://workoholics.es/cultura/desarrollo-web-astro-strapi/)
[35](https://strapi.io/blog/astro-islands-architecture-explained-complete-guide)
[36](https://translate.google.com/translate?u=https%3A%2F%2Fneon.com%2Fguides%2Fstrapi-cms&hl=es&sl=en&tl=es&client=srp)
[37](https://strapi.io/video-library/get-started-with-strapi-3-minutes)
[38](https://www.reddit.com/r/astrojs/comments/1j86yzw/strapi_integration_loader/)
[39](https://strapi.io/blog/how-to-build-an-astrojs-image-gallery-app-with-strapi-5)
[40](https://www.reddit.com/r/astrojs/comments/1n6o0co/how_do_you_handle_i18n_with_astro_strapi_also_ssr/)
[41](https://tillitsdone.com/blogs/strapi---astrojs-integration-guide/)