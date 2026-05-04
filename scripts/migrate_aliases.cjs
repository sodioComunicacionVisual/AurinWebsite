const fs = require('fs');
const path = require('path');

const SRC = '/Users/leonel/Documents/AurinWebsite/src';
const EXTENSIONS = ['.astro', '.ts', '.tsx'];

function getFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(e =>
    e.isDirectory()
      ? getFiles(path.join(dir, e.name))
      : EXTENSIONS.includes(path.extname(e.name)) ? [path.join(dir, e.name)] : []
  );
}

const files = getFiles(SRC);
let totalReplaced = 0;
let filesChanged = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);

  let newContent = content;

  // 1. `import X from "../../..."` or `export X from "../../..."`
  newContent = newContent.replace(
    /(from\s+)(['"])(\.\.\/[^'"]+)(['"])/g,
    (match, prefix, q1, relPath, q2) => {
      const abs = path.resolve(dir, relPath);
      if (!abs.startsWith(SRC)) return match;
      const aliased = '@/' + path.relative(SRC, abs).replace(/\\\\/g, '/');
      const cleaned = aliased.replace(/\\.js$/, '');
      return `${prefix}${q1}${cleaned}${q2}`;
    }
  );

  // 2. `import("../../...")`
  newContent = newContent.replace(
    /(import\()(['"])(\.\.\/[^'"]+)(['"])\)/g,
    (match, prefix, q1, relPath, q2) => {
      const abs = path.resolve(dir, relPath);
      if (!abs.startsWith(SRC)) return match;
      const aliased = '@/' + path.relative(SRC, abs).replace(/\\\\/g, '/');
      const cleaned = aliased.replace(/\\.js$/, '');
      return `${prefix}${q1}${cleaned}${q2})`;
    }
  );

  // 3. `import "../../..."` (direct import)
  newContent = newContent.replace(
    /(^|\n)(import\s+)(['"])(\.\.\/[^'"]+)(['"])/g,
    (match, prefix1, prefix2, q1, relPath, q2) => {
      const abs = path.resolve(dir, relPath);
      if (!abs.startsWith(SRC)) return match;
      const aliased = '@/' + path.relative(SRC, abs).replace(/\\\\/g, '/');
      const cleaned = aliased.replace(/\\.js$/, '');
      return `${prefix1}${prefix2}${q1}${cleaned}${q2}`;
    }
  );

  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`✅ Updated: ${path.relative(SRC, file)}`);
    filesChanged++;
  }
}

console.log(`\nDone: ${filesChanged} files changed.`);
