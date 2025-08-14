import { promises as fsp } from 'fs';
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const componentsDir = join(__dirname, 'src', 'shadcn-svelte', 'docs', 'src', 'lib', 'registry', 'ui');
const utilsSrcPath = join(__dirname, 'src', 'shadcn-svelte', 'docs', 'src', 'lib', 'utils.ts');
const utilsDestPath = join(__dirname, 'src', 'lib', 'utils.ts');
const outputDir = join(__dirname, 'src', 'lib');
const viteConfigPath = join(__dirname, 'vite.config.ts');
const manifestPath = join(__dirname, 'component-props.json');

const toKebabCase = (str) => str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
const toPascalCase = (str) => str.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');

const buildPropsLiteral = (entry) => {
  const map = { String: 'String', Boolean: 'Boolean', Number: 'Number', Array: 'Array', Object: 'Object', string: 'String', boolean: 'Boolean', number: 'Number', array: 'Array', object: 'Object' };
  const pairs = Object.entries(entry).map(([k, v]) => {
    const t = map[v] || 'String';
    return `${k}: { type: "${t}" }`;
  });
  return `{ ${pairs.join(', ')} }`;
};

const generateIndexContent = async (componentPath, componentName, svelteFileName) => {
  const originalIndexPath = join(componentPath, 'index.ts');
  try {
    const originalContent = await fsp.readFile(originalIndexPath, 'utf8');
    let updatedContent = originalContent;
    updatedContent = updatedContent.replace(/from\s+["']\.\/([^"']+)\.svelte["']/g, "from './$1.svelte'");
    updatedContent = updatedContent.replace(/from\s+["']\.\/([^"']+)["']/g, (m, p) => {
      try {
        const tsPath = join(componentPath, `${p}.ts`);
        if (fs.existsSync(tsPath)) return `from './${p}.ts'`;
      } catch {}
      return m;
    });
    return updatedContent;
  } catch {
    return `export { default as ${componentName} } from './${svelteFileName}';`;
  }
};

const updateViteConfig = async (components) => {
  let content = await fsp.readFile(viteConfigPath, 'utf8');
  const startMarker = 'entry: {';
  const endMarker = '},';
  const start = content.indexOf(startMarker);
  if (start === -1) throw new Error('build.lib.entry start not found');
  const absStart = start + startMarker.length;
  const end = content.indexOf(endMarker, absStart);
  if (end === -1) throw new Error('build.lib.entry end not found');
  const entries = components.map(({ folderName, effectiveKebab }) => `'${effectiveKebab}': resolve(__dirname, 'src/lib/${folderName}/index.ts')`);
  entries.push(`'shadcn-web-components': resolve(__dirname, 'src/index.js')`);
  const newBlock = `\n ${entries.sort().join(',\n ')}\n `;
  content = content.slice(0, absStart) + newBlock + content.slice(end);
  await fsp.writeFile(viteConfigPath, content);
};

const generateWrappers = async () => {
  try {
    const manifestRaw = await fsp.readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestRaw);
    const allowedSet = new Set(Object.keys(manifest));

    await fsp.rm(outputDir, { recursive: true, force: true });
    await fsp.mkdir(outputDir, { recursive: true });
    await fsp.copyFile(utilsSrcPath, utilsDestPath);

    const componentFolders = await fsp.readdir(componentsDir, { withFileTypes: true });
    const components = [];

    for (const folder of componentFolders) {
      if (!folder.isDirectory()) continue;
      const folderKebab = toKebabCase(folder.name);
      if (!allowedSet.has(folderKebab)) continue;

      const componentPath = join(componentsDir, folder.name);
      const files = await fsp.readdir(componentPath, { withFileTypes: true });
      const componentFile = files.find((f) => f.isFile() && f.name === `${folder.name}.svelte`);
      if (!componentFile) continue;

      const folderName = toKebabCase(folder.name);
      const componentName = toPascalCase(folder.name);
      components.push({
        componentName,
        isSubComponent: false,
        svelteFilePath: join(componentPath, componentFile.name),
        folderName,
        effectiveKebab: folderName,
        svelteFileName: componentFile.name,
        componentPath
      });

      for (const file of files) {
        if (!file.isFile() || !file.name.endsWith('.svelte')) continue;
        if (file.name === `${folder.name}.svelte`) continue;

        const subRaw = file.name.replace('.svelte', '');
        const parentLower = folder.name.toLowerCase();
        const subLower = subRaw.toLowerCase();
        let effectiveSub;
        if (subLower.startsWith(parentLower)) {
          const trimmed = subRaw.substring(parentLower.length).replace(/^[-]/, '');
          effectiveSub = `${folder.name}-${trimmed}`;
        } else {
          effectiveSub = `${folder.name}-${subRaw}`;
        }

        const subKebab = toKebabCase(effectiveSub);
        if (!allowedSet.has(subKebab)) continue;

        components.push({
          componentName: toPascalCase(effectiveSub),
          isSubComponent: true,
          parentComponent: toPascalCase(folder.name),
          svelteFilePath: join(componentPath, file.name),
          folderName: subKebab,
          effectiveKebab: subKebab,
          svelteFileName: file.name,
          componentPath
        });
      }
    }

    for (const { componentName, svelteFilePath, folderName, effectiveKebab, svelteFileName, componentPath } of components) {
      const outDir = join(outputDir, folderName);
      await fsp.mkdir(outDir, { recursive: true });

      const originalComponentPath = dirname(svelteFilePath);
      const files = await fsp.readdir(originalComponentPath, { withFileTypes: true });
      for (const f of files) {
        if (!f.isFile()) continue;
        await fsp.copyFile(join(originalComponentPath, f.name), join(outDir, f.name));
      }

      const outFiles = await fsp.readdir(outDir, { withFileTypes: true });
      const manifestEntry = manifest[effectiveKebab] || {};
      const propsLiteral = buildPropsLiteral(manifestEntry);
      const optionsTag = `<svelte:options customElement={{ tag: "shadcn-${effectiveKebab}", props: ${propsLiteral} }} />\n\n`;

      for (const f of outFiles) {
        if (!f.isFile()) continue;
        const p = join(outDir, f.name);
        if (!(f.name.endsWith('.svelte') || f.name.endsWith('.ts'))) continue;
        let content = await fsp.readFile(p, 'utf8');

        content = content.replace(/from\s+["']\$lib\/utils.js["']/g, "from '../utils.ts'");
        content = content.replace(/from\s+["'](\.\/[^"']+|\.\.\/[^"']+)["']/g, (m, rel) => {
          try {
            const tsPath = join(outDir, `${rel}.ts`);
            if (fs.existsSync(tsPath)) return `from '${rel}.ts'`;
            const sveltePath = join(outDir, `${rel}.svelte`);
            if (fs.existsSync(sveltePath)) return `from '${rel}.svelte'`;
            return m;
          } catch { return m; }
        });

        if (f.name.endsWith('.svelte')) {
          if (content.includes('<svelte:options customElement=')) {
            content = content.replace(/<svelte:options\s+customElement=[^>]+>\s*<\/svelte:options>\s*|\s*<svelte:options\s+customElement=[^>]+\/>\s*/s, optionsTag);
            if (!content.includes('<svelte:options')) content = optionsTag + content;
          } else {
            content = optionsTag + content;
          }
        }

        await fsp.writeFile(p, content);
      }

      const indexContent = await generateIndexContent(componentPath, componentName, svelteFileName);
      await fsp.writeFile(join(outDir, 'index.ts'), indexContent);
    }

    const indexJs = components.map(({ folderName }) => `export * from './lib/${folderName}';`).join('\n');
    await fsp.writeFile(join(__dirname, 'src', 'index.js'), indexJs);

    await updateViteConfig(components);
    console.log('Wrappers generated and vite.config.ts updated successfully!');
  } catch (e) {
    console.error('Error generating wrappers:', e);
  }
};

generateWrappers();
