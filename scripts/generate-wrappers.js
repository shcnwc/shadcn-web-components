import { promises as fsp } from 'fs';
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { build } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import customTsConfig from 'vite-plugin-custom-tsconfig';

const __dirname = dirname(fileURLToPath(import.meta.url));
const componentsDir = join(__dirname, '..', 'src', 'shadcn-svelte', 'docs', 'src', 'lib', 'registry', 'ui');
const utilsSrcPath = join(__dirname, '..', 'src', 'shadcn-svelte', 'docs', 'src', 'lib', 'utils.ts');
const utilsDestPath = join(__dirname, '..', 'src', 'lib', 'utils.ts');
const outputDir = join(__dirname, '..', 'src', 'lib');
const manifestPath = join(__dirname, '..', 'component-props.json');
const rootPackageDir = join(__dirname, '..', 'dist');
const releaseConfigPath = join(__dirname, '..', '.releaserc.json');
const rootSvelteKitTsConfigPath = join(__dirname, '..', '.svelte-kit', 'tsconfig.json');
const targetSvelteKitTsConfigPath = join(__dirname, '..', 'src', 'shadcn-svelte', 'docs', '.svelte-kit', 'tsconfig.json');

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

const buildPropsLiteral = (entry, hasChildren = false, hasRef = false) => {
  const map = { String: 'String', Boolean: 'Boolean', Number: 'Number', Array: 'Array', Object: 'Object', string: 'String', boolean: 'Boolean', number: 'Number', array: 'Array', object: 'Object', Date: 'Date', date: 'Date' };
  const pairs = Object.entries(entry).filter(([k, v]) => v && typeof v === 'object' && 'type' in v).map(([k, v]) => {
    const t = map[v.type] || 'String';
    return `${k}: { type: "${t}" }`;
  });
  if (hasChildren) pairs.push('children: { type: "Object" }');
  if (hasRef) pairs.push('ref: { type: "Object" }');
  return `{ ${pairs.join(', ')} }`;
};

const generateIndexContent = async (componentPath, componentName, svelteFileName, isDrawer = false) => {
  if (isDrawer) {
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

const generatePackageJson = async (componentName) => {
  const manifestEntry = manifest[componentName] || {};
  const pkg = {
    name: `@shcnwc/shadcn-${componentName}-web-component`,
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

const generateRootPackageJson = async (components) => {
  return {
    name: '@shcnwc/shadcn-web-components',
    type: 'module',
    main: 'index.js',
    types: 'types.d.ts',
    files: ['index.js', 'index.js.map', 'types.d.ts', 'html-data.json'],
    publishConfig: { access: 'public' },
    sideEffects: false,
    dependencies: Object.fromEntries(
      components.map(({ effectiveKebab }) => [`@shcnwc/shadcn-${effectiveKebab}-web-component`, '*'])
    )
  };
};

const generateReleaseConfig = async (components) => {
  const npmPlugins = [
    {
      pkgRoot: 'dist',
      npmPublish: true,
      tarballDir: 'dist'
    },
    ...components.map(({ folderName }) => ({
      pkgRoot: `dist/${folderName}`,
      npmPublish: true,
      tarballDir: `dist/${folderName}`
    }))
  ].map(config => ['@semantic-release/npm', config]);
  const releaseConfig = {
    branches: ['master'],
    plugins: [
      [
        '@semantic-release/commit-analyzer',
        {
          releaseRules: [
            { type: 'chore', release: false },
            { type: 'docs', release: 'patch' },
            { type: 'feat', release: 'minor' },
            { type: 'fix', release: 'patch' },
            { message: '/shadcn-svelte/', release: 'patch' }
          ]
        }
      ],
      '@semantic-release/release-notes-generator',
      [
        '@semantic-release/changelog',
        {
          changelogFile: 'CHANGELOG.md',
          changelogTitle: '# Changelog\n\nAll notable changes to this project will be documented in this file.'
        }
      ],
      ...npmPlugins,
      [
        '@semantic-release/git',
        {
          assets: [
            'dist/package.json',
            'dist/*/package.json',
            'CHANGELOG.md'
          ],
          message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
        }
      ]
    ]
  };
  console.log('Writing .releaserc.json to:', releaseConfigPath);
  await fsp.writeFile(releaseConfigPath, JSON.stringify(releaseConfig, null, 2), 'utf8');
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
      output: {
        manualChunks: undefined,
        chunkFileNames: () => {
          throw new Error('No chunks should be generated');
        }
      }
    }
  },
});

let manifest;

const generateWrappers = async () => {
  try {
    console.log('Copying .svelte-kit/tsconfig.json to src/shadcn-svelte/docs/.svelte-kit...');
    try {
      await fsp.mkdir(dirname(targetSvelteKitTsConfigPath), { recursive: true });
      await fsp.copyFile(rootSvelteKitTsConfigPath, targetSvelteKitTsConfigPath);
      console.log('.svelte-kit/tsconfig.json copied successfully.');
    } catch (copyError) {
      console.error(`Error copying ${rootSvelteKitTsConfigPath} to ${targetSvelteKitTsConfigPath}:`, copyError.message);
      throw copyError;
    }

    const manifestRaw = await fsp.readFile(manifestPath, 'utf8');
    manifest = JSON.parse(manifestRaw);
    const allowedSet = new Set(
      Object.keys(manifest).filter(key => /^[a-z-]+(-[a-z-]+)*$/.test(key))
    );
    console.log('Components in manifest:', [...allowedSet]);
    await fsp.rm(outputDir, { recursive: true, force: true });
    await fsp.mkdir(outputDir, { recursive: true });

    // Check if utils.ts exists before copying
    try {
      await fsp.access(utilsSrcPath);
      await fsp.copyFile(utilsSrcPath, utilsDestPath);
      console.log('Copied utils.ts to src/lib/utils.ts');
    } catch (e) {
      console.warn(`Warning: Could not copy ${utilsSrcPath} to ${utilsDestPath}. File not found, proceeding without it.`);
    }

    try {
      await fsp.access(componentsDir);
    } catch (e) {
      console.error(`Error: Components directory ${componentsDir} not found. Ensure shadcn-svelte submodule is initialized and updated.`);
      process.exit(1);
    }

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
      console.log(`Processing component: ${effectiveKebab}`);
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
      const hasChildren = (await fsp.readFile(svelteFilePath, 'utf8')).includes('{@render children?.()}');
      const hasRef = (await fsp.readFile(svelteFilePath, 'utf8')).includes('ref = $bindable');
      const propsLiteral = buildPropsLiteral(manifestEntry, hasChildren, hasRef);
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
        JSON.stringify(await generatePackageJson(effectiveKebab), null, 2)
      );
      htmlDataTags.push(genHtmlDataEntry(tagName, manifestEntry));

      // Build the component individually
      try {
        const viteConfig = generateViteConfig(effectiveKebab, join(outDir, 'index.ts'), join(__dirname, '..', 'dist'));
        await build({ configFile: false, ...viteConfig });
        console.log(`Built component: ${effectiveKebab}`);
      } catch (buildError) {
        console.error(`Failed to build component ${effectiveKebab}:`, buildError);
        throw buildError;
      }
    }

    await fsp.mkdir(rootPackageDir, { recursive: true });
    const indexJs = components.map(({ effectiveKebab }) => `export * from '@shcnwc/shadcn-${effectiveKebab}-web-component';`).join('\n');
    await fsp.writeFile(join(rootPackageDir, 'index.js'), indexJs);
    const allDts = allInterfaces.join('\n\n') + '\ndeclare global {\n  interface HTMLElementTagNameMap {\n' + allTagMaps.join('\n') + '\n  }\n}\n';
    await fsp.writeFile(join(rootPackageDir, 'types.d.ts'), allDts);
    await fsp.writeFile(
      join(rootPackageDir, 'package.json'),
      JSON.stringify(await generateRootPackageJson(components), null, 2)
    );
    const htmlData = { version: 1.1, tags: htmlDataTags };
    await fsp.writeFile(join(rootPackageDir, 'html-data.json'), JSON.stringify(htmlData, null, 2), 'utf8');

    // Generate .releaserc.json
    await generateReleaseConfig(components);

    console.log('Wrappers, types, package.json files, and .releaserc.json generated; individual components built; html-data.json updated.');
  } catch (e) {
    console.error('Error generating wrappers/types:', e);
    throw e;
  } finally {
    try {
      await fsp.unlink(targetSvelteKitTsConfigPath);
      console.log('Cleaned up: Removed src/shadcn-svelte/docs/.svelte-kit/tsconfig.json');
    } catch (unlinkError) {
      console.warn('Failed to clean up .svelte-kit/tsconfig.json:', unlinkError.message);
    }
  }
};

generateWrappers().catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});