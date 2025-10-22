<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Guía Completa para Desplegar Speedlify en Netlify con Auditorías Manuales

## Introducción a Speedlify

Speedlify es una herramienta desarrollada por Zach Leatherman que utiliza Google Lighthouse para medir y monitorear el rendimiento de sitios web a lo largo del tiempo. Construida con Eleventy (11ty), permite mantener un registro histórico de las métricas de rendimiento, accesibilidad, SEO y mejores prácticas de tus sitios web.[^1][^2]

## Requisitos Previos

### Software Necesario

- **Node.js 12 o superior**: Verifica tu versión con `node -v`[^1]
- **npm**: Gestor de paquetes incluido con Node.js[^2]
- **Git**: Para control de versiones y despliegue[^2]


### Cuentas Requeridas

- Cuenta de GitHub (gratuita)[^2]
- Cuenta de Netlify (gratuita)[^2]
- Editor de código de tu preferencia


## Parte 1: Configuración del Proyecto desde Cero

### 1.1 Clonar e Importar el Repositorio

**Opción A: Importar directamente a tu GitHub**

1. Ve a GitHub Import: `https://github.com/new/import`
2. Ingresa la URL del repositorio original: `https://github.com/zachleat/speedlify/`
3. Dale un nombre a tu repositorio (ejemplo: `speedlify-aurin`)
4. Selecciona si será público o privado
5. Haz clic en "Begin import"[^2]

**Opción B: Clonar localmente**

```bash
# Clona el repositorio
git clone https://github.com/zachleat/speedlify.git speedlify-aurin

# Navega al directorio
cd speedlify-aurin

# Instala las dependencias
npm install
```


### 1.2 Configuración de URLs para aurin.mx

El corazón de Speedlify está en los archivos de configuración ubicados en `_data/sites/`. Cada archivo JavaScript en este directorio representa una categoría de sitios a auditar.[^1]

**Elimina los archivos de ejemplo:**

```bash
# Dentro de tu proyecto
rm _data/sites/*.js
```

**Crea tu archivo de configuración personalizado:**

Crea un archivo `_data/sites/aurin.js` con la siguiente estructura:

```javascript
module.exports = {
  // Nombre de la categoría (opcional, por defecto usa el nombre del archivo)
  name: "Aurin.mx",
  
  // Descripción de la categoría
  description: "Monitoreo de rendimiento para aurin.mx",
  
  // Opciones de configuración
  options: {
    // Frecuencia mínima entre mediciones en minutos
    // 60 * 23 = 1380 minutos (23 horas)
    // Esto previene mediciones duplicadas si se dispara el build antes de tiempo
    frequency: 60 * 23,
    
    // freshChrome determina cuándo reiniciar Chrome
    // "run" = reinicia Chrome entre cada ejecución completa (más rápido)
    // "site" = reinicia Chrome entre cada sitio (usa esto si todos los sitios comparten el mismo origen)
    freshChrome: "run",
    
    // Número de ejecuciones por URL (por defecto 3)
    // Más ejecuciones = resultados más confiables pero builds más largos
    runs: 3,
    
    // Opciones adicionales de Lighthouse que puedes configurar
    // lighthouseOptions: {
    //   onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    //   throttlingMethod: "simulate",
    //   screenEmulation: {
    //     mobile: false,
    //     width: 1350,
    //     height: 940,
    //     deviceScaleFactor: 1,
    //   }
    // }
  },
  
  // Lista de URLs a auditar
  urls: [
    "https://aurin.mx/",
    "https://aurin.mx/sobre-nosotros",
    "https://aurin.mx/servicios",
    "https://aurin.mx/contacto",
    "https://aurin.mx/blog",
    // Agrega más URLs según necesites
  ],
};
```


### 1.3 Personalización del package.json

Actualiza la información del proyecto en `package.json`:

```json
{
  "name": "speedlify-aurin",
  "version": "1.0.0",
  "description": "Monitoreo de rendimiento para aurin.mx",
  "scripts": {
    "start": "npx @11ty/eleventy --serve",
    "build": "npx @11ty/eleventy",
    "test-pages": "node run-tests.js",
    "test-pages-fast": "ELEVENTY_SPEEDLIFY_SAMPLE=1 node run-tests.js"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/TU_USUARIO/speedlify-aurin.git"
  },
  "author": "Tu Nombre",
  "license": "MIT"
}
```


### 1.4 Configuración del archivo netlify.toml

Speedlify incluye un archivo `netlify.toml` que configura el comportamiento del build en Netlify. Revisa y ajusta según tus necesidades:

```toml
[build]
  publish = "_site"
  command = "npm run build"

# Plugin para mantener el cache de datos entre builds
[[plugins]]
  package = "./plugins/keep-data-cache"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

# Configuración de headers para seguridad y cache
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "no-referrer-when-downgrade"
```


### 1.5 Entendiendo el Plugin de Cache

El plugin `plugins/keep-data-cache/` es crucial para Speedlify. Mantiene los datos históricos de las auditorías entre builds utilizando el cache de Netlify.[^1]

**Ubicación**: `plugins/keep-data-cache/index.js`

Este plugin:

- Guarda los resultados en `_data/results/` entre builds
- Previene la pérdida de datos históricos
- Reduce el tiempo de build al no reejecutar auditorías recientes que no han cumplido la frecuencia mínima[^1]


### 1.6 Prueba Local

Antes de desplegar, prueba localmente:

```bash
# Ejecuta las auditorías (este paso puede tardar varios minutos)
npm run test-pages

# Inicia el servidor de desarrollo
npm run start
```

Visita `http://localhost:8080` para ver tu instancia de Speedlify funcionando.[^2][^1]

**Nota importante**: Las mediciones completas solo se ejecutan durante el build time. En desarrollo local con `npm run start`, verás las categorías pero sin mediciones hasta que ejecutes `npm run test-pages`.[^2]

## Parte 2: Despliegue en Netlify

### 2.1 Preparar el Repositorio

Antes de desplegar, asegúrate de que tu código esté en GitHub:

```bash
# Agrega todos los cambios
git add .

# Commit de los cambios
git commit -m "Configuración inicial de Speedlify para aurin.mx"

# Push al repositorio remoto
git push origin main
```


### 2.2 Conectar con Netlify

1. Inicia sesión en Netlify: `https://app.netlify.com/`
2. Haz clic en **"Add new site"** → **"Import an existing project"**
3. Selecciona **"Deploy with GitHub"**
4. Autoriza a Netlify para acceder a tu cuenta de GitHub
5. Selecciona el repositorio `speedlify-aurin` de la lista[^3][^2]

### 2.3 Configuración del Build

Netlify debería detectar automáticamente la configuración del `netlify.toml`, pero verifica:

- **Branch to deploy**: `main` (o la rama que prefieras)
- **Build command**: `npm run build` (viene del package.json)
- **Publish directory**: `_site`
- **Node version**: Será detectada del netlify.toml (18)[^4][^3]


### 2.4 Variables de Entorno (Opcional)

Si necesitas configurar variables de entorno específicas:

1. Ve a **Site settings** → **Environment variables**
2. Agrega variables según necesites:
```
NODE_ENV=production
ELEVENTY_ENV=production
```


### 2.5 Iniciar el Primer Deploy

Haz clic en **"Deploy site"**. Netlify:

1. Clonará tu repositorio
2. Instalará las dependencias (`npm install`)
3. Ejecutará las auditorías (`npm run test-pages` se ejecuta automáticamente durante el build)
4. Generará el sitio estático con Eleventy
5. Publicará el sitio[^3][^2]

**El primer build tomará más tiempo** (5-15 minutos dependiendo del número de URLs) porque ejecutará todas las auditorías desde cero.[^2]

### 2.6 Verificar el Despliegue

Una vez completado:

1. Netlify te proporcionará una URL temporal (ej: `https://random-name-123456.netlify.app`)
2. Visita la URL para ver tu instancia de Speedlify
3. Verás las métricas de Lighthouse para cada URL configurada[^2]

### 2.7 Configurar Dominio Personalizado (Opcional)

Para usar un subdominio de aurin.mx:

1. Ve a **Site settings** → **Domain management**
2. Haz clic en **"Add custom domain"**
3. Ingresa tu subdominio (ej: `speedlify.aurin.mx`)
4. Configura los registros DNS según las instrucciones de Netlify
5. Netlify proveerá automáticamente un certificado SSL gratuito[^4]

## Parte 3: Configuración de Auditorías Manuales

Para despliegues manuales en cada actualización de aurin.mx, utilizaremos **Build Hooks** de Netlify, que son URLs únicas que puedes llamar para disparar un nuevo build y deploy.[^5]

### 3.1 Crear un Build Hook en Netlify

1. Ve a tu sitio en Netlify Dashboard
2. Navega a **Site settings** → **Build \& deploy** → **Continuous deployment**
3. Desplázate hasta la sección **Build hooks**
4. Haz clic en **"Add build hook"**[^5][^6]

**Configuración del Build Hook:**

- **Build hook name**: `Manual Audit - aurin.mx` (nombre descriptivo para tu referencia)
- **Branch to build**: `main` (o la rama que uses)
- Haz clic en **"Save"**[^5]

Netlify generará una URL única como:

```
https://api.netlify.com/build_hooks/[TU_ID_UNICO]
```

**¡IMPORTANTE!** Copia esta URL y guárdala en un lugar seguro. La necesitarás para disparar builds manuales.[^6][^5]

### 3.2 Parámetros Opcionales del Build Hook

Los Build Hooks aceptan parámetros URL opcionales para alterar el comportamiento:

```bash
# Build básico
curl -X POST -d {} https://api.netlify.com/build_hooks/[TU_ID]

# Build con cache limpio (útil si hay problemas)
curl -X POST -d {} "https://api.netlify.com/build_hooks/[TU_ID]?clear_cache=true"

# Build con título personalizado
curl -X POST -d {} "https://api.netlify.com/build_hooks/[TU_ID]?trigger_title=Audit%20post-deployment"

# Build desde una rama específica
curl -X POST -d {} "https://api.netlify.com/build_hooks/[TU_ID]?trigger_branch=staging"

# Combinación de parámetros
curl -X POST -d {} "https://api.netlify.com/build_hooks/[TU_ID]?clear_cache=true&trigger_title=Manual%20Audit%20aurin.mx"
```


### 3.3 Métodos para Disparar Auditorías Manuales

#### Método 1: Desde la Terminal (Recomendado para Desarrolladores)

Crea un script en tu proyecto principal de aurin.mx:

**Archivo: `scripts/trigger-speedlify.sh`**

```bash
#!/bin/bash

# URL del Build Hook (reemplaza con tu ID único)
BUILD_HOOK_URL="https://api.netlify.com/build_hooks/[TU_ID_UNICO]"

# Título personalizado para el deploy
TITLE="Manual Audit - $(date '+%Y-%m-%d %H:%M')"

# Disparar el build
echo "🚀 Disparando auditoría de Speedlify para aurin.mx..."
curl -X POST -d {} "${BUILD_HOOK_URL}?trigger_title=${TITLE}&clear_cache=false"

echo ""
echo "✅ Build disparado exitosamente"
echo "📊 Visita tu dashboard de Netlify para ver el progreso"
```

**Hacer el script ejecutable:**

```bash
chmod +x scripts/trigger-speedlify.sh
```

**Ejecutar después de cada deploy de aurin.mx:**

```bash
./scripts/trigger-speedlify.sh
```


#### Método 2: Desde Node.js (Integración en tu Pipeline)

Crea un script Node.js para integrar en tu proceso de despliegue:

**Archivo: `scripts/trigger-speedlify.js`**

```javascript
const https = require('https');

// Configuración
const BUILD_HOOK_ID = 'TU_ID_UNICO'; // Solo el ID, no la URL completa
const CLEAR_CACHE = false;
const CUSTOM_TITLE = `Manual Audit - ${new Date().toISOString()}`;

// Construir URL con parámetros
const params = new URLSearchParams({
  trigger_title: CUSTOM_TITLE,
  clear_cache: CLEAR_CACHE.toString()
});

const url = `https://api.netlify.com/build_hooks/${BUILD_HOOK_ID}?${params}`;

// Función para disparar el build
function triggerSpeedlifyAudit() {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Speedlify audit triggered successfully');
          console.log('📊 Build status:', data);
          resolve(data);
        } else {
          console.error('❌ Error triggering audit:', res.statusCode);
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Request failed:', error.message);
      reject(error);
    });
    
    // Enviar payload vacío
    req.write(JSON.stringify({}));
    req.end();
  });
}

// Ejecutar
console.log('🚀 Triggering Speedlify audit for aurin.mx...');
triggerSpeedlifyAudit()
  .then(() => {
    console.log('✨ Done! Check your Netlify dashboard for build progress');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Failed to trigger audit:', error.message);
    process.exit(1);
  });
```

**Agregar al package.json de aurin.mx:**

```json
{
  "scripts": {
    "deploy": "tus-comandos-deploy",
    "audit": "node scripts/trigger-speedlify.js",
    "deploy:full": "npm run deploy && npm run audit"
  }
}
```

**Ejecutar:**

```bash
# Solo auditoría
npm run audit

# Deploy completo con auditoría
npm run deploy:full
```


#### Método 3: Desde Postman o Herramientas REST

Para probar manualmente desde Postman o similar:

1. Crea una nueva request POST
2. URL: `https://api.netlify.com/build_hooks/[TU_ID]`
3. Body: Raw JSON → `{}`
4. Headers: `Content-Type: application/json`
5. Send[^5]

#### Método 4: Integración con tu CMS o Sistema de Deploy

Si usas un CMS o sistema de deploy personalizado:

```python
# Ejemplo en Python
import requests
from datetime import datetime

def trigger_speedlify_audit():
    """Dispara una auditoría de Speedlify después del deploy"""
    
    build_hook_url = "https://api.netlify.com/build_hooks/TU_ID_UNICO"
    
    params = {
        "trigger_title": f"Post-deploy Audit - {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        "clear_cache": "false"
    }
    
    try:
        response = requests.post(build_hook_url, params=params, json={})
        
        if response.status_code == 200:
            print("✅ Speedlify audit triggered successfully")
            return True
        else:
            print(f"❌ Failed to trigger audit: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"💥 Error: {str(e)}")
        return False

# Llamar después del deploy exitoso de aurin.mx
if deploy_successful:
    trigger_speedlify_audit()
```


### 3.4 Crear un Alias/Comando Rápido

Para facilitar el disparo manual, crea un alias en tu terminal:

**Bash/Zsh (~/.bashrc o ~/.zshrc):**

```bash
# Alias para disparar auditoría de Speedlify
alias audit-aurin='curl -X POST -d {} "https://api.netlify.com/build_hooks/[TU_ID]?trigger_title=Manual%20Audit"'
```

**Recargar configuración:**

```bash
source ~/.bashrc  # o source ~/.zshrc
```

**Usar:**

```bash
audit-aurin
```


### 3.5 Configurar Notificaciones de Build

Para recibir notificaciones cuando se complete la auditoría:

1. Ve a **Site settings** → **Build \& deploy** → **Deploy notifications**
2. Haz clic en **"Add notification"**
3. Selecciona el tipo:
    - **Email**: Envía email cuando el deploy se completa
    - **Slack**: Notificaciones en Slack
    - **Webhook**: POST a tu propio endpoint
4. Configura según tu preferencia[^4]

### 3.6 Desactivar Builds Automáticos (Importante para Auditorías Manuales)

Si quieres que SOLO se ejecuten builds cuando tú lo decidas manualmente:

1. Ve a **Site settings** → **Build \& deploy** → **Continuous deployment**
2. En **Build settings**, haz clic en **"Edit settings"**
3. Cambia **"Build mode"** a **"Stop builds"** o desactiva el branch deploy
4. Guarda los cambios[^7]

**Esto previene builds automáticos al hacer push al repositorio**, asegurando que solo se ejecuten auditorías cuando dispares el Build Hook manualmente.[^7]

### 3.7 Script de Deploy Completo para aurin.mx

Integra todo en un script maestro de deploy:

**Archivo: `deploy.sh` en el proyecto aurin.mx**

```bash
#!/bin/bash

set -e  # Detener en errores

echo "🚀 Iniciando proceso de deploy de aurin.mx..."

# 1. Build del proyecto
echo "📦 Building aurin.mx..."
npm run build

# 2. Deploy a producción (ajusta según tu método de deploy)
echo "🌐 Deploying to production..."
# Aquí van tus comandos de deploy específicos
# Ejemplo: rsync, ftp, git push, netlify deploy, etc.

# 3. Esperar a que el deploy se estabilice
echo "⏳ Waiting for deployment to stabilize..."
sleep 30

# 4. Disparar auditoría de Speedlify
echo "📊 Triggering Speedlify audit..."
BUILD_HOOK_URL="https://api.netlify.com/build_hooks/[TU_ID_UNICO]"
AUDIT_TITLE="Post-deployment Audit - $(date '+%Y-%m-%d %H:%M:%S')"

curl -X POST -d {} "${BUILD_HOOK_URL}?trigger_title=${AUDIT_TITLE}" \
  -H "Content-Type: application/json" \
  --silent --show-error

# 5. Confirmación
echo ""
echo "✅ Deploy completado exitosamente"
echo "📊 Auditoría de Speedlify en progreso"
echo "🔗 Revisa el progreso en: https://app.netlify.com/sites/TU_SITIO_SPEEDLIFY/deploys"
echo ""
```

**Ejecutar:**

```bash
chmod +x deploy.sh
./deploy.sh
```


## Parte 4: Optimización y Mejores Prácticas

### 4.1 Gestión de Tiempos de Build

Netlify Free tier tiene límites importantes a considerar:

- **Tiempo máximo por build**: 15 minutos
- **Minutos totales mensuales**: 300 minutos[^2]

**Cálculos aproximados para aurin.mx:**

```
Tiempo por URL: ~30-60 segundos (3 ejecuciones)
5 URLs = 2.5 - 5 minutos por build
10 URLs = 5 - 10 minutos por build
20 URLs = 10 - 20 minutos por build (puede exceder el límite)
```

**Recomendaciones:**

1. **Limita a 10-15 URLs máximo** para mantenerte dentro del límite de 15 minutos[^2]
2. **Prioriza páginas clave**: Homepage, páginas de conversión, páginas más visitadas
3. **Usa el parámetro `frequency`** en la configuración para evitar auditorías muy frecuentes[^1]

### 4.2 Optimizar la Configuración de Lighthouse

Ajusta las opciones de Lighthouse en tu `_data/sites/aurin.js`:

```javascript
module.exports = {
  name: "Aurin.mx",
  description: "Monitoreo optimizado de rendimiento",
  options: {
    frequency: 60 * 23, // Una vez al día máximo
    
    // Configuración optimizada de Lighthouse
    runs: 3, // 3 es un buen balance entre precisión y velocidad
    
    // Opciones avanzadas de Lighthouse
    lighthouseOptions: {
      // Solo categorías esenciales (omite PWA si no aplica)
      onlyCategories: [
        "performance",
        "accessibility",
        "best-practices",
        "seo"
      ],
      
      // Throttling simulado es más rápido que el aplicado
      throttlingMethod: "simulate",
      
      // Desktop testing (más rápido que mobile)
      screenEmulation: {
        mobile: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
        disabled: false
      },
      
      // Timeout más corto para evitar builds colgados
      maxWaitForLoad: 45000, // 45 segundos
      
      // Deshabilitar extensiones que no necesites
      disableStorageReset: false,
      
      // Skipear audits específicos que no necesites
      // skipAudits: ['uses-http2', 'canonical']
    }
  },
  urls: [
    "https://aurin.mx/",
    "https://aurin.mx/sobre-nosotros",
    "https://aurin.mx/servicios",
    // ...
  ],
};
```


### 4.3 Monitoreo Separado por Tipo de Página

Crea múltiples categorías para organizar mejor:

**_data/sites/aurin-critical.js** (páginas críticas, auditorías más frecuentes):

```javascript
module.exports = {
  name: "Aurin - Páginas Críticas",
  description: "Homepage y páginas de conversión",
  options: {
    frequency: 60 * 12, // Cada 12 horas
    runs: 5, // Más ejecuciones para mayor precisión
  },
  urls: [
    "https://aurin.mx/",
    "https://aurin.mx/contacto",
  ],
};
```

**_data/sites/aurin-content.js** (contenido, auditorías menos frecuentes):

```javascript
module.exports = {
  name: "Aurin - Contenido",
  description: "Blog y páginas de contenido",
  options: {
    frequency: 60 * 48, // Cada 2 días
    runs: 3,
  },
  urls: [
    "https://aurin.mx/blog",
    "https://aurin.mx/blog/articulo-1",
    "https://aurin.mx/blog/articulo-2",
  ],
};
```


### 4.4 Backup de Datos Históricos

Aunque Netlify mantiene un cache, es buena práctica descargar backups periódicos:

**Script de backup automático:**

```javascript
// scripts/backup-speedlify-data.js
const fs = require('fs');
const https = require('https');
const path = require('path');

const SITE_URL = 'https://TU-SPEEDLIFY-SITE.netlify.app';
const BACKUP_DIR = './speedlify-backups';

// Crear directorio de backup si no existe
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Descargar results.zip
const timestamp = new Date().toISOString().split('T')[^0];
const filename = path.join(BACKUP_DIR, `speedlify-backup-${timestamp}.zip`);

const file = fs.createWriteStream(filename);

https.get(`${SITE_URL}/results.zip`, (response) => {
  response.pipe(file);
  
  file.on('finish', () => {
    file.close();
    console.log(`✅ Backup guardado: ${filename}`);
  });
}).on('error', (err) => {
  fs.unlink(filename);
  console.error('❌ Error descargando backup:', err.message);
});
```

Speedlify automáticamente guarda los datos en `/results.zip` en cada build.[^1]

### 4.5 Visualización Avanzada de Resultados

#### Mostrar Scores en el Footer de aurin.mx

Speedlify genera una API automática que puedes consumir:

```
https://TU-SPEEDLIFY-SITE.netlify.app/api/urls.json
```

**Ejemplo de integración en aurin.mx:**

```javascript
// En tu sitio aurin.mx
async function displayLighthouseScores() {
  try {
    const response = await fetch('https://TU-SPEEDLIFY-SITE.netlify.app/api/urls.json');
    const data = await response.json();
    
    // Filtrar por tu homepage
    const homepage = data.find(item => item.url === 'https://aurin.mx/');
    
    if (homepage && homepage.lighthouse) {
      const scores = homepage.lighthouse;
      
      // Mostrar en el footer
      document.getElementById('perf-score').textContent = scores.performance;
      document.getElementById('a11y-score').textContent = scores.accessibility;
      document.getElementById('seo-score').textContent = scores.seo;
    }
  } catch (error) {
    console.error('Error fetching Lighthouse scores:', error);
  }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', displayLighthouseScores);
```

**HTML en el footer:**

```html
<footer>
  <div class="lighthouse-scores">
    <span>Performance: <strong id="perf-score">--</strong></span>
    <span>Accessibility: <strong id="a11y-score">--</strong></span>
    <span>SEO: <strong id="seo-score">--</strong></span>
  </div>
</footer>
```


### 4.6 Alertas Personalizadas por Degradación de Performance

Crea un script que verifique si los scores han bajado:

```javascript
// scripts/check-performance-degradation.js
const https = require('https');

const SPEEDLIFY_API = 'https://TU-SPEEDLIFY-SITE.netlify.app/api/urls.json';
const PERFORMANCE_THRESHOLD = 90;
const ACCESSIBILITY_THRESHOLD = 95;

function fetchScores() {
  return new Promise((resolve, reject) => {
    https.get(SPEEDLIFY_API, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function checkPerformance() {
  try {
    const urls = await fetchScores();
    
    const alerts = [];
    
    urls.forEach(item => {
      if (item.lighthouse) {
        const { performance, accessibility } = item.lighthouse;
        
        if (performance < PERFORMANCE_THRESHOLD) {
          alerts.push(`⚠️  ${item.url}: Performance bajo (${performance})`);
        }
        
        if (accessibility < ACCESSIBILITY_THRESHOLD) {
          alerts.push(`⚠️  ${item.url}: Accessibility bajo (${accessibility})`);
        }
      }
    });
    
    if (alerts.length > 0) {
      console.log('🚨 ALERTAS DE PERFORMANCE:');
      alerts.forEach(alert => console.log(alert));
      
      // Aquí puedes integrar con Slack, email, etc.
      // sendSlackAlert(alerts.join('\n'));
      
      process.exit(1); // Exit code 1 para CI/CD
    } else {
      console.log('✅ Todos los scores están dentro del umbral');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkPerformance();
```

Integra esto en tu pipeline de CI/CD después del deploy.[^8]

### 4.7 Configuración de Cache para Speedlify

El cache es fundamental para mantener datos históricos. Netlify lo maneja automáticamente mediante el plugin, pero puedes optimizarlo:

**plugins/keep-data-cache/index.js** (ya incluido en Speedlify):

Este plugin:

- Guarda `_data/results/` en el cache de Netlify
- Restaura datos previos en cada build
- Respeta la configuración de `frequency` para evitar auditorías innecesarias[^9][^1]

**Para limpiar el cache manualmente:**

1. En Netlify Dashboard: **Site settings** → **Build \& deploy** → **Clear cache and retry deploy**
2. O usa el parámetro en el Build Hook: `?clear_cache=true`[^10][^5]

### 4.8 Configuración de Seguridad

Protege tu instancia de Speedlify si contiene datos sensibles:

**Opción 1: Password Protection en Netlify**

1. Ve a **Site settings** → **Access control**
2. Activa **Password Protection**
3. Establece una contraseña
4. Solo usuarios con la contraseña podrán ver el sitio[^4]

**Opción 2: Configurar Netlify Identity (más avanzado)**

Para control de acceso granular con usuarios.[^4]

### 4.9 Mantenimiento y Limpieza

**Script de limpieza de datos antiguos:**

```javascript
// scripts/cleanup-old-data.js
const fs = require('fs');
const path = require('path');

const RESULTS_DIR = './_data/results';
const DAYS_TO_KEEP = 90; // Mantener últimos 90 días

function cleanupOldData() {
  if (!fs.existsSync(RESULTS_DIR)) {
    console.log('No hay datos para limpiar');
    return;
  }
  
  const now = Date.now();
  const cutoffDate = now - (DAYS_TO_KEEP * 24 * 60 * 60 * 1000);
  
  const files = fs.readdirSync(RESULTS_DIR);
  let deletedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(RESULTS_DIR, file);
    const stats = fs.statSync(filePath);
    
    if (stats.mtimeMs < cutoffDate) {
      fs.unlinkSync(filePath);
      deletedCount++;
      console.log(`🗑️  Eliminado: ${file}`);
    }
  });
  
  console.log(`✅ Limpieza completada: ${deletedCount} archivos eliminados`);
}

cleanupOldData();
```


## Parte 5: Troubleshooting y Solución de Problemas

### 5.1 Build Timeout (Excede 15 minutos)

**Problema**: El build se cancela por timeout.[^8]

**Soluciones**:

1. **Reduce el número de URLs** a auditar
2. **Reduce las ejecuciones** de `runs: 5` a `runs: 3` o incluso `runs: 1`
3. **Usa `lighthouseOptions`** para deshabilitar auditorías innecesarias
4. **Considera actualizar a un plan de pago** de Netlify para límites mayores[^8]

### 5.2 Build Falla con Error de Chrome

**Problema**: Chrome no puede iniciar en el entorno de Netlify.

**Soluciones**:

1. Verifica que usas Node.js 12+ en `netlify.toml`
2. Asegúrate de que el plugin `keep-data-cache` está habilitado
3. Intenta con `freshChrome: "site"` en vez de `"run"`[^1]

### 5.3 Datos Históricos se Pierden

**Problema**: Después de un build, los datos históricos desaparecen.

**Soluciones**:

1. **Verifica que el plugin está activado** en `netlify.toml`:

```toml
[[plugins]]
  package = "./plugins/keep-data-cache"
```

2. **Descarga un backup** del `/results.zip` antes de hacer cambios importantes
3. **No borres** `.gitignore` entries para `_data/results/` si decides hacer commit[^10][^1]

### 5.4 Build Hook No Dispara Build

**Problema**: Al llamar al Build Hook, no sucede nada.

**Soluciones**:

1. **Verifica la URL** completa del Build Hook en Settings
2. **Asegúrate de usar POST**, no GET:

```bash
curl -X POST -d {} URL  # Correcto
curl URL  # Incorrecto
```

3. **Revisa el branch** especificado en el Build Hook
4. **Verifica que Builds no estén pausados** en Settings[^7][^5]

### 5.5 Scores Inconsistentes o Muy Bajos

**Problema**: Lighthouse reporta scores muy diferentes o bajos inesperadamente.

**Soluciones**:

1. **Aumenta el número de `runs`** para promediar mejor (ej: `runs: 5`)
2. **Verifica que aurin.mx esté accesible** públicamente (sin password protection)
3. **Revisa el `throttlingMethod`**: `"simulate"` es más consistente que `"provided"`
4. **Considera factores externos**: CDN cache, problemas de DNS temporales[^11]

### 5.6 Build Se Salta Auditorías (Skip)

**Problema**: Speedlify no ejecuta auditorías en algunos builds.

**Esto es normal** y por diseño. Speedlify respeta el parámetro `frequency` en tu configuración. Si haces builds muy seguidos, saltará auditorías para URLs que fueron auditadas recientemente.[^1][^2]

**Para forzar auditorías**:

1. Usa `?clear_cache=true` en el Build Hook
2. O reduce `frequency` temporalmente en la configuración

### 5.7 Errores de Memoria

**Problema**: Build falla con `JavaScript heap out of memory`.

**Soluciones**:

1. **Reduce URLs simultáneas**
2. **Agrega variable de entorno** en Netlify:

```
NODE_OPTIONS=--max-old-space-size=4096
```

3. **Separa categorías** en múltiples archivos más pequeños[^8]

## Parte 6: Flujo de Trabajo Recomendado

### Workflow Completo para Deploys de aurin.mx

```
1. Desarrollo local de aurin.mx
   ↓
2. Testing local
   ↓
3. Commit y push a repositorio
   ↓
4. Deploy de aurin.mx a producción
   ↓
5. Esperar 30-60 segundos para estabilización
   ↓
6. Ejecutar script de trigger de Speedlify:
   ./scripts/trigger-speedlify.sh
   ↓
7. Speedlify ejecuta auditorías (5-10 min)
   ↓
8. Revisar resultados en dashboard de Speedlify
   ↓
9. (Opcional) Verificar alertas de degradación
   ↓
10. (Opcional) Descargar backup de datos
```


### Checklist Pre-Deploy

Antes de cada deploy de aurin.mx:

- [ ] Verificar que Speedlify esté funcionando
- [ ] Confirmar que hay minutos de build disponibles en Netlify (free tier: 300/mes)
- [ ] Revisar últimos scores para tener baseline
- [ ] Preparar script de trigger manual


### Checklist Post-Deploy

Después de cada deploy de aurin.mx:

- [ ] Esperar estabilización del sitio (30-60 seg)
- [ ] Disparar Build Hook de Speedlify
- [ ] Monitorear progreso del build en Netlify Dashboard
- [ ] Revisar nuevos scores una vez completado
- [ ] Documentar cambios significativos en performance
- [ ] (Semanal) Descargar backup de `/results.zip`


## Conclusión

Has configurado exitosamente un sistema robusto de monitoreo de performance para aurin.mx utilizando Speedlify y Netlify con auditorías manuales. Este setup te permite:

- ✅ Ejecutar auditorías Lighthouse completas solo cuando lo necesites
- ✅ Mantener un historial completo de métricas de performance
- ✅ Integrar auditorías en tu workflow de deploy
- ✅ Monitorear múltiples páginas de aurin.mx simultáneamente
- ✅ Recibir datos accionables sobre performance, accesibilidad y SEO

Recuerda que Speedlify es una herramienta de monitoreo, no de optimización. Úsala para identificar problemas y medir el impacto de tus optimizaciones a lo largo del tiempo.[^6][^1][^2]
<span style="display:none">[^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^24][^25][^26][^27][^28][^29][^30][^31][^32][^33][^34][^35][^36][^37][^38][^39][^40][^41][^42][^43][^44][^45][^46][^47][^48][^49][^50][^51][^52][^53][^54][^55][^56][^57][^58][^59][^60][^61][^62][^63][^64][^65][^66][^67][^68][^69][^70][^71][^72][^73][^74][^75][^76][^77][^78][^79][^80][^81][^82][^83][^84]</span>

<div align="center">⁂</div>

[^1]: http://arxiv.org/pdf/2110.08588.pdf

[^2]: https://agustinusnathaniel.com/blog/monitor-and-measure-site-performance-with-speedlify/

[^3]: https://docs.netlify.com/deploy/create-deploys/

[^4]: https://docs.netlify.com/deploy/deploy-overview/

[^5]: https://docs.netlify.com/build/configure-builds/build-hooks/

[^6]: https://asmedigitalcollection.asme.org/GT/proceedings/GT2024/88063/V12BT30A018/1204681

[^7]: https://answers.netlify.com/t/build-publish-only-via-build-hook/19221

[^8]: https://answers.netlify.com/t/support-guide-how-can-i-optimize-my-netlify-build-time/3907

[^9]: https://docs.netlify.com/build/caching/caching-overview/

[^10]: https://answers.netlify.com/t/speeding-up-build-times-by-caching-assets/23467

[^11]: https://calendar.perfplanet.com/2023/ten-optimisation-tips-for-an-initial-web-performance-audit/

[^12]: https://arxiv.org/pdf/2210.01073.pdf

[^13]: https://arxiv.org/html/2503.12626

[^14]: https://arxiv.org/pdf/1712.06139.pdf

[^15]: https://arxiv.org/pdf/2309.14821.pdf

[^16]: https://res.mdpi.com/d_attachment/information/information-11-00363/article_deploy/information-11-00363.pdf

[^17]: http://arxiv.org/pdf/2010.04671.pdf

[^18]: http://arxiv.org/pdf/2401.10834.pdf

[^19]: https://www.youtube.com/watch?v=VWdRNLaNDQ8

[^20]: https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/

[^21]: https://www.youtube.com/watch?v=0P53S34zm44

[^22]: https://docs.netapp.com/us-en/ontap/nas-audit/create-auditing-config-task.html

[^23]: https://github.com/Superfiliate/speedlify

[^24]: https://developers.netlify.com/videos/five-ways-to-deploy-a-new-netlify-site/

[^25]: https://github.com/thepirat000/Audit.NET

[^26]: https://github.com/chringel21/speedlify

[^27]: https://www.netlify.com/blog/introducing-improved-team-audit-log/

[^28]: https://www.mapledesign.co.uk/tech-blog/speedlify-on-ubuntu/

[^29]: https://speedlify-tests.netlify.app

[^30]: https://docs.netlify.com/manage/accounts-and-billing/team-management/team-audit-log/

[^31]: https://speedlify.aaron-gustafson.com/apps/

[^32]: https://jamesbateson.co.uk/articles/speedlify/

[^33]: https://techdocs.broadcom.com/us/en/fibre-channel-networking/fabric-os/fabric-os-administration/9-2-x/Perform-Advance-Configuration-Tasks-Admin1/v26748051.html

[^34]: https://github.com/ThewApp/speedlify-actions

[^35]: https://scrimba.com/deploying-with-netlify-c013

[^36]: https://arxiv.org/pdf/2007.12737.pdf

[^37]: http://arxiv.org/pdf/1203.2704.pdf

[^38]: https://arxiv.org/pdf/1404.6605.pdf

[^39]: https://arxiv.org/html/2412.10133v1

[^40]: https://arxiv.org/pdf/2501.03440.pdf

[^41]: https://answers.netlify.com/t/how-to-know-if-the-deployment-was-triggered-manually-from-netlify-site/64422

[^42]: https://jamesbateson.co.uk/articles/scheduled-builds-using-netlify-build-hooks-and-github-actions/

[^43]: https://answers.netlify.com/t/automatically-trigger-a-build-when-a-build-fails/73137

[^44]: https://docs.netlify.com/build/functions/trigger-on-events/

[^45]: https://docs.uniform.app/docs/integrations/cdn/netlify/trigger-netlify-builds

[^46]: https://www.microtica.com/blog/deployment-production-best-practices

[^47]: https://answers.netlify.com/t/plugging-into-the-build-pipeline-with-manual-api-deploys/16793

[^48]: https://github.com/zachleat/speedlify

[^49]: https://dev.to/debs_obrien/netlify-hooks-a95

[^50]: https://flaviocopes.com/netlify-auto-deploy/

[^51]: https://www.reddit.com/r/aws/comments/131hinm/how_to_best_practice_productionlevel_cloud/

[^52]: https://answers.netlify.com/t/how-to-identify-manually-triggered-builds-in-custom-plugin/38050

[^53]: https://docs.netlify.com/deploy/manage-deploys/manage-deploys-overview/

[^54]: https://answers.netlify.com/t/return-deploy-id-for-build-hooks/120266

[^55]: https://chringel.dev/blog/2023/11/measure-your-websites-performance-with-speedlify/

[^56]: https://arc.aiaa.org/doi/10.2514/1.C034187

[^57]: https://dx.plos.org/10.1371/journal.pcbi.1013386

[^58]: https://www.semanticscholar.org/paper/d6bd7ac2c964f0a8397543c981e5a48c7d92b935

[^59]: http://jtd.amegroups.com/article/view/7391/6848

[^60]: https://www.journalijar.com/article/54515/optimizing-operating-room-setup-and-patient-positioning-in-robotic-gynecologic-surgery/

[^61]: https://www.semanticscholar.org/paper/c6f3d1530ad951fb6eff625d72edb0b4e4f8d313

[^62]: https://www.semanticscholar.org/paper/e740ffbc5d58f888e2bef52db1e4335d113ba935

[^63]: https://www.semanticscholar.org/paper/1c45669fa49ee4c7e192b9d9798d473c8ff80272

[^64]: https://bmjpaedsopen.bmj.com/lookup/doi/10.1136/bmjpo-2021-RCPCH.147

[^65]: http://arxiv.org/pdf/1710.07628.pdf

[^66]: http://arxiv.org/pdf/2406.09427.pdf

[^67]: http://arxiv.org/pdf/2410.20273.pdf

[^68]: https://arxiv.org/html/2404.04744v1

[^69]: http://arxiv.org/pdf/2501.15392.pdf

[^70]: http://arxiv.org/pdf/2205.15904.pdf

[^71]: https://arxiv.org/pdf/1710.03439.pdf

[^72]: https://arxiv.org/pdf/1801.02175.pdf

[^73]: https://support.speedify.com/article/235-speedify-interface

[^74]: https://speedify.com/blog/combining-internet-connections/fix-slow-bonding-speeds/

[^75]: https://kinsta.com/blog/eleventy/

[^76]: https://speedlify.thewdhanat.com

[^77]: https://www.11ty.dev/docs/deployment/

[^78]: https://www.11ty.dev/speedlify/11ty-recipes-lander/

[^79]: https://www.youtube.com/watch?v=oj8-6k4LSds

[^80]: https://www.freecodecamp.org/news/learn-eleventy/

[^81]: https://docs.netlify.com/build/caching/cache-api/

[^82]: https://dev.to/psypher1/learn-11ty-part-5-deploying-the-site-9ad

[^83]: https://stackoverflow.com/questions/43543521/cache-individual-files-between-netlify-deploys-to-speed-up-subsequent-builds

[^84]: https://dev.to/philw_/show-off-your-lighthouse-scores-in-eleventy-with-the-pagespeed-insights-api-1cpp

