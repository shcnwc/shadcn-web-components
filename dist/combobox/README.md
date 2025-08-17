# Combobox

Autocomplete input and command palette with a list of suggestions.

[![NPM Version](https://img.shields.io/npm/v/@shcnwc/shadcn-combobox-web-component.svg)](https://www.npmjs.com/package/@shcnwc/shadcn-combobox-web-component)
[![Package Size](https://img.badgesize.io/https://unpkg.com/@shcnwc/shadcn-combobox-web-component/index.js?compression=gzip)](https://www.npmjs.com/package/@shcnwc/shadcn-combobox-web-component)
[![License](https://img.shields.io/npm/l/@shcnwc/shadcn-combobox-web-component.svg)](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)


## Installation

```bash
npm install @shcnwc/shadcn-combobox-web-component
```

## Usage

```html
<script type="module">
  import "@shcnwc/shadcn-combobox-web-component";
</script>

<popover-root bind:open>
  <popover-trigger bind:ref={triggerref}>
    {#snippet child({ props })}
      <button
        variant="outline"
        class="w-[200px] justify-between"
        {---props}
        role="combobox"
        aria-expanded={open}
      >
        {selectedvalue || "select a framework---"}
        <chevronsupdownicon class="ml-2 size-4 shrink-0 opacity-50" />
      </button>
    {/snippet}
  </popover-trigger>
  <popover-content class="w-[200px] p-0">
    <command-root>
      <command-input placeholder="search framework---" />
      <command-list>
        <command-empty>no framework found-</command-empty>
        <command-group>
          {#each frameworks as framework}
            <command-item
              value={framework-value}
              onselect={() => {
                value = framework-value;
                closeandfocustrigger();
              }}
            >
              <checkicon
                class={cn(
                  "mr-2 size-4",
                  value !== framework-value && "text-transparent"
                )}
              />
              {framework-label}
            </command-item>
          {/each}
        </command-group>
      </command-list>
    </command-root>
  </popover-content>
</popover-root>
```

## Links

- [Source Code](https://github.com/shcnwc/shadcn-web-components/tree/main/dist/combobox)
- [Documentation](https://github.com/shcnwc/shadcn-web-components)
- [License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)

## Contributing

Contributions are welcome! Please open an issue or pull request on [GitHub](https://github.com/shcnwc/shadcn-web-components).

## License

This project is licensed under the [MIT License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE).
