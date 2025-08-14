<svelte:options customElement="shadcn-dialog" />

<script>
  import * as Dialog from '../../shadcn-svelte/docs/src/lib/registry/ui/dialog';
  export let open = false;
</script>

<Dialog.Root {open} {...$$restProps}>
  <slot />
</Dialog.Root>