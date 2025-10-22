import type { APIRoute } from 'astro';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export const GET: APIRoute = async () => {
  try {
    // En producción, usar datos en vivo desde Netlify
    // En desarrollo, intentar usar archivos locales primero
    const isDev = import.meta.env.DEV;
    const SPEEDLIFY_NETLIFY_URL = import.meta.env.SPEEDLIFY_URL || 'https://voluble-lokum-f26e16.netlify.app';

    let urlsData: any;
    let lighthouseData: Record<string, any> = {};

    if (isDev) {
      // Intentar leer archivos locales en desarrollo
      try {
        const speedlifyApiPath = join(process.cwd(), 'src/components/modules/speedlify/_site/api');
        const urlsPath = join(speedlifyApiPath, 'urls.json');

        if (existsSync(urlsPath)) {
          urlsData = JSON.parse(readFileSync(urlsPath, 'utf-8'));

          // Construir datos desde archivos locales
          for (const [url, metadata] of Object.entries(urlsData)) {
            const hashFile = join(speedlifyApiPath, `${(metadata as any).hash}.json`);

            if (existsSync(hashFile)) {
              const pageData = JSON.parse(readFileSync(hashFile, 'utf-8'));

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

          // Si tenemos datos locales, retornarlos
          if (Object.keys(lighthouseData).length > 0) {
            return new Response(JSON.stringify(lighthouseData, null, 2), {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=3600'
              }
            });
          }
        }
      } catch (localError) {
        console.log('Local files not available, falling back to live data');
      }
    }

    // Fallback a datos en vivo (producción o si fallan archivos locales)
    const response = await fetch(`${SPEEDLIFY_NETLIFY_URL}/api/urls.json`, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Speedlify API responded with status: ${response.status}`);
    }

    urlsData = await response.json();

    // Fetch datos individuales desde Netlify
    for (const [url, metadata] of Object.entries(urlsData)) {
      const hash = (metadata as any).hash;

      try {
        const hashResponse = await fetch(
          `${SPEEDLIFY_NETLIFY_URL}/api/${hash}.json`,
          { headers: { 'Accept': 'application/json' } }
        );

        if (hashResponse.ok) {
          const pageData = await hashResponse.json();

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
      } catch (err) {
        console.warn(`Failed to fetch data for ${hash}:`, err);
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
