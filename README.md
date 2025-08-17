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

## Components

- [Accordion](https://www.npmjs.com/package/@shcnwc/shadcn-accordion-web-component) - A vertically stacked set of interactive headings that each reveal a section of content.
- [Alert Dialog](https://www.npmjs.com/package/@shcnwc/shadcn-alert-dialog-web-component) - A modal dialog that interrupts the user with important content and expects a response.
- [Alert](https://www.npmjs.com/package/@shcnwc/shadcn-alert-web-component) - Displays a callout for user attention.
- [Aspect Ratio](https://www.npmjs.com/package/@shcnwc/shadcn-aspect-ratio-web-component) - Displays content within a desired ratio.
- [Avatar](https://www.npmjs.com/package/@shcnwc/shadcn-avatar-web-component) - An image element with a fallback for representing the user.
- [Badge](https://www.npmjs.com/package/@shcnwc/shadcn-badge-web-component) - Displays a badge or a component that looks like a badge.
- [Breadcrumb](https://www.npmjs.com/package/@shcnwc/shadcn-breadcrumb-web-component) - Displays the path to the current resource using a hierarchy of links.
- [Button](https://www.npmjs.com/package/@shcnwc/shadcn-button-web-component) - Displays a button or a component that looks like a button.
- [Calendar](https://www.npmjs.com/package/@shcnwc/shadcn-calendar-web-component) - A calendar component that allows users to select dates.
- [Card](https://www.npmjs.com/package/@shcnwc/shadcn-card-web-component) - Displays a card with header, content, and footer.
- [Carousel](https://www.npmjs.com/package/@shcnwc/shadcn-carousel-web-component) - A carousel with motion and swipe built using Embla.
- [Chart](https://www.npmjs.com/package/@shcnwc/shadcn-chart-web-component) - Beautiful charts. Built using LayerChart. Copy and paste into your apps.
- [Checkbox](https://www.npmjs.com/package/@shcnwc/shadcn-checkbox-web-component) - A control that allows the user to toggle between checked and not checked.
- [Collapsible](https://www.npmjs.com/package/@shcnwc/shadcn-collapsible-web-component) - An interactive component which expands/collapses a panel.
- [Combobox](https://www.npmjs.com/package/@shcnwc/shadcn-combobox-web-component) - Autocomplete input and command palette with a list of suggestions.
- [Command](https://www.npmjs.com/package/@shcnwc/shadcn-command-web-component) - Fast, composable, unstyled command menu for Svelte.
- [Context Menu](https://www.npmjs.com/package/@shcnwc/shadcn-context-menu-web-component) - Displays a menu to the user — such as a set of actions or functions — triggered by right click.
- [Data Table](https://www.npmjs.com/package/@shcnwc/shadcn-data-table-web-component) - Powerful table and datagrids built using TanStack Table.
- [Date Picker](https://www.npmjs.com/package/@shcnwc/shadcn-date-picker-web-component) - A date picker component with range and presets.
- [Dialog](https://www.npmjs.com/package/@shcnwc/shadcn-dialog-web-component) - A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.
- [Drawer](https://www.npmjs.com/package/@shcnwc/shadcn-drawer-web-component) - A drawer component for Svelte.
- [Dropdown Menu](https://www.npmjs.com/package/@shcnwc/shadcn-dropdown-menu-web-component) - Displays a menu to the user — such as a set of actions or functions — triggered by a button.
- [Hover Card](https://www.npmjs.com/package/@shcnwc/shadcn-hover-card-web-component) - For sighted users to preview content available behind a link.
- [Input OTP](https://www.npmjs.com/package/@shcnwc/shadcn-input-otp-web-component) - Accessible one-time password component with copy paste functionality.
- [Input](https://www.npmjs.com/package/@shcnwc/shadcn-input-web-component) - Displays a form input field or a component that looks like an input field.
- [Label](https://www.npmjs.com/package/@shcnwc/shadcn-label-web-component) - Renders an accessible label associated with controls.
- [Menubar](https://www.npmjs.com/package/@shcnwc/shadcn-menubar-web-component) - A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.
- [Navigation Menu](https://www.npmjs.com/package/@shcnwc/shadcn-navigation-menu-web-component) - A collection of links for navigating websites.
- [Pagination](https://www.npmjs.com/package/@shcnwc/shadcn-pagination-web-component) - Pagination with page navigation, next and previous links.
- [Popover](https://www.npmjs.com/package/@shcnwc/shadcn-popover-web-component) - Displays rich content in a portal, triggered by a button.
- [Progress](https://www.npmjs.com/package/@shcnwc/shadcn-progress-web-component) - Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.
- [Radio Group](https://www.npmjs.com/package/@shcnwc/shadcn-radio-group-web-component) - A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.
- [Range Calendar](https://www.npmjs.com/package/@shcnwc/shadcn-range-calendar-web-component) - A calendar component that allows users to select a range of dates.
- [Scroll Area](https://www.npmjs.com/package/@shcnwc/shadcn-scroll-area-web-component) - Augments native scroll functionality for custom, cross-browser styling.
- [Select](https://www.npmjs.com/package/@shcnwc/shadcn-select-web-component) - Displays a list of options for the user to pick from—triggered by a button.
- [Separator](https://www.npmjs.com/package/@shcnwc/shadcn-separator-web-component) - Visually or semantically separates content.
- [Sheet](https://www.npmjs.com/package/@shcnwc/shadcn-sheet-web-component) - Extends the Dialog component to display content that complements the main content of the screen.
- [Sidebar](https://www.npmjs.com/package/@shcnwc/shadcn-sidebar-web-component) - A composable, themeable and customizable sidebar component.
- [Skeleton](https://www.npmjs.com/package/@shcnwc/shadcn-skeleton-web-component) - Use to show a placeholder while content is loading.
- [Slider](https://www.npmjs.com/package/@shcnwc/shadcn-slider-web-component) - An input where the user selects a value from within a given range.
- [Switch](https://www.npmjs.com/package/@shcnwc/shadcn-switch-web-component) - A control that allows the user to toggle between checked and not checked.
- [Table](https://www.npmjs.com/package/@shcnwc/shadcn-table-web-component) - A responsive table component.
- [Tabs](https://www.npmjs.com/package/@shcnwc/shadcn-tabs-web-component) - A set of layered sections of content—known as tab panels—that are displayed one at a time.
- [Textarea](https://www.npmjs.com/package/@shcnwc/shadcn-textarea-web-component) - Displays a form textarea or a component that looks like a textarea.
- [Toggle Group](https://www.npmjs.com/package/@shcnwc/shadcn-toggle-group-web-component) - A set of two-state buttons that can be toggled on or off.
- [Toggle](https://www.npmjs.com/package/@shcnwc/shadcn-toggle-web-component) - A two-state button that can be either on or off.
- [Tooltip](https://www.npmjs.com/package/@shcnwc/shadcn-tooltip-web-component) - A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

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
<script type="module">
  import '@shcnwc/shadcn-button-web-component';
</script>

<shadcn-button variant="primary" onclick="alert('Clicked!')">Click Me</shadcn-button>
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

For a full build sequence:

```bash
npm run build
```

To generate wrappers, types, and build components:

```bash
node scripts/generate-wrappers.js
```

To copy additional types (if needed):

```bash
node scripts/copy-types.js
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

- `npm run build`: Full build (wrappers, READMEs, copy types).
- `npm run setup`: Configure VS Code for custom element autocompletion.

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