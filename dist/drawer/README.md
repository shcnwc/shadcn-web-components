# Drawer

A drawer component for Svelte.

[![NPM Version](https://img.shields.io/npm/v/@shcnwc/shadcn-drawer-web-component.svg)](https://www.npmjs.com/package/@shcnwc/shadcn-drawer-web-component)
[![Package Size](https://img.badgesize.io/https://unpkg.com/@shcnwc/shadcn-drawer-web-component/index.js?compression=gzip)](https://www.npmjs.com/package/@shcnwc/shadcn-drawer-web-component)
[![License](https://img.shields.io/npm/l/@shcnwc/shadcn-drawer-web-component.svg)](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)


## Installation

```bash
npm install @shcnwc/shadcn-drawer-web-component
```

## Usage

```html
<script type="module">
  import "@shcnwc/shadcn-drawer-web-component";
</script>

<drawer-root>
  <drawer-trigger>open</drawer-trigger>
  <drawer-content>
    <drawer-header>
      <drawer-title>are you sure absolutely sure?</drawer-title>
      <drawer-description>this action cannot be undone-</drawer-description>
    </drawer-header>
    <drawer-footer>
      <button>submit</button>
      <drawer-close>cancel</drawer-close>
    </drawer-footer>
  </drawer-content>
</drawer-root>
```

## Links

- [Source Code](https://github.com/shcnwc/shadcn-web-components/tree/main/dist/drawer)
- [Documentation](https://github.com/shcnwc/shadcn-web-components)
- [License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)

## Contributing

Contributions are welcome! Please open an issue or pull request on [GitHub](https://github.com/shcnwc/shadcn-web-components).

## License

This project is licensed under the [MIT License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE).
