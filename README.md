// generate-wrappers.js
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Paths
const __dirname = dirname(fileURLToPath(import.meta.url));
const componentsDir = join(__dirname, 'src', 'shadcn-svelte', 'docs', 'src', 'lib', 'registry', 'ui');
const outputDir = join(__dirname, 'src', 'lib');
const viteConfigPath = join(__dirname, 'vite.config.ts');

// Known compound components
const compoundComponents = [
  'Accordion', 'AlertDialog', 'Dialog', 'DropdownMenu', 'HoverCard', 'Menubar', 'NavigationMenu', 'Popover', 'Progress', 'RadioGroup', 'Select', 'Separator', 'Sheet', 'Slider', 'Switch', 'Tabs', 'Toast', 'Toaster', 'ToggleGroup', 'Toolbar', 'Tooltip'
];

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

// Helper to parse props from Svelte file
const parsePropsFromSvelte = async (svelteFilePath) => {
  try {
    const content = await fs.readFile(svelteFilePath, 'utf8');
    const scriptMatch = content.match(/<script lang="ts">([\s\S]*?)<\/script>/);
    if (!scriptMatch) return {};

    const scriptContent = scriptMatch[1];
    const propsMatch = scriptContent.match(/let\s*\{([\s\S]*?)\}\s*:\s*([^=]+)\s*=\s*\$props\(\);/);
    if (!propsMatch) return {};

    const destructured = propsMatch[1].trim();
    const typeAnnotation = propsMatch[2].trim();

    const propItems = destructured.split(',').map(item => item.trim()).filter(item => item);

    const props = {};
    propItems.forEach(item => {
      if (item === '...restProps') return;

      let propName, variableName, rawDefault = null;

      if (item.includes(':') && item.includes('=')) {
        const [renamePart, defaultPart] = item.split('=').map(part => part.trim());
        const [prop, varName] = renamePart.split(':').map(part => part.trim());
        propName = prop;
        variableName = varName;
        rawDefault = defaultPart;
      } else if (item.includes(':')) {
        const [prop, varName] = item.split(':').map(part => part.trim());
        propName = prop;
        variableName = varName;
      } else if (item.includes('=')) {
        const [varName, defaultPart] = item.split('=').map(part => part.trim());
        propName = varName;
        variableName = varName;
        rawDefault = defaultPart;
      } else {
        propName = item;
        variableName = item;
      }

      props[propName] = {
        variableName,
        rawDefault
      };
    });

    return props;
  } catch (error) {
    console.error(`Error parsing props from ${svelteFilePath}:`, error);
    return {};
  }
};

// Helper to generate wrapper .svelte content
const generateWrapperContent = async (svelteFilePath, componentName, importPath, isSubComponent = false, parentComponent = '', isCompound = false) => {
  const tagName = `shadcn-${toKebabCase(componentName)}`;
  const importStatement = isSubComponent
    ? `import { ${parentComponent} } from '../../shadcn-svelte/docs/src/lib/registry/ui/${parentComponent.toLowerCase()}';`
    : `import * as ${componentName} from '../../shadcn-svelte/docs/src/lib/registry/ui/${componentName.toLowerCase()}';`;

  const parsedProps = await parsePropsFromSvelte(svelteFilePath);

  // Reconstruct destructuring
  const destructuringItems = [];
  const hasChildren = 'children' in parsedProps;
  const attributes = [];
  for (const propName in parsedProps) {
    const { variableName, rawDefault } = parsedProps[propName];
    let item = '';
    if (variableName !== propName) {
      item += `${propName}: ${variableName}`;
    } else {
      item += propName;
    }
    if (rawDefault) {
      item += ` = ${rawDefault}`;
    }
    destructuringItems.push(item);

    // Attributes
    if (propName === 'class') {
      attributes.push('class={className}');
    } else if (propName !== 'children') {
      attributes.push(`{${variableName}}`);
    }
  }

  const destructuringString = destructuringItems.join(',\n\t\t');

  const componentAccess = isSubComponent ? `${parentComponent}.${componentName}` : isCompound ? `${componentName}.Root` : componentName;

  const contentTag = hasChildren ? '{@render children?()}' : '<slot />';

  return `<svelte:options customElement="${tagName}" />

<script lang="ts">
  ${importStatement}

  let {
    ${destructuringString}
  } = $props<any>();
</script>

<${componentAccess} ${attributes.join(' ')} {...$$restProps}>
  ${contentTag}
</${componentAccess}>
`;
};

// Helper to generate index.ts content
const generateIndexContent = (componentName) => {
  return `export { default as ${componentName} } from './${componentName}.svelte';`;
};

// Helper to update vite.config.ts
const updateViteConfig = async (components) => {
  try {
    const viteConfigContent = await fs.readFile(viteConfigPath, 'utf8');
    const entryStartMarker = 'entry: {';
    const entryEndMarker = '},';
    const entryStartIndex = viteConfigContent.indexOf(entryStartMarker) + entryStartMarker.length;
    const entryEndIndex = viteConfigContent.indexOf(entryEndMarker, entryStartIndex);

    if (entryStartIndex === -1 || entryEndIndex === -1) {
      throw new Error('Could not find build.lib.entry in vite.config.ts');
    }

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
          )}/index.ts')`
      )
    ];

    // Merge and deduplicate entries
    const allEntries = [...new Set([...existingEntries, newEntries])].sort();
    const updatedEntries = allEntries.join(',\n        ');

    const updatedViteConfig = `${viteConfigContent.slice(0, entryStartIndex)}\n        ${updatedEntries}\n      ${viteConfigContent.slice(entryEndIndex)}`;

    await fs.writeFile(viteConfigPath, updatedViteConfig);
  } catch (error) {
    throw new Error(`Failed to update vite.config.ts: ${error.message}`);
  }
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
        const componentPath = join(componentsDir, folder.name);
        const files = await fs.readdir(componentPath, { withFileTypes: true });

        // Determine if root is compound (has sub .svelte files or in list)
        const subSvelteFiles = files.filter(f => f.isFile() && f.name.endsWith('.svelte') && f.name !== `${folder.name}.svelte`);
        const isCompound = subSvelteFiles.length > 0 || compoundComponents.includes(toPascalCase(folder.name));

        // Add root component if exists
        const componentFile = files.find((f) => f.name === `${folder.name}.svelte`);
        if (componentFile) {
          components.push({
            componentName: toPascalCase(folder.name),
            importPath: folder.name,
            isSubComponent: false,
            svelteFilePath: join(componentPath, `${folder.name}.svelte`),
            isCompound: isCompound
          });
        }

        // Add sub-components
        for (const file of subSvelteFiles) {
          const subComponentName = file.name.replace('.svelte', '');
          components.push({
            componentName: toPascalCase(subComponentName),
            importPath: `${folder.name}/${subComponentName}`,
            isSubComponent: true,
            parentComponent: toPascalCase(folder.name),
            svelteFilePath: join(componentPath, file.name),
            isCompound: false
          });
        }
      }
    }

    // Generate wrapper files
    for (const { componentName, importPath, isSubComponent, parentComponent, svelteFilePath, isCompound } of components) {
      const outputFolderName = toKebabCase(isSubComponent ? `${parentComponent.toLowerCase()}-${componentName.toLowerCase()}` : componentName.toLowerCase());
      const outputFolder = join(outputDir, outputFolderName);
      await fs.mkdir(outputFolder, { recursive: true });

      // Write .svelte file
      const wrapperContent = await generateWrapperContent(svelteFilePath, componentName, importPath, isSubComponent, parentComponent, isCompound);
      await fs.writeFile(join(outputFolder, `${componentName}.svelte`), wrapperContent);

      // Write index.ts file
      const indexContent = generateIndexContent(componentName);
      await fs.writeFile(join(outputFolder, 'index.ts'), indexContent);
    }

    // Update src/index.js
    const indexContent = components
      .map(({ componentName, isSubComponent, parentComponent }) =>
        `export * from './lib/${toKebabCase(isSubComponent ? `${parentComponent.toLowerCase()}-${componentName.toLowerCase()}` : componentName.toLowerCase())}';`
      )
      .join('\n');
    await fs.writeFile(join(__dirname, 'src', 'index.js'), indexContent);

    // Update vite.config.ts
    await updateViteConfig(components);

    console.log('Wrappers generated and vite.config.ts updated successfully!');
  } catch (error) {
    console.error('Error generating wrappers:', error);
  }
};

// Run the script
generateWrappers();