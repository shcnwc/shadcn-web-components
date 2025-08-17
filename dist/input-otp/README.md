# Input OTP

Accessible one-time password component with copy paste functionality.

[![NPM Version](https://img.shields.io/npm/v/@shcnwc/shadcn-input-otp-web-component.svg)](https://www.npmjs.com/package/@shcnwc/shadcn-input-otp-web-component)
[![Package Size](https://img.badgesize.io/https://unpkg.com/@shcnwc/shadcn-input-otp-web-component/index.js?compression=gzip)](https://www.npmjs.com/package/@shcnwc/shadcn-input-otp-web-component)
[![License](https://img.shields.io/npm/l/@shcnwc/shadcn-input-otp-web-component.svg)](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)


## Installation

```bash
npm install @shcnwc/shadcn-input-otp-web-component
```

## Usage

```html
<script type="module">
  import "@shcnwc/shadcn-input-otp-web-component";
</script>

<inputotp-root maxlength={6}>
  {#snippet children({ cells })}
    <inputotp-group>
      {#each cells-slice(0, 3) as cell}
        <inputotp-slot {cell} />
      {/each}
    </inputotp-group>
    <inputotp-separator />
    <inputotp-group>
      {#each cells-slice(3, 6) as cell}
        <inputotp-slot {cell} />
      {/each}
    </inputotp-group>
  {/snippet}
</inputotp-root>
```

## Links

- [Source Code](https://github.com/shcnwc/shadcn-web-components/tree/main/dist/input-otp)
- [Documentation](https://github.com/shcnwc/shadcn-web-components)
- [License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE)

## Contributing

Contributions are welcome! Please open an issue or pull request on [GitHub](https://github.com/shcnwc/shadcn-web-components).

## License

This project is licensed under the [MIT License](https://github.com/shcnwc/shadcn-web-components/blob/main/LICENSE).
