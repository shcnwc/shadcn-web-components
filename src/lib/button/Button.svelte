<svelte:options
  customElement="shadcn-button"
/>

<script>
  import { Button } from '../../shadcn-svelte/docs/src/lib/registry/ui/button';

  export let variant = 'default';
  export let size = 'default';
  export let disabled = false;
</script>

<Button {variant} {size} {disabled} {...$$restProps}>
  <slot />
</Button>