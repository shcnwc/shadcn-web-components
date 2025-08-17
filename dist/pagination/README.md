# Pagination

Pagination with page navigation, next and previous links.

[![NPM Version](https://img.shields.io/npm/v/@shcnwc/shadcn-pagination-web-component.svg)](https://www.npmjs.com/package/@shcnwc/shadcn-pagination-web-component)
[![Package Size](https://img.badgesize.io/https://unpkg.com/@shcnwc/shadcn-pagination-web-component/index.js?compression=gzip)](https://www.npmjs.com/package/@shcnwc/shadcn-pagination-web-component)
[![License](https://img.shields.io/npm/l/@shcnwc/shadcn-pagination-web-component.svg)](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)


## Installation

```bash
npm install @shcnwc/shadcn-pagination-web-component
```

## Usage

```html
<script type="module">
  import "@shcnwc/shadcn-pagination-web-component";
</script>

<pagination-root count={100} perpage={10}>
  {#snippet children({ pages, currentpage })}
    <pagination-content>
      <pagination-item>
        <pagination-prevbutton />
      </pagination-item>
      {#each pages as page (page-key)}
        {#if page-type === "ellipsis"}
          <pagination-item>
            <pagination-ellipsis />
          </pagination-item>
        {:else}
          <pagination-item>
            <pagination-link {page} isactive={currentpage === page-value}>
              {page-value}
            </pagination-link>
          </pagination-item>
        {/if}
      {/each}
      <pagination-item>
        <pagination-nextbutton />
      </pagination-item>
    </pagination-content>
  {/snippet}
</pagination-root>
```

## Links

- [Source Code](https://github.com/shcnwc/shadcn-web-components/tree/main/dist/pagination)
- [Documentation](https://github.com/shcnwc/shadcn-web-components)
- [License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)

## Contributing

Contributions are welcome! Please open an issue or pull request on [GitHub](https://github.com/shcnwc/shadcn-web-components).

## License

This project is licensed under the [MIT License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE).
