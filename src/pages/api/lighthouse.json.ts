import type { APIRoute } from 'astro';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export const GET: APIRoute = async () => {
  try {
    const speedlifyApiPath = join(process.cwd(), 'src/components/modules/speedlify/_site/api');

    // Leer el archivo urls.json para obtener el mapeo
    const urlsPath = join(speedlifyApiPath, 'urls.json');
    if (!existsSync(urlsPath)) {
      return new Response(JSON.stringify({ error: 'Speedlify data not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const urlsData = JSON.parse(readFileSync(urlsPath, 'utf-8'));

    // Construir el objeto de datos de lighthouse con datos completos
    const lighthouseData: Record<string, any> = {};

    for (const [url, metadata] of Object.entries(urlsData)) {
      const hashFile = join(speedlifyApiPath, `${(metadata as any).hash}.json`);

      if (existsSync(hashFile)) {
        const pageData = JSON.parse(readFileSync(hashFile, 'utf-8'));

        // Formatear los scores de lighthouse (están en decimal 0-1, convertir a 0-100)
        lighthouseData[url] = {
          url: pageData.url,
          requestedUrl: pageData.requestedUrl,
          timestamp: pageData.timestamp,
          lighthouse: {
            performance: Math.round((pageData.lighthouse?.performance || 0) * 100),
            accessibility: Math.round((pageData.lighthouse?.accessibility || 0) * 100),
            bestPractices: Math.round((pageData.lighthouse?.bestPractices || 0) * 100),
            seo: Math.round((pageData.lighthouse?.seo || 0) * 100),
            firstContentfulPaint: pageData.firstContentfulPaint,
            largestContentfulPaint: pageData.largestContentfulPaint,
            cumulativeLayoutShift: pageData.cumulativeLayoutShift,
            speedIndex: pageData.speedIndex,
            totalBlockingTime: pageData.totalBlockingTime,
            timeToInteractive: pageData.timeToInteractive,
          },
          weight: pageData.weight,
          axe: pageData.axe
        };
      }
    }

    return new Response(JSON.stringify(lighthouseData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // Cache por 1 hora
      }
    });

  } catch (error) {
    console.error('Error reading Speedlify data:', error);
    return new Response(JSON.stringify({
      error: 'Failed to load Speedlify data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
