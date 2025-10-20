/**
 * Strapi Integration Helper
 *
 * Este archivo proporciona funciones para conectar Astro con Strapi CMS.
 * Configuración según: https://docs.astro.build/es/guides/cms/strapi/
 */

const strapiUrl = import.meta.env.STRAPI_URL || 'http://localhost:1337';

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Fetch genérico para Strapi
 */
async function fetchStrapi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${strapiUrl}/api/${endpoint}`);

  if (!response.ok) {
    throw new Error(`Strapi fetch failed: ${response.statusText}`);
  }

  const { data } = await response.json() as StrapiResponse<T>;
  return data;
}

/**
 * Interface para Project Template desde Strapi
 */
export interface StrapiProjectData {
  id: number;
  attributes: {
    projectTitle: string;
    projectCategories: string[];
    projectDescription: string;
    bannerImage?: {
      data?: {
        attributes: {
          url: string;
          alternativeText?: string;
        };
      };
    };
    caseStudyTitle: string;
    caseStudyContent: string;
    images: Array<{
      src?: string;
      alt: string;
      placeholder?: string;
    }>;
    servicesTitle: string;
    services: Array<{
      name: string;
    }>;
    learningTitle: string;
    learningContent: string;
  };
}

/**
 * Obtener un proyecto específico por slug
 */
export async function fetchProjectBySlug(slug: string): Promise<StrapiProjectData> {
  return fetchStrapi<StrapiProjectData>(`projects?filters[slug][$eq]=${slug}&populate=*`);
}

/**
 * Obtener todos los proyectos
 */
export async function fetchAllProjects(): Promise<StrapiProjectData[]> {
  return fetchStrapi<StrapiProjectData[]>('projects?populate=*');
}

/**
 * Transformar datos de Strapi al formato esperado por el Template
 */
export function transformProjectData(strapiData: StrapiProjectData) {
  const attrs = strapiData.attributes;

  return {
    projectTitle: attrs.projectTitle,
    projectCategories: attrs.projectCategories || [],
    projectDescription: attrs.projectDescription,
    bannerImage: attrs.bannerImage?.data?.attributes.url
      ? `${strapiUrl}${attrs.bannerImage.data.attributes.url}`
      : undefined,
    caseStudyTitle: attrs.caseStudyTitle,
    caseStudyContent: attrs.caseStudyContent,
    images: attrs.images || [],
    servicesTitle: attrs.servicesTitle,
    services: attrs.services || [],
    learningTitle: attrs.learningTitle,
    learningContent: attrs.learningContent,
  };
}
