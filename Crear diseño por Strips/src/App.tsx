import BannerStrip from "./components/strips/BannerStrip";
import CaseStudyStrip from "./components/strips/CaseStudyStrip";
import ImagesStrip from "./components/strips/ImagesStrip";
import ServicesStrip from "./components/strips/ServicesStrip";
import LearningStrip from "./components/strips/LearningStrip";

// Data structure for easy integration with Strapi/Astro
const projectData = {
  banner: {
    projectName: "Nombre de proyecto",
    categories: [
      "Categoria de Proyecto 1",
      "Categoria de Proyecto 2",
      "Categoria de Proyecto 3"
    ],
    description: "Descripción de proyecto",
    bannerImageText: "Banner Imagen"
  },
  caseStudy: {
    title: "Titulo de articulo",
    content: "Articulo ó caso de estudio"
  },
  images: [
    "Imagen de articulo",
    "Imagen de articulo 2",
    "Imagen de articulo 3",
    "Imagen de articulo 3"
  ],
  services: {
    title: "Los servicios que ofrecimos:",
    list: [
      "Servicio 1",
      "Servicio 2",
      "Servicio 3",
      "Servicio 4",
      "Servicio 5"
    ]
  },
  learning: {
    title: "Nuestro aprendizaje",
    content: "Aprendizajes clave del proyecto"
  }
};

export default function App() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(202.06deg, rgb(0, 0, 0) 32.72%, rgba(0, 0, 0, 0.5) 42.552%, rgba(0, 0, 0, 0.5) 63.197%, rgb(0, 0, 0) 80.9%), linear-gradient(90deg, rgb(0, 0, 0) 0%, rgb(0, 0, 0) 100%)"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "center",
          width: "100%",
          position: "relative"
        }}
      >
        <BannerStrip
          projectName={projectData.banner.projectName}
          categories={projectData.banner.categories}
          description={projectData.banner.description}
          bannerImageText={projectData.banner.bannerImageText}
        />
        <CaseStudyStrip
          title={projectData.caseStudy.title}
          content={projectData.caseStudy.content}
        />
        <ImagesStrip images={projectData.images} />
        <ServicesStrip
          title={projectData.services.title}
          services={projectData.services.list}
        />
        <LearningStrip
          title={projectData.learning.title}
          content={projectData.learning.content}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "-0.5px",
            border: "1px solid #0d0d0d",
            pointerEvents: "none"
          }}
        />
      </div>
    </div>
  );
}
