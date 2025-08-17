# Command

Fast, composable, unstyled command menu for Svelte.

[![NPM Version](https://img.shields.io/npm/v/@shcnwc/shadcn-command-web-component.svg)](https://www.npmjs.com/package/@shcnwc/shadcn-command-web-component)
[![Package Size](https://img.badgesize.io/https://unpkg.com/@shcnwc/shadcn-command-web-component/index.js?compression=gzip)](https://www.npmjs.com/package/@shcnwc/shadcn-command-web-component)
[![License](https://img.shields.io/npm/l/@shcnwc/shadcn-command-web-component.svg)](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)


## Installation

```bash
npm install @shcnwc/shadcn-command-web-component
```

## Usage

```html
<script type="module">
  import "@shcnwc/shadcn-command-web-component";
</script>

<command-root>
  <command-input placeholder="type a command or search---" />
  <command-list>
    <command-empty>no results found-</command-empty>
    <command-group heading="suggestions">
      <command-item>calendar</command-item>
      <command-item>search emoji</command-item>
      <command-item>calculator</command-item>
    </command-group>
    <command-separator />
    <command-group heading="settings">
      <command-item>profile</command-item>
      <command-item>billing</command-item>
      <command-item>settings</command-item>
    </command-group>
  </command-list>
</command-root>
```

## Links

- [Source Code](https://github.com/shcnwc/shadcn-web-components/tree/main/dist/command)
- [Documentation](https://github.com/shcnwc/shadcn-web-components)
- [License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)

## Contributing

Contributions are welcome! Please open an issue or pull request on [GitHub](https://github.com/shcnwc/shadcn-web-components).

## License

This project is licensed under the [MIT License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE).
