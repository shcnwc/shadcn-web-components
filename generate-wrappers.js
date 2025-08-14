// generate-wrappers.js
const fs = require('fs').promises;
const path = require('path');

// Paths
const componentsDir = path.join(__dirname, 'src', 'shadcn-svelte', 'docs', 'src', 'lib', 'registry', 'ui');
const outputDir = path.join(__dirname, 'src', 'lib');
const viteConfigPath = path.join(__dirname, 'vite.config.js');

// Helper to convert component name to kebab-case (e.g., DialogContent -> dialog-content)
const toKebabCase = (str) => {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
};

// Helper to convert component name to PascalCase (e.g., dialog-content -> DialogContent)
const toPascalCase = (str) => {
  return str
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
};

// Helper to generate wrapper .svelte content
const generateWrapperContent = (componentName, importPath, isSubComponent = false, parentComponent = '') => {
  const tagName = `shadcn-${toKebabCase(componentName)}`;
  const importStatement = isSubComponent
    ? `import { ${parentComponent} } from '../../shadcn-svelte/docs/src/lib/registry/ui/${parentComponent.toLowerCase()}';`
    : `import * as ${componentName} from '../../shadcn-svelte/docs/src/lib/registry/ui/${componentName.toLowerCase()}';`;

  // Minimal props to suppress $props() warnings
  const props = isSubComponent
    ? { class: { type: 'String', default: '' } } // Most sub-components use class
    : componentName === 'Button'
      ? {
          variant: { type: 'String', default: 'default' },
          size: { type: 'String', default: 'default' },
          disabled: { type: 'Boolean', default: false }
        }
      : componentName === 'Dialog'
        ? { open: { type: 'Boolean', default: false } }
        : { class: { type: 'String', default: '' } }; // Fallback for other components

  const propsString = JSON.stringify(props, null, 2).replace(/\n/g, '\n    ');

  const componentAccess = isSubComponent ? `${parentComponent}.${componentName}` : `${componentName}.Root || ${componentName}`;

  return `<svelte:options
  customElement={{
    tag: '${tagName}',
    props: ${propsString}
  }}
/>

<script>
  ${importStatement}

  ${Object.keys(props).map((prop) => `export let ${prop} = ${JSON.stringify(props[prop].default)};`).join('\n  ')}
</script>

<${componentAccess} ${Object.keys(props).map((prop) => `{${prop}}`).join(' ')} {...$$restProps}>
  <slot />
</${componentAccess}>
`;
};

// Helper to generate index.js content
const generateIndexContent = (componentName) => {
  return `export { default as ${componentName} } from './${componentName}.svelte';`;
};

// Helper to update vite.config.js
const updateViteConfig = async (components) => {
  const viteConfigContent = await fs.readFile(viteConfigPath, 'utf8');
  const entryStartMarker = 'entry: {';
  const entryEndMarker = '},';
  const entryStartIndex = viteConfigContent.indexOf(entryStartMarker) + entryStartMarker.length;
  const entryEndIndex = viteConfigContent.indexOf(entryEndMarker, entryStartIndex);

  const existingEntries = viteConfigContent
    .slice(entryStartIndex, entryEndIndex)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('//'));

  const newEntries = [
    `'shadcn-web-components': resolve(__dirname, 'src/index.js')`,
    ...components.map(
      ({ componentName, isSubComponent, parentComponent }) =>
        `'${toKebabCase(isSubComponent ? `${parentComponent}-${componentName}` : componentName)}': resolve(__dirname, 'src/lib/${toKebabCase(
          isSubComponent ? `${parentComponent.toLowerCase()}-${componentName.toLowerCase()}` : componentName.toLowerCase()
        )}/index.js')`
    )
  ];

  // Merge and deduplicate entries
  const allEntries = [...new Set([...existingEntries, ...newEntries])].sort();
  const updatedEntries = allEntries.join(',\n        ');

  const updatedViteConfig = `${viteConfigContent.slice(0, entryStartIndex)}\n        ${updatedEntries}\n      ${viteConfigContent.slice(entryEndIndex)}`;

  await fs.writeFile(viteConfigPath, updatedViteConfig);
};

// Main function to generate wrappers and update configs
const generateWrappers = async () => {
  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Read components directory
    const componentFolders = await fs.readdir(componentsDir, { withFileTypes: true });

    const components = [];

    for (const folder of componentFolders) {
      if (folder.isDirectory()) {
        const componentPath = path.join(componentsDir, folder.name);
        const files = await fs.readdir(componentPath, { withFileTypes: true });

        // Check if it's a single-component folder (e.g., button.svelte)
        const componentFile = files.find((f) => f.name === `${folder.name}.svelte`);
        if (componentFile) {
          components.push({
            componentName: toPascalCase(folder.name),
            importPath: folder.name,
            isSubComponent: false
          });
        }

        // Check for sub-components (e.g., dialog/dialog-content.svelte)
        for (const file of files) {
          if (file.isFile() && file.name.endsWith('.svelte') && file.name !== `${folder.name}.svelte`) {
            const subComponentName = file.name.replace('.svelte', '');
            components.push({
              componentName: toPascalCase(subComponentName),
              importPath: `${folder.name}/${subComponentName}`,
              isSubComponent: true,
              parentComponent: toPascalCase(folder.name)
            });
          }
        }
      }
    }

    // Generate wrapper files
    for (const { componentName, importPath, isSubComponent, parentComponent } of components) {
      const outputFolderName = toKebabCase(isSubComponent ? `${parentComponent.toLowerCase()}-${componentName.toLowerCase()}` : componentName.toLowerCase());
      const outputFolder = path.join(outputDir, outputFolderName);
      await fs.mkdir(outputFolder, { recursive: true });

      // Write .svelte file
      const wrapperContent = generateWrapperContent(componentName, importPath, isSubComponent, parentComponent);
      await fs.writeFile(path.join(outputFolder, `${componentName}.svelte`), wrapperContent);

      // Write index.js file
      const indexContent = generateIndexContent(componentName);
      await fs.writeFile(path.join(outputFolder, 'index.js'), indexContent);
    }

    // Update src/index.js
    const indexContent = components
      .map(({ componentName, isSubComponent, parentComponent }) =>
        `export * from './lib/${toKebabCase(isSubComponent ? `${parentComponent.toLowerCase()}-${componentName.toLowerCase()}` : componentName.toLowerCase())}';`
      )
      .join('\n');
    await fs.writeFile(path.join(__dirname, 'src', 'index.js'), indexContent);

    // Update vite.config.js
    await updateViteConfig(components);

    console.log('Wrappers generated and vite.config.js updated successfully!');
  } catch (error) {
    console.error('Error generating wrappers:', error);
  }
};

// Run the script
generateWrappers();