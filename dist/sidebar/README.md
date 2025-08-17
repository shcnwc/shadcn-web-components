# Sidebar

A composable, themeable and customizable sidebar component.

[![NPM Version](https://img.shields.io/npm/v/@shcnwc/shadcn-sidebar-web-component.svg)](https://www.npmjs.com/package/@shcnwc/shadcn-sidebar-web-component)
[![Package Size](https://img.badgesize.io/https://unpkg.com/@shcnwc/shadcn-sidebar-web-component/index.js?compression=gzip)](https://www.npmjs.com/package/@shcnwc/shadcn-sidebar-web-component)
[![License](https://img.shields.io/npm/l/@shcnwc/shadcn-sidebar-web-component.svg)](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)


## Installation

```bash
npm install @shcnwc/shadcn-sidebar-web-component
```

## Usage

```html
<script type="module">
  import "@shcnwc/shadcn-sidebar-web-component";
</script>

showlinenumbers title="src/routes/+layout-svelte"


<sidebar-provider>
  <appsidebar />
  <main>
    <sidebar-trigger />
    {@render children?-()}
  </main>
</sidebar-provider>
```

## Links

- [Source Code](https://github.com/shcnwc/shadcn-web-components/tree/main/dist/sidebar)
- [Documentation](https://github.com/shcnwc/shadcn-web-components)
- [License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)

## Contributing

Contributions are welcome! Please open an issue or pull request on [GitHub](https://github.com/shcnwc/shadcn-web-components).

## License

This project is licensed under the [MIT License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE).
