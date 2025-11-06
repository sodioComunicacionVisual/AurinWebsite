// Mock responses for the chatbot
export const mockResponses: Record<string, string> = {
  "desarrollo web":
    "Ofrecemos desarrollo web moderno con React, Next.js y las últimas tecnologías. Creamos sitios web rápidos, accesibles y optimizados para SEO. Nuestro equipo se especializa en crear experiencias digitales excepcionales.",
  "aplicaciones móviles":
    "Desarrollamos aplicaciones móviles nativas y multiplataforma con React Native y Flutter. Desde la conceptualización hasta el lanzamiento en las tiendas, te acompañamos en todo el proceso.",
  "pruebas de usabilidad":
    "Realizamos pruebas exhaustivas de usabilidad con usuarios reales para identificar puntos de fricción y oportunidades de mejora. Utilizamos metodologías probadas para optimizar la experiencia de usuario.",
  branding:
    "Creamos identidades de marca memorables y coherentes. Desde el diseño de logotipos hasta guías de estilo completas, desarrollamos la personalidad visual de tu marca.",
  "diseño ux/ui":
    "Diseñamos interfaces intuitivas y atractivas centradas en el usuario. Combinamos investigación, prototipado y testing para crear productos digitales que los usuarios aman usar.",
  consultoría:
    "Ofrecemos consultoría estratégica en transformación digital, arquitectura de software y optimización de procesos. Te ayudamos a tomar las mejores decisiones tecnológicas para tu negocio.",
  default:
    "¡Gracias por tu interés! Ofrecemos una amplia gama de servicios digitales incluyendo desarrollo web, aplicaciones móviles, diseño UX/UI, branding y consultoría. ¿En qué podemos ayudarte específicamente?",
}

export function getMockResponse(query: string): string {
  const normalizedQuery = query.toLowerCase()

  for (const [key, response] of Object.entries(mockResponses)) {
    if (normalizedQuery.includes(key)) {
      return response
    }
  }

  return mockResponses.default
}
