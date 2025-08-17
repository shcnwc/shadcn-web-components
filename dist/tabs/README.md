# Tabs

A set of layered sections of content—known as tab panels—that are displayed one at a time.

[![NPM Version](https://img.shields.io/npm/v/@shcnwc/shadcn-tabs-web-component.svg)](https://www.npmjs.com/package/@shcnwc/shadcn-tabs-web-component)
[![Package Size](https://img.badgesize.io/https://unpkg.com/@shcnwc/shadcn-tabs-web-component/index.js?compression=gzip)](https://www.npmjs.com/package/@shcnwc/shadcn-tabs-web-component)
[![License](https://img.shields.io/npm/l/@shcnwc/shadcn-tabs-web-component.svg)](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)


## Installation

```bash
npm install @shcnwc/shadcn-tabs-web-component
```

## Usage

```html
<script type="module">
  import "@shcnwc/shadcn-tabs-web-component";
</script>

<tabs-root value="account" class="w-[400px]">
  <tabs-list>
    <tabs-trigger value="account">account</tabs-trigger>
    <tabs-trigger value="password">password</tabs-trigger>
  </tabs-list>
  <tabs-content value="account">
    make changes to your account here-
  </tabs-content>
  <tabs-content value="password">change your password here-</tabs-content>
</tabs-root>
```

## Links

- [Source Code](https://github.com/shcnwc/shadcn-web-components/tree/main/dist/tabs)
- [Documentation](https://github.com/shcnwc/shadcn-web-components)
- [License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)

## Contributing

Contributions are welcome! Please open an issue or pull request on [GitHub](https://github.com/shcnwc/shadcn-web-components).

## License

This project is licensed under the [MIT License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE).
