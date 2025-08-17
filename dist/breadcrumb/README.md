# Breadcrumb

Displays the path to the current resource using a hierarchy of links.

[![NPM Version](https://img.shields.io/npm/v/@shcnwc/shadcn-breadcrumb-web-component.svg)](https://www.npmjs.com/package/@shcnwc/shadcn-breadcrumb-web-component)
[![Package Size](https://img.badgesize.io/https://unpkg.com/@shcnwc/shadcn-breadcrumb-web-component/index.js?compression=gzip)](https://www.npmjs.com/package/@shcnwc/shadcn-breadcrumb-web-component)
[![License](https://img.shields.io/npm/l/@shcnwc/shadcn-breadcrumb-web-component.svg)](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)


## Installation

```bash
npm install @shcnwc/shadcn-breadcrumb-web-component
```

## Usage

```html
<script type="module">
  import "@shcnwc/shadcn-breadcrumb-web-component";
</script>

<breadcrumb-root>
  <breadcrumb-list>
    <breadcrumb-item>
      <breadcrumb-link href="/">home</breadcrumb-link>
    </breadcrumb-item>
    <breadcrumb-separator />
    <breadcrumb-item>
      <breadcrumb-link href="/components">components</breadcrumb-link>
    </breadcrumb-item>
    <breadcrumb-separator />
    <breadcrumb-item>
      <breadcrumb-page>breadcrumb</breadcrumb-page>
    </breadcrumb-item>
  </breadcrumb-list>
</breadcrumb-root>
```

## Links

- [Source Code](https://github.com/shcnwc/shadcn-web-components/tree/main/dist/breadcrumb)
- [Documentation](https://github.com/shcnwc/shadcn-web-components)
- [License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)

## Contributing

Contributions are welcome! Please open an issue or pull request on [GitHub](https://github.com/shcnwc/shadcn-web-components).

## License

This project is licensed under the [MIT License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE).
