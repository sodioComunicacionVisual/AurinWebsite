const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  "src/pages/projects.astro",
  "src/pages/index.astro",
  "src/pages/en/projects.astro",
  "src/pages/en/services.astro",
  "src/pages/en/contact.astro",
  "src/pages/en/index.astro",
  "src/pages/en/privacy.astro",
  "src/pages/en/terms.astro",
  "src/pages/en/about.astro",
  "src/pages/contact.astro",
  "src/pages/ejemplo-proyectos-variante.astro",
  "src/pages/services.astro",
  "src/pages/privacy.astro",
  "src/pages/about.astro",
  "src/pages/terms.astro",
  "src/blocks/shared/Template/Template.astro",
  "src/components/layout/Footer.astro"
];

for (const file of filesToUpdate) {
  const filePath = path.join("/Users/leonel/Documents/AurinWebsite", file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = content.replace(/StickyFooter\.astro/g, 'Footer.astro');
    content = content.replace(/<StickyFooter \/>/g, '<Footer />');
    content = content.replace(/import StickyFooter from/g, 'import Footer from');
    content = content.replace(/StickyFooter\.module\.css/g, 'Footer.module.css');
    content = content.replace(/StickyFooter component/g, 'Footer component');
    
    fs.writeFileSync(filePath, content);
  }
}
console.log('Update complete.');
