import { promises as fsp } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsDir = join(__dirname, '..', 'src', 'shadcn-svelte', 'docs', 'content', 'components');
const distDir = join(__dirname, '..', 'dist');
const manifestPath = join(__dirname, '..', 'component-props.json');
const rootPackageJsonPath = join(__dirname, '..', 'package.json');

const toKebabCase = (str) => str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');

const generateBadges = (packageName, version) => {
  return `[![NPM Version](https://img.shields.io/npm/v/${packageName}.svg)](https://www.npmjs.com/package/${packageName})
[![Package Size](https://img.badgesize.io/https://unpkg.com/${packageName}/index.js?compression=gzip)](https://www.npmjs.com/package/${packageName})
[![License](https://img.shields.io/npm/l/${packageName}.svg)](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)
`;
};

const parseFrontmatter = (content) => {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return {};
  const frontmatter = frontmatterMatch[1];
  const result = {};
  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':').map(s => s.trim());
    if (key && valueParts.length) {
      result[key] = valueParts.join(':').trim();
    }
  });
  return result;
};

const extractUsage = (content) => {
  const usageMatch = content.match(/## Usage\s*```(?:svelte)?\s*([\s\S]*?)\s*```/);
  return usageMatch ? usageMatch[1].trim() : '';
};

const transformToWebComponentUsage = (usage, componentName, packageName) => {
  if (!usage) return `<${packageName}></${packageName}>`;

  const kebabName = toKebabCase(componentName);
  let transformed = usage
    .replace(/import.*from\s+["']\$.*?["'];/g, '') 
    .replace(/lang="ts"/g, '') 
    .replace(/<script.*?>.*<\/script>/s, '') 
    .replace(/{#.*?#}/gs, '') 
    .replace(/\$\w+\(.*?\)/g, '') 
    .replaceAll('.', '-') 
    .toLowerCase()
    .trim();

  
  transformed = transformed.replace(
    new RegExp(`<${componentName}\\.([A-Z][a-zA-Z]*)`, 'g'),
    (match, subComponent) => {
      if (subComponent === 'Root') {
        return `<shadcn-${kebabName}`;
      }
      return `<shadcn-${kebabName}-${toKebabCase(subComponent)}`;
    }
  );
  transformed = transformed.replace(
    new RegExp(`</${componentName}\\.([A-Z][a-zA-Z]*)>`, 'g'),
    (match, subComponent) => {
      if (subComponent === 'Root') {
        return `</shadcn-${kebabName}>`;
      }
      return `</shadcn-${kebabName}-${toKebabCase(subComponent)}>`;
    }
  );

  
  transformed = transformed.replace(
    new RegExp(`<${componentName}( |>)`, 'g'),
    `<shadcn-${kebabName}$1`
  );
  transformed = transformed.replace(
    new RegExp(`</${componentName}>`, 'g'),
    `</shadcn-${kebabName}>`
  );

  return transformed;
};

const generateComponentReadme = async (componentName, frontmatter, usage) => {
  const kebabName = toKebabCase(componentName);
  const packageName = `@shcnwc/shadcn-${kebabName}-web-component`;
  const version = JSON.parse(await fsp.readFile(rootPackageJsonPath, 'utf8')).version;
  const sourceLink = frontmatter.links?.source || `https://github.com/shcnwc/shadcn-web-components/tree/main/dist/${kebabName}`;
  const docLink = frontmatter.links?.doc || 'https://github.com/shcnwc/shadcn-web-components';

  const transformedUsage = transformToWebComponentUsage(usage, componentName, `shadcn-${kebabName}`);

  return `# ${frontmatter.title || componentName}

${frontmatter.description || 'A web component for ' + componentName + '.'}

${generateBadges(packageName, version)}

## Installation

\`\`\`bash
npm install ${packageName}
\`\`\`

## Usage

\`\`\`html
<script type="module">
  import "${packageName}";
</script>

${transformedUsage}
\`\`\`

## Links

- [Source Code](${sourceLink})
- [Documentation](${docLink})
- [License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)

## Contributing

Contributions are welcome! Please open an issue or pull request on [GitHub](https://github.com/shcnwc/shadcn-web-components).

## License

This project is licensed under the [MIT License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE).
`;
};

const generateRootReadme = async (components) => {
  const packageName = '@shcnwc/shadcn-web-components';
  const version = JSON.parse(await fsp.readFile(rootPackageJsonPath, 'utf8')).version;

  return `# Shadcn Web Components

A collection of framework-agnostic web components built from shadcn-svelte, with TypeScript support and VS Code integration.

${generateBadges(packageName, version)}

## Components

${components.map(c => `- [${c.title || c.name}](dist/${c.name}) - ${c.description || 'A web component for ' + c.name + '.'}`).join('\n')}

## Installation

\`\`\`bash
npm install ${packageName}
\`\`\`

## Usage

Import the components you need in your HTML:

\`\`\`html
<script type="module">
  import "${packageName}";
</script>

<shadcn-button>Click me</shadcn-button>
<shadcn-accordion>...</shadcn-accordion>
\`\`\`

For individual component usage, refer to their respective READMEs in the \`dist\` directory.

## Links

- [Source Code](https://github.com/shcnwc/shadcn-web-components)
- [Documentation](https://github.com/shcnwc/shadcn-web-components)
- [License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)

## Contributing

Contributions are welcome! Please open an issue or pull request on [GitHub](https://github.com/shcnwc/shadcn-web-components).

## License

This project is licensed under the [MIT License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE).
`;
};

const generateReadmes = async () => {
  try {
    const manifest = JSON.parse(await fsp.readFile(manifestPath, 'utf8'));
    const componentFolders = await fsp.readdir(docsDir, { withFileTypes: true });
    const components = [];

    
    for (const folder of componentFolders) {
      if (!folder.isFile() || !folder.name.endsWith('.md')) continue;
      const componentName = folder.name.replace('.md', '');
      const kebabName = toKebabCase(componentName);
      if (!manifest[kebabName]) {
        console.log(`Skipping ${kebabName}: not in component-props.json`);
        continue;
      }
      const docPath = join(docsDir, folder.name);
      const content = await fsp.readFile(docPath, 'utf8');
      console.log('content :>> ', content);
      const frontmatter = parseFrontmatter(content);
      const usage = extractUsage(content);
      console.log('usage :>> ', usage);
      const readmeContent = await generateComponentReadme(componentName, frontmatter, usage);
      const outDir = join(distDir, kebabName);
      await fsp.mkdir(outDir, { recursive: true });
      await fsp.writeFile(join(outDir, 'README.md'), readmeContent);
      console.log(`Generated README for ${kebabName}`);

      components.push({ name: kebabName, title: frontmatter.title, description: frontmatter.description });
    }

    
    const rootReadme = await generateRootReadme(components);
    await fsp.writeFile(join(distDir, 'README.md'), rootReadme);
    console.log('Generated root README');

  } catch (e) {
    console.error('Error generating READMEs:', e);
    process.exit(1);
  }
};

generateReadmes();