# Dialog

A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.

[![NPM Version](https://img.shields.io/npm/v/@shcnwc/shadcn-dialog-web-component.svg)](https://www.npmjs.com/package/@shcnwc/shadcn-dialog-web-component)
[![Package Size](https://img.badgesize.io/https://unpkg.com/@shcnwc/shadcn-dialog-web-component/index.js?compression=gzip)](https://www.npmjs.com/package/@shcnwc/shadcn-dialog-web-component)
[![License](https://img.shields.io/npm/l/@shcnwc/shadcn-dialog-web-component.svg)](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)


## Installation

```bash
npm install @shcnwc/shadcn-dialog-web-component
```

## Usage

```html
<script type="module">
  import "@shcnwc/shadcn-dialog-web-component";
</script>

<dialog-root>
  <dialog-trigger>open</dialog-trigger>
  <dialog-content>
    <dialog-header>
      <dialog-title>are you sure absolutely sure?</dialog-title>
      <dialog-description>
        this action cannot be undone- this will permanently delete your account
        and remove your data from our servers-
      </dialog-description>
    </dialog-header>
  </dialog-content>
</dialog-root>
```

## Links

- [Source Code](https://github.com/shcnwc/shadcn-web-components/tree/main/dist/dialog)
- [Documentation](https://github.com/shcnwc/shadcn-web-components)
- [License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)

## Contributing

Contributions are welcome! Please open an issue or pull request on [GitHub](https://github.com/shcnwc/shadcn-web-components).

## License

This project is licensed under the [MIT License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE).
