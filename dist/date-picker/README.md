# Date Picker

A date picker component with range and presets.

[![NPM Version](https://img.shields.io/npm/v/@shcnwc/shadcn-date-picker-web-component.svg)](https://www.npmjs.com/package/@shcnwc/shadcn-date-picker-web-component)
[![Package Size](https://img.badgesize.io/https://unpkg.com/@shcnwc/shadcn-date-picker-web-component/index.js?compression=gzip)](https://www.npmjs.com/package/@shcnwc/shadcn-date-picker-web-component)
[![License](https://img.shields.io/npm/l/@shcnwc/shadcn-date-picker-web-component.svg)](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)


## Installation

```bash
npm install @shcnwc/shadcn-date-picker-web-component
```

## Usage

```html
<script type="module">
  import "@shcnwc/shadcn-date-picker-web-component";
</script>

<popover-root>
  <popover-trigger>
    {#snippet child({ props })}
      <button
        variant="outline"
        class={cn(
          "w-[280px] justify-start text-left font-normal",
          !value && "text-muted-foreground"
        )}
        {---props}
      >
        <calendaricon class="mr-2 size-4" />
        {value ? df-format(value-todate(getlocaltimezone())) : "select a date"}
      </button>
    {/snippet}
  </popover-trigger>
  <popover-content class="w-auto p-0">
    <calendar bind:value type="single" initialfocus />
  </popover-content>
</popover-root>
```

## Links

- [Source Code](https://github.com/shcnwc/shadcn-web-components/tree/main/dist/date-picker)
- [Documentation](https://github.com/shcnwc/shadcn-web-components)
- [License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)

## Contributing

Contributions are welcome! Please open an issue or pull request on [GitHub](https://github.com/shcnwc/shadcn-web-components).

## License

This project is licensed under the [MIT License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE).
