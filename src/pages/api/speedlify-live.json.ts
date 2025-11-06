//Esta API se encarga de fetchear data desde https://voluble-lokum-f26e16.netlify.app para mostrarla en los stats del footer 
import type { APIRoute } from 'astro';

// Este endpoint consume los datos del despliegue en Netlify de Speedlify
export const GET: APIRoute = async () => {
  try {
    // URL de tu despliegue de Speedlify en Netlify
    const SPEEDLIFY_BASE_URL = import.meta.env.SPEEDLIFY_URL || 'https://voluble-lokum-f26e16.netlify.app';
    const SPEEDLIFY_NETLIFY_URL = `${SPEEDLIFY_BASE_URL}/api/urls.json`;

    const response = await fetch(SPEEDLIFY_NETLIFY_URL, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Speedlify API responded with status: ${response.status}`);
    }

    const urlsData = await response.json();

    // Construir el objeto de datos completos
    const lighthouseData: Record<string, any> = {};

    // Fetch individual data for each URL
    for (const [url, metadata] of Object.entries(urlsData)) {
      const hash = (metadata as any).hash;

      try {
        const hashResponse = await fetch(
          `${SPEEDLIFY_BASE_URL}/api/${hash}.json`,
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
    console.error('Error fetching live Speedlify data:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch live Speedlify data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
