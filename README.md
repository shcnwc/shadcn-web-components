# shadcn-web-components

A library of framework-agnostic web components built from [shadcn-svelte](https://github.com/huntabyte/shadcn-svelte), providing reusable UI components with TypeScript support and Visual Studio Code integration for enhanced developer experience.

## Features

- **Framework-Agnostic**: Components are compiled as standard web components, usable in any JavaScript framework (React, Vue, Angular, vanilla JS, etc.).
- **Individual Packages**: Each component is published as a separate npm package (`@shcnwc/shadcn-<component>-web-component`) for modular usage.
- **Root Package**: Import all components via `@shcnwc/shadcn-web-components`. This package depends on and re-exports from all individual component packages, allowing installation of everything at once while keeping the main package lightweight.
- **TypeScript Support**: Includes TypeScript definitions (`index.d.ts`) for each component.
- **VS Code Integration**: Generate `html-data.json` for autocompletion and IntelliSense in Visual Studio Code.
- **Customizable**: Built with Tailwind CSS and `bits-ui` for flexible styling and behavior.
- **Automated Builds**: Uses Vite to generate self-contained bundles with no shared chunks.

## Installation

To use a specific component, install it via npm:

```bash
npm install @shcnwc/shadcn-<component-name>-web-component
```

For example, to install the `button` component:

```bash
npm install @shcnwc/shadcn-button-web-component
```

To use all components:

```bash
npm install @shcnwc/shadcn-web-components
```

## Usage

### Importing a Component

Each component is a custom element that can be used in HTML or JavaScript.

```html
<!-- Using the button component -->
<shadcn-button variant="primary" onclick="alert('Clicked!')">Click Me</shadcn-button>

<script type="module">
  import '@shcnwc/shadcn-button-web-component';
</script>
```

For the root package:

```html
<script type="module">
  import '@shcnwc/shadcn-web-components';
</script>

<shadcn-button variant="primary">Click Me</shadcn-button>
<shadcn-drawer open>Drawer Content</shadcn-drawer>
```

### Available Components

Components are based on `shadcn-svelte` and include:

- `accordion`, `accordion-content`, `accordion-item`, `accordion-trigger`
- `button`, `card`, `drawer`, `dialog`, and more (see `component-props.json` for the full list).

Each component has specific attributes defined in its `html-data.json` file, which provides metadata for attributes like `variant`, `disabled`, etc.

### Visual Studio Code Integration

To enable autocompletion and IntelliSense for `shadcn-*` custom elements in VS Code:

1. Build the project to generate `dist/html-data.json`:

   ```bash
   node scripts/generate-wrappers.js
   ```

2. Run the setup script to configure VS Code:

   ```bash
   npx shadcn-web-components setup
   ```

   This copies `dist/html-data.json` to `.vscode/html-data.json` and updates `.vscode/settings.json` with:

   ```json
   {
     "html.customData": ["./html-data.json"]
   }
   ```

3. Open a `.html` file in VS Code to see autocompletion for `shadcn-*` tags and their attributes.

## Development

### Prerequisites

- Node.js >= 20
- npm >= 9
- Git (for submodule management)

### Setup

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd shadcn-web-components
   ```

2. Initialize the `shadcn-svelte` submodule:

   ```bash
   git submodule init
   git submodule update
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

### Building

The build process generates individual component packages in `dist/<component-name>` and the root package in `dist`.

To generate wrappers, types, and build components:

```bash
node scripts/generate-wrappers.js
```

To generate README files:

```bash
npm run build
```

To copy additional types (if needed):

```bash
node scripts/copy-types.js
```

For a full build sequence:

```bash
npm run a
```

This runs:
- `scripts/generate-wrappers.js`: Generates component files, TypeScript definitions, and `html-data.json`, and builds each component individually using Vite.
- `scripts/generate-readmes.js`: Generates README files for components and root.
- `scripts/copy-types.js`: Copies `package.json`, `index.d.ts`, and `html-data.json` to `dist` folders.

The output includes:
- `dist/<component-name>/index.js`: Compiled web component.
- `dist/<component-name>/index.js.map`: Source map.
- `dist/<component-name>/index.d.ts`: TypeScript definitions.
- `dist/<component-name>/html-data.json`: Custom element metadata.
- `dist/<component-name>/package.json`: npm package configuration.
- `dist/<component-name>/README.md`: Component-specific documentation.
- `dist/package.json`, `dist/index.js`, `dist/types.d.ts`, `dist/html-data.json`, `dist/README.md`: Root package (`@shcnwc/shadcn-web-components`).

### Scripts

- `npm run dev`: Start the development server (uses `vite.config.ts`).
- `npm run a`: Full build (wrappers, READMEs, copy types).
- `npm run build`: Generate READMEs only.
- `npm run setup`: Configure VS Code for custom element autocompletion.
- `npm run preview`: Preview the built components.
- `npm run check`: Run Svelte type checking.
- `npm run lint`: Run ESLint.

### Publishing

The project uses `semantic-release` to publish packages to npm. Ensure `NPM_TOKEN` and `GH_TOKEN` are set in your CI environment (e.g., GitHub Actions).

To manually publish all packages for testing:

```bash
node scripts/publish-sub.js
```

This publishes the root package and all sub-component packages.

## Troubleshooting

- **Large Bundle Sizes**: Components like `drawer` may have large bundles (~1 MB) due to dependencies like `vaul-svelte`. Ensure `sideEffects: false` is set in `package.json` files and verify tree-shaking in Vite.
- **Missing Components**: If components listed in `component-props.json` are not built, check the build log for `Skipping component` messages. Ensure corresponding `.svelte` files exist in `src/shadcn-svelte/docs/src/lib/registry/ui`.
- **Svelte Warnings**: If warnings about `...restProps` appear, verify that `<svelte:options customElement>` includes all props from `component-props.json`. The build script automatically injects these props.
- **VS Code Autocompletion**: If autocompletion doesn’t work, ensure `.vscode/settings.json` includes `"html.customData": ["./html-data.json"]` and that `dist/html-data.json` was generated.

## Contributing

1. Fork the repository.
2. Create a branch (`git checkout -b feature/your-feature`).
3. Make changes and commit (`git commit -m "Add your feature"`).
4. Push to your fork (`git push origin feature/your-feature`).
5. Open a pull request.

Please ensure your changes:
- Do not modify the `src/shadcn-svelte` submodule directly (use `git submodule update --remote` to sync).
- Update `component-props.json` for new components or props.
- Run `npm run lint` and `npm run check` before committing.

## License

MIT License. See [LICENSE](./LICENSE) for details.