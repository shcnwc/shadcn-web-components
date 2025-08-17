# Alert Dialog

A modal dialog that interrupts the user with important content and expects a response.

[![NPM Version](https://img.shields.io/npm/v/@shcnwc/shadcn-alert-dialog-web-component.svg)](https://www.npmjs.com/package/@shcnwc/shadcn-alert-dialog-web-component)
[![Package Size](https://img.badgesize.io/https://unpkg.com/@shcnwc/shadcn-alert-dialog-web-component/index.js?compression=gzip)](https://www.npmjs.com/package/@shcnwc/shadcn-alert-dialog-web-component)
[![License](https://img.shields.io/npm/l/@shcnwc/shadcn-alert-dialog-web-component.svg)](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)


## Installation

```bash
npm install @shcnwc/shadcn-alert-dialog-web-component
```

## Usage

```html
<script type="module">
  import "@shcnwc/shadcn-alert-dialog-web-component";
</script>

<alertdialog-root>
  <alertdialog-trigger>open</alertdialog-trigger>
  <alertdialog-content>
    <alertdialog-header>
      <alertdialog-title>are you absolutely sure?</alertdialog-title>
      <alertdialog-description>
        this action cannot be undone- this will permanently delete your account
        and remove your data from our servers-
      </alertdialog-description>
    </alertdialog-header>
    <alertdialog-footer>
      <alertdialog-cancel>cancel</alertdialog-cancel>
      <alertdialog-action>continue</alertdialog-action>
    </alertdialog-footer>
  </alertdialog-content>
</alertdialog-root>
```

## Links

- [Source Code](https://github.com/shcnwc/shadcn-web-components/tree/main/dist/alert-dialog)
- [Documentation](https://github.com/shcnwc/shadcn-web-components)
- [License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)

## Contributing

Contributions are welcome! Please open an issue or pull request on [GitHub](https://github.com/shcnwc/shadcn-web-components).

## License

This project is licensed under the [MIT License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE).
