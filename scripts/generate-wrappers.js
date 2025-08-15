import { promises as fsp } from 'fs';
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { build } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const componentsDir = join(__dirname, '..', 'src', 'shadcn-svelte', 'docs', 'src', 'lib', 'registry', 'ui');
const utilsSrcPath = join(__dirname, '..', 'src', 'shadcn-svelte', 'docs', 'src', 'lib', 'utils.ts');
const utilsDestPath = join(__dirname, '..', 'src', 'lib', 'utils.ts');
const outputDir = join(__dirname, '..', 'src', 'lib');
const manifestPath = join(__dirname, '..', 'component-props.json');
const htmlDataPath = join(__dirname, '..', 'src', 'html-data.json');

const toKebabCase = (str) => str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
const toPascalCase = (str) => str.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
const toInterfaceName = (tag) => toPascalCase(tag.replace(/^shadcn-/, '')) + 'Attributes';

const mapTs = (prop) => {
  if (!prop) return 'string';
  if (prop.tsType) return prop.tsType;
  if (Array.isArray(prop.enum) && prop.enum.length) {
    return prop.enum.map((v) => (typeof v === 'string' ? JSON.stringify(v) : String(v))).join(' | ');
  }
  const t = prop.type;
  if (t === 'String' || t === 'string') return 'string';
  if (t === 'Number' || t === 'number') return 'number';
  if (t === 'Boolean' || t === 'boolean') return 'boolean';
  if (t === 'Date' || t === 'date') return 'Date';
  if (t === 'Array' || t === 'array') return 'unknown[]';
  if (t === 'Object' || t === 'object') return 'Record<string, unknown>';
  return 'unknown';
};

const buildPropsLiteral = (entry) => {
  const map = { String: 'String', Boolean: 'Boolean', Number: 'Number', Array: 'Array', Object: 'Object', string: 'String', boolean: 'Boolean', number: 'Number', array: 'Array', object: 'Object', Date: 'Date', date: 'Date' };
  const pairs = Object.entries(entry).filter(([k, v]) => v && typeof v === 'object' && 'type' in v).map(([k, v]) => {
    const t = map[v.type] || 'String';
    return `${k}: { type: "${t}" }`;
  });
  return `{ ${pairs.join(', ')} }`;
};

const generateIndexContent = async (componentPath, componentName, svelteFileName, isDrawer = false) => {
  if (isDrawer) {
    // Custom index.ts for drawer components to avoid unnecessary vaul-svelte imports
    const kebabName = toKebabCase(componentName);
    if (kebabName === 'drawer') {
      return `export { default as Drawer } from './drawer.svelte';`;
    } else if (kebabName === 'drawer-nested') {
      return `export { default as DrawerNestedRoot } from './drawer-nested.svelte';`;
    } else if (kebabName === 'drawer-content') {
      return `export { default as DrawerContent } from './drawer-content.svelte';`;
    } else if (kebabName === 'drawer-description') {
      return `export { default as DrawerDescription } from './drawer-description.svelte';`;
    } else if (kebabName === 'drawer-overlay') {
      return `export { default as DrawerOverlay } from './drawer-overlay.svelte';`;
    } else if (kebabName === 'drawer-footer') {
      return `export { default as DrawerFooter } from './drawer-footer.svelte';`;
    } else if (kebabName === 'drawer-header') {
      return `export { default as DrawerHeader } from './drawer-header.svelte';`;
    } else if (kebabName === 'drawer-title') {
      return `export { default as DrawerTitle } from './drawer-title.svelte';`;
    } else if (kebabName === 'drawer-trigger') {
      return `export { default as DrawerTrigger } from './drawer-trigger.svelte';`;
    } else if (kebabName === 'drawer-close') {
      return `export { default as DrawerClose } from './drawer-close.svelte';`;
    }
    return `export { Portal as DrawerPortal } from 'vaul-svelte';`;
  }
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

const nativeBaseByKebab = new Map([
  ['button', 'HTMLElement'],
  ['input', 'HTMLElement'],
  ['textarea', 'HTMLElement']
]);

const collectProps = (entry) =>
  Object.fromEntries(
    Object.entries(entry).filter(([_, v]) => v && typeof v === 'object' && 'type' in v)
  );

const mergeCase = (baseProps, casePatch) => {
  const b = { ...baseProps };
  for (const [k, v] of Object.entries(casePatch || {})) {
    b[k] = { ...(b[k] || { type: 'String' }), ...v };
  }
  return b;
};

const ifaceName = (tag) => toPascalCase(tag.replace(/^shadcn-/, '')) + 'Attributes';
const caseIfaceName = (tag, caseKey) => toPascalCase(tag.replace(/^shadcn-/, '')) + toPascalCase(String(caseKey)) + 'Attributes';

const propsToFields = (props) =>
  Object.entries(props)
    .map(([name, def]) => {
      const t = mapTs(def);
      const opt = def.required ? '' : '?';
      return ` "${name}"${opt}: ${t};`;
    })
    .join('\n');

const genDts = (tagName, manifestEntry, base = 'HTMLElement', events = []) => {
  const baseProps = collectProps(manifestEntry);
  const variants = manifestEntry.variants && typeof manifestEntry.variants === 'object' ? manifestEntry.variants : null;
  if (!variants) {
    const I = ifaceName(tagName);
    const fields = propsToFields(baseProps);
    return `export interface ${I} {
${fields}
}
declare global {
  interface HTMLElementTagNameMap {
    "${tagName}": ${base};
  }
}
`;
  }
  const discr = variants.discriminant;
  const cases = variants.cases || {};
  const caseIfaces = [];
  const caseNames = [];
  for (const [caseKey, patch] of Object.entries(cases)) {
    const merged = mergeCase(baseProps, patch);
    if (!merged[discr]) merged[discr] = { tsType: JSON.stringify(caseKey), required: true, type: 'String' };
    const Icase = caseIfaceName(tagName, caseKey);
    caseIfaces.push(`export interface ${Icase} {
${propsToFields(merged)}
}`);
    caseNames.push(Icase);
  }
  const I = ifaceName(tagName);
  return `${caseIfaces.join('\n\n')}
export type ${I} = ${caseNames.join(' | ')};
declare global {
  interface HTMLElementTagNameMap {
    "${tagName}": ${base};
  }
}
`;
};

const genHtmlDataEntry = (tagName, manifestEntry) => {
  const attributes = Object.entries(manifestEntry)
    .filter(([k, v]) => v && typeof v === 'object' && 'type' in v)
    .map(([name, def]) => ({
      name,
      description: '',
      value: { kind: 'type', type: mapTs(def) }
    }));
  return { name: tagName, description: '', attributes };
};

const generatePackageJson = async (componentName, manifestEntry) => {
  const pkg = {
    name: `@shadcn-web-components/${componentName}`,
    type: 'module',
    main: 'index.js',
    types: 'index.d.ts',
    files: ['index.js', 'index.js.map', 'index.d.ts', 'html-data.json'],
    publishConfig: { access: 'public' },
    sideEffects: false,
    dependencies: {}
  };
  if (manifestEntry?.dependencies) {
    pkg.dependencies = {
      ...pkg.dependencies,
      ...Object.fromEntries(manifestEntry.dependencies.map(dep => [dep, '*']))
    };
  }
  return pkg;
};

const generateViteConfig = (componentName, entryPath, outputDir) => ({
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true
      },
      include: [
        'src/**/*.svelte',
        'src/shadcn-svelte/docs/src/lib/registry/ui/**/*.svelte'
      ],
      exclude: [
        'scripts/**/*',
        'src/shadcn-svelte/apps/**/*',
        'src/shadcn-svelte/docs/src/lib/registry/examples/**/*'
      ]
    }),
    tailwindcss(),
    visualizer({ filename: `dist/${componentName}-stats.html`, template: 'treemap' })
  ],
  resolve: {
    alias: {
      '$lib': join(__dirname, '..', 'src', 'shadcn-svelte', 'docs', 'src', 'lib')
    }
  },
  build: {
    lib: {
      entry: entryPath,
      name: componentName,
      fileName: 'index',
      formats: ['es']
    },
    outDir: join(outputDir, componentName),
    sourcemap: true,
    minify: 'esbuild',
    treeshake: true,
    rollupOptions: {
      external: [],
      inlineDynamicImports: true,
      output: {
        manualChunks: undefined,
        chunkFileNames: () => {
          throw new Error('No chunks should be generated');
        }
      }
    }
  }
});

const generateWrappers = async () => {
  try {
    const manifestRaw = await fsp.readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestRaw);
    const allowedSet = new Set(Object.keys(manifest));
    console.log('Components in manifest:', [...allowedSet]);
    await fsp.rm(outputDir, { recursive: true, force: true });
    await fsp.mkdir(outputDir, { recursive: true });
    await fsp.copyFile(utilsSrcPath, utilsDestPath);
    const componentFolders = await fsp.readdir(componentsDir, { withFileTypes: true });
    const components = [];
    const htmlDataTags = [];
    const allInterfaces = [];
    const allTagMaps = [];

    for (const folder of componentFolders) {
      if (!folder.isDirectory()) continue;
      const folderKebab = toKebabCase(folder.name);
      if (!allowedSet.has(folderKebab)) {
        console.log(`Skipping component ${folderKebab}: not in component-props.json`);
        continue;
      }
      const componentPath = join(componentsDir, folder.name);
      const files = await fsp.readdir(componentPath, { withFileTypes: true });
      const componentFile = files.find((f) => f.isFile() && f.name === `${folder.name}.svelte`);
      if (!componentFile) {
        console.log(`Skipping component ${folderKebab}: no ${folder.name}.svelte file found`);
        continue;
      }
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
        if (!allowedSet.has(subKebab)) {
          console.log(`Skipping sub-component ${subKebab}: not in component-props.json`);
          continue;
        }
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

    console.log('Components to build:', components.map(c => c.effectiveKebab));

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
        if (!f.isFile() || !f.name.endsWith('.svelte')) continue;
        const p = join(outDir, f.name);
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
        if (content.includes('<svelte:options customElement=')) {
          content = content.replace(/<svelte:options\s+customElement=[^>]+>\s*<\/svelte:options>\s*|\s*<svelte:options\s+customElement=[^>]+\/>\s*/s, optionsTag);
        } else if (!content.includes('<svelte:options')) {
          content = optionsTag + content;
        }
        await fsp.writeFile(p, content);
      }
      const indexContent = await generateIndexContent(componentPath, componentName, svelteFileName, folderName.startsWith('drawer'));
      await fsp.writeFile(join(outDir, 'index.ts'), indexContent);
      const tagName = `shadcn-${effectiveKebab}`;
      const base = nativeBaseByKebab.get(effectiveKebab) || 'HTMLElement';
      const events = Array.isArray(manifestEntry.events) ? manifestEntry.events : [];
      const dtsContent = genDts(tagName, manifestEntry, base, events);
      const dtsParts = dtsContent.split('declare global');
      allInterfaces.push(dtsParts[0].trim());
      allTagMaps.push(`    "${tagName}": ${base};`);
      await fsp.writeFile(join(outDir, 'index.d.ts'), dtsContent);
      const componentHtmlData = { version: 1.1, tags: [genHtmlDataEntry(tagName, manifestEntry)] };
      await fsp.writeFile(join(outDir, 'html-data.json'), JSON.stringify(componentHtmlData, null, 2));
      await fsp.writeFile(
        join(outDir, 'package.json'),
        JSON.stringify(await generatePackageJson(effectiveKebab, manifestEntry), null, 2)
      );
      htmlDataTags.push(genHtmlDataEntry(tagName, manifestEntry));

      // Build the component individually
      const viteConfig = generateViteConfig(effectiveKebab, join(outDir, 'index.ts'), join(__dirname, '..', 'dist'));
      await build({ configFile: false, ...viteConfig });
    }

    const indexJs = components.map(({ effectiveKebab }) => `export * from '@shadcn-web-components/${effectiveKebab}';`).join('\n');
    await fsp.writeFile(join(__dirname, '..', 'index.js'), indexJs);
    const allDts = allInterfaces.join('\n\n') + '\ndeclare global {\n  interface HTMLElementTagNameMap {\n' + allTagMaps.join('\n') + '\n  }\n}\n';
    await fsp.writeFile(join(__dirname, '..', 'types.d.ts'), allDts);
    const rootPkg = await fsp.readFile('package.json', 'utf8');
    const rootJson = JSON.parse(rootPkg);
    rootJson.name = '@shadcn-web-components/all';
    rootJson.main = 'index.js';
    rootJson.types = 'types.d.ts';
    rootJson.files = ['index.js', 'index.js.map', 'types.d.ts', 'html-data.json'];
    rootJson.publishConfig = { access: 'public' };
    rootJson.sideEffects = false;
    rootJson.dependencies = Object.fromEntries(components.map(({ effectiveKebab }) => [`@shadcn-web-components/${effectiveKebab}`, '*']));
    await fsp.writeFile('package.json', JSON.stringify(rootJson, null, 2));
    const htmlData = { version: 1.1, tags: htmlDataTags };
    await fsp.writeFile(htmlDataPath, JSON.stringify(htmlData, null, 2), 'utf8');
    console.log('Wrappers, types, and package.json files generated; individual components built; html-data.json updated.');
  } catch (e) {
    console.error('Error generating wrappers/types:', e);
  }
};

generateWrappers();