import type { APIRoute } from 'astro';

const PAGESPEED_API_KEY = import.meta.env.PAGESPEED_API_KEY;
const CACHE_DURATION = 3600; // 1 hour in seconds

interface PageSpeedMetric {
  id: string;
  score: number;
  displayValue?: string;
  numericValue?: number;
  numericUnit?: string;
}

interface PageSpeedResponse {
  lighthouseResult: {
    categories: {
      performance: { score: number };
      accessibility: { score: number };
      'best-practices': { score: number };
      seo: { score: number };
    };
    audits: {
      [key: string]: PageSpeedMetric;
    };
    fetchTime: string;
    requestedUrl: string;
    finalUrl: string;
  };
}

const urlsToTest = [
  'https://www.aurin.mx/',
  'https://www.aurin.mx/proyectos',
  'https://www.aurin.mx/nosotros',
  'https://www.aurin.mx/contacto',
];

export const GET: APIRoute = async () => {
  try {
    if (!PAGESPEED_API_KEY) {
      throw new Error('PAGESPEED_API_KEY environment variable is not set');
    }

    const lighthouseData: Record<string, any> = {};

    // Fetch data for all URLs in parallel
    const promises = urlsToTest.map(async (url) => {
      try {
        const apiUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
        apiUrl.searchParams.append('url', url);
        apiUrl.searchParams.append('key', PAGESPEED_API_KEY);
        apiUrl.searchParams.append('strategy', 'mobile');
        apiUrl.searchParams.append('category', 'PERFORMANCE');
        apiUrl.searchParams.append('category', 'ACCESSIBILITY');
        apiUrl.searchParams.append('category', 'BEST_PRACTICES');
        apiUrl.searchParams.append('category', 'SEO');

        const response = await fetch(apiUrl.toString());

        if (!response.ok) {
          throw new Error(`PageSpeed API responded with status: ${response.status}`);
        }

        const data: PageSpeedResponse = await response.json();
        const result = data.lighthouseResult;

        // Extract metrics
        const audits = result.audits;

        lighthouseData[url] = {
          url: result.finalUrl || result.requestedUrl,
          requestedUrl: result.requestedUrl,
          timestamp: new Date(result.fetchTime).getTime(),
          lighthouse: {
            performance: Math.round((result.categories.performance?.score || 0) * 100),
            accessibility: Math.round((result.categories.accessibility?.score || 0) * 100),
            bestPractices: Math.round((result.categories['best-practices']?.score || 0) * 100),
            seo: Math.round((result.categories.seo?.score || 0) * 100),
            firstContentfulPaint: audits['first-contentful-paint']?.numericValue || 0,
            largestContentfulPaint: audits['largest-contentful-paint']?.numericValue || 0,
            cumulativeLayoutShift: audits['cumulative-layout-shift']?.numericValue || 0,
            speedIndex: audits['speed-index']?.numericValue || 0,
            totalBlockingTime: audits['total-blocking-time']?.numericValue || 0,
            timeToInteractive: audits['interactive']?.numericValue || 0,
          },
        };
      } catch (err) {
        console.warn(`Failed to fetch PageSpeed data for ${url}:`, err);
      }
    });

    await Promise.all(promises);

    // If no data was fetched, return error
    if (Object.keys(lighthouseData).length === 0) {
      throw new Error('Failed to fetch data from PageSpeed API for any URL');
    }

    return new Response(JSON.stringify(lighthouseData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${CACHE_DURATION}`,
      },
    });
  } catch (error) {
    console.error('Error fetching PageSpeed data:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to load PageSpeed data',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
