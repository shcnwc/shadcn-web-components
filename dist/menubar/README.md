# Menubar

A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.

[![NPM Version](https://img.shields.io/npm/v/@shcnwc/shadcn-menubar-web-component.svg)](https://www.npmjs.com/package/@shcnwc/shadcn-menubar-web-component)
[![Package Size](https://img.badgesize.io/https://unpkg.com/@shcnwc/shadcn-menubar-web-component/index.js?compression=gzip)](https://www.npmjs.com/package/@shcnwc/shadcn-menubar-web-component)
[![License](https://img.shields.io/npm/l/@shcnwc/shadcn-menubar-web-component.svg)](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)


## Installation

```bash
npm install @shcnwc/shadcn-menubar-web-component
```

## Usage

```html
<script type="module">
  import "@shcnwc/shadcn-menubar-web-component";
</script>

<menubar-root>
  <menubar-menu>
    <menubar-trigger>file</menubar-trigger>
    <menubar-content>
      <menubar-item>
        new tab
        <menubar-shortcut>⌘t</menubar-shortcut>
      </menubar-item>
      <menubar-item>new window</menubar-item>
      <menubar-separator />
      <menubar-item>share</menubar-item>
      <menubar-separator />
      <menubar-item>print</menubar-item>
    </menubar-content>
  </menubar-menu>
</menubar-root>
```

## Links

- [Source Code](https://github.com/shcnwc/shadcn-web-components/tree/main/dist/menubar)
- [Documentation](https://github.com/shcnwc/shadcn-web-components)
- [License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)

## Contributing

Contributions are welcome! Please open an issue or pull request on [GitHub](https://github.com/shcnwc/shadcn-web-components).

## License

This project is licensed under the [MIT License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE).
