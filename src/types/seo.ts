export interface PostalAddress {
  "@type": "PostalAddress";
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  streetAddress?: string;
  addressCountry?: string;
}

export interface ContactPoint {
  "@type": "ContactPoint";
  telephone?: string;
  email?: string;
  contactType?: string;
}

export interface OrganizationStructuredData {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  description?: string;
  foundingDate?: string;
  address?: PostalAddress;
  contactPoint?: ContactPoint | ContactPoint[];
  sameAs?: string[];
  areaServed?: string | string[];
  serviceType?: string | string[];
  knowsAbout?: string | string[];
}

export interface AboutPageStructuredData {
  "@context": "https://schema.org";
  "@type": "AboutPage";
  mainEntity: OrganizationStructuredData;
}

export interface ContactPageStructuredData {
  "@context": "https://schema.org";
  "@type": "ContactPage";
  mainEntity: OrganizationStructuredData;
}

export interface WebPageStructuredData {
  "@context": "https://schema.org";
  "@type": "WebPage";
  name: string;
  description: string;
  url: string;
  provider?: OrganizationStructuredData;
}

export interface LocalBusinessStructuredData extends OrganizationStructuredData {
  "@type": "LocalBusiness";
  image?: string;
  priceRange?: string;
}

export interface ServiceStructuredData {
  "@context": "https://schema.org";
  "@type": "Service";
  serviceType: string;
  provider: OrganizationStructuredData;
  areaServed?: string;
  hasOfferCatalog?: {
    "@type": "OfferCatalog";
    name: string;
    itemListElement: {
      "@type": "Offer";
      itemOffered: {
        "@type": "Service";
        name: string;
        description: string;
      };
    }[];
  };
}

export interface CollectionPageStructuredData {
  "@context": "https://schema.org";
  "@type": "CollectionPage";
  name: string;
  description: string;
  url: string;
  inLanguage: string;
  mainEntity: {
    "@type": "Organization";
    name: string;
    url: string;
    logo: string;
    hasOfferCatalog?: {
      "@type": "OfferCatalog";
      name: string;
      itemListElement: {
        "@type": "CreativeWork";
        name: string;
        description: string;
        creator: {
          "@type": "Organization";
          name: string;
        };
        keywords: string[];
      }[];
    };
  };
}

export type StructuredData = OrganizationStructuredData | AboutPageStructuredData | ContactPageStructuredData | WebPageStructuredData | LocalBusinessStructuredData | ServiceStructuredData | CollectionPageStructuredData;
