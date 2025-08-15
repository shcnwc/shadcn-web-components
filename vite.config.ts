// vite.config.js
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true
      },
      include: [
        'src/**/*.svelte',
        'src/shadcn-svelte/docs/src/lib/registry/ui/**/*.svelte'
      ],
      exclude: [
        'src/shadcn-svelte/apps/**/*',
        'src/shadcn-svelte/docs/src/lib/registry/examples/**/*'
      ]
    }),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '$lib': resolve(__dirname, 'src/shadcn-svelte/docs/src/lib')  // Map $lib to submodule's lib
    }
  },
  build: {
    lib: {
      entry: {
 'accordion': resolve(__dirname, 'src/lib/accordion/index.ts'),
 'accordion-content': resolve(__dirname, 'src/lib/accordion-content/index.ts'),
 'accordion-item': resolve(__dirname, 'src/lib/accordion-item/index.ts'),
 'accordion-trigger': resolve(__dirname, 'src/lib/accordion-trigger/index.ts'),
 'alert': resolve(__dirname, 'src/lib/alert/index.ts'),
 'alert-description': resolve(__dirname, 'src/lib/alert-description/index.ts'),
 'alert-title': resolve(__dirname, 'src/lib/alert-title/index.ts'),
 'aspect-ratio': resolve(__dirname, 'src/lib/aspect-ratio/index.ts'),
 'avatar': resolve(__dirname, 'src/lib/avatar/index.ts'),
 'avatar-fallback': resolve(__dirname, 'src/lib/avatar-fallback/index.ts'),
 'avatar-image': resolve(__dirname, 'src/lib/avatar-image/index.ts'),
 'badge': resolve(__dirname, 'src/lib/badge/index.ts'),
 'breadcrumb': resolve(__dirname, 'src/lib/breadcrumb/index.ts'),
 'breadcrumb-ellipsis': resolve(__dirname, 'src/lib/breadcrumb-ellipsis/index.ts'),
 'breadcrumb-item': resolve(__dirname, 'src/lib/breadcrumb-item/index.ts'),
 'breadcrumb-link': resolve(__dirname, 'src/lib/breadcrumb-link/index.ts'),
 'breadcrumb-list': resolve(__dirname, 'src/lib/breadcrumb-list/index.ts'),
 'breadcrumb-page': resolve(__dirname, 'src/lib/breadcrumb-page/index.ts'),
 'breadcrumb-separator': resolve(__dirname, 'src/lib/breadcrumb-separator/index.ts'),
 'button': resolve(__dirname, 'src/lib/button/index.ts'),
 'calendar': resolve(__dirname, 'src/lib/calendar/index.ts'),
 'card': resolve(__dirname, 'src/lib/card/index.ts'),
 'card-content': resolve(__dirname, 'src/lib/card-content/index.ts'),
 'card-description': resolve(__dirname, 'src/lib/card-description/index.ts'),
 'card-footer': resolve(__dirname, 'src/lib/card-footer/index.ts'),
 'card-header': resolve(__dirname, 'src/lib/card-header/index.ts'),
 'card-title': resolve(__dirname, 'src/lib/card-title/index.ts'),
 'carousel': resolve(__dirname, 'src/lib/carousel/index.ts'),
 'carousel-content': resolve(__dirname, 'src/lib/carousel-content/index.ts'),
 'carousel-item': resolve(__dirname, 'src/lib/carousel-item/index.ts'),
 'carousel-next': resolve(__dirname, 'src/lib/carousel-next/index.ts'),
 'carousel-previous': resolve(__dirname, 'src/lib/carousel-previous/index.ts'),
 'checkbox': resolve(__dirname, 'src/lib/checkbox/index.ts'),
 'collapsible': resolve(__dirname, 'src/lib/collapsible/index.ts'),
 'collapsible-content': resolve(__dirname, 'src/lib/collapsible-content/index.ts'),
 'collapsible-trigger': resolve(__dirname, 'src/lib/collapsible-trigger/index.ts'),
 'command': resolve(__dirname, 'src/lib/command/index.ts'),
 'command-dialog': resolve(__dirname, 'src/lib/command-dialog/index.ts'),
 'command-empty': resolve(__dirname, 'src/lib/command-empty/index.ts'),
 'command-group': resolve(__dirname, 'src/lib/command-group/index.ts'),
 'command-input': resolve(__dirname, 'src/lib/command-input/index.ts'),
 'command-item': resolve(__dirname, 'src/lib/command-item/index.ts'),
 'command-list': resolve(__dirname, 'src/lib/command-list/index.ts'),
 'command-separator': resolve(__dirname, 'src/lib/command-separator/index.ts'),
 'command-shortcut': resolve(__dirname, 'src/lib/command-shortcut/index.ts'),
 'drawer': resolve(__dirname, 'src/lib/drawer/index.ts'),
 'drawer-close': resolve(__dirname, 'src/lib/drawer-close/index.ts'),
 'drawer-content': resolve(__dirname, 'src/lib/drawer-content/index.ts'),
 'drawer-description': resolve(__dirname, 'src/lib/drawer-description/index.ts'),
 'drawer-footer': resolve(__dirname, 'src/lib/drawer-footer/index.ts'),
 'drawer-header': resolve(__dirname, 'src/lib/drawer-header/index.ts'),
 'drawer-overlay': resolve(__dirname, 'src/lib/drawer-overlay/index.ts'),
 'drawer-title': resolve(__dirname, 'src/lib/drawer-title/index.ts'),
 'drawer-trigger': resolve(__dirname, 'src/lib/drawer-trigger/index.ts'),
 'input': resolve(__dirname, 'src/lib/input/index.ts'),
 'input-otp': resolve(__dirname, 'src/lib/input-otp/index.ts'),
 'input-otp-group': resolve(__dirname, 'src/lib/input-otp-group/index.ts'),
 'input-otp-separator': resolve(__dirname, 'src/lib/input-otp-separator/index.ts'),
 'input-otp-slot': resolve(__dirname, 'src/lib/input-otp-slot/index.ts'),
 'label': resolve(__dirname, 'src/lib/label/index.ts'),
 'menubar': resolve(__dirname, 'src/lib/menubar/index.ts'),
 'menubar-checkbox-item': resolve(__dirname, 'src/lib/menubar-checkbox-item/index.ts'),
 'menubar-content': resolve(__dirname, 'src/lib/menubar-content/index.ts'),
 'menubar-item': resolve(__dirname, 'src/lib/menubar-item/index.ts'),
 'menubar-label': resolve(__dirname, 'src/lib/menubar-label/index.ts'),
 'menubar-radio-item': resolve(__dirname, 'src/lib/menubar-radio-item/index.ts'),
 'menubar-separator': resolve(__dirname, 'src/lib/menubar-separator/index.ts'),
 'menubar-shortcut': resolve(__dirname, 'src/lib/menubar-shortcut/index.ts'),
 'menubar-sub-content': resolve(__dirname, 'src/lib/menubar-sub-content/index.ts'),
 'menubar-sub-trigger': resolve(__dirname, 'src/lib/menubar-sub-trigger/index.ts'),
 'menubar-trigger': resolve(__dirname, 'src/lib/menubar-trigger/index.ts'),
 'navigation-menu': resolve(__dirname, 'src/lib/navigation-menu/index.ts'),
 'navigation-menu-content': resolve(__dirname, 'src/lib/navigation-menu-content/index.ts'),
 'navigation-menu-indicator': resolve(__dirname, 'src/lib/navigation-menu-indicator/index.ts'),
 'navigation-menu-item': resolve(__dirname, 'src/lib/navigation-menu-item/index.ts'),
 'navigation-menu-link': resolve(__dirname, 'src/lib/navigation-menu-link/index.ts'),
 'navigation-menu-list': resolve(__dirname, 'src/lib/navigation-menu-list/index.ts'),
 'navigation-menu-trigger': resolve(__dirname, 'src/lib/navigation-menu-trigger/index.ts'),
 'navigation-menu-viewport': resolve(__dirname, 'src/lib/navigation-menu-viewport/index.ts'),
 'pagination': resolve(__dirname, 'src/lib/pagination/index.ts'),
 'pagination-content': resolve(__dirname, 'src/lib/pagination-content/index.ts'),
 'pagination-ellipsis': resolve(__dirname, 'src/lib/pagination-ellipsis/index.ts'),
 'pagination-item': resolve(__dirname, 'src/lib/pagination-item/index.ts'),
 'pagination-link': resolve(__dirname, 'src/lib/pagination-link/index.ts'),
 'progress': resolve(__dirname, 'src/lib/progress/index.ts'),
 'radio-group': resolve(__dirname, 'src/lib/radio-group/index.ts'),
 'radio-group-item': resolve(__dirname, 'src/lib/radio-group-item/index.ts'),
 'range-calendar': resolve(__dirname, 'src/lib/range-calendar/index.ts'),
 'scroll-area': resolve(__dirname, 'src/lib/scroll-area/index.ts'),
 'separator': resolve(__dirname, 'src/lib/separator/index.ts'),
 'shadcn-web-components': resolve(__dirname, 'src/index.js'),
 'sidebar': resolve(__dirname, 'src/lib/sidebar/index.ts'),
 'sidebar-content': resolve(__dirname, 'src/lib/sidebar-content/index.ts'),
 'sidebar-footer': resolve(__dirname, 'src/lib/sidebar-footer/index.ts'),
 'sidebar-group': resolve(__dirname, 'src/lib/sidebar-group/index.ts'),
 'sidebar-group-action': resolve(__dirname, 'src/lib/sidebar-group-action/index.ts'),
 'sidebar-group-content': resolve(__dirname, 'src/lib/sidebar-group-content/index.ts'),
 'sidebar-group-label': resolve(__dirname, 'src/lib/sidebar-group-label/index.ts'),
 'sidebar-header': resolve(__dirname, 'src/lib/sidebar-header/index.ts'),
 'sidebar-inset': resolve(__dirname, 'src/lib/sidebar-inset/index.ts'),
 'sidebar-menu': resolve(__dirname, 'src/lib/sidebar-menu/index.ts'),
 'sidebar-menu-action': resolve(__dirname, 'src/lib/sidebar-menu-action/index.ts'),
 'sidebar-menu-badge': resolve(__dirname, 'src/lib/sidebar-menu-badge/index.ts'),
 'sidebar-menu-button': resolve(__dirname, 'src/lib/sidebar-menu-button/index.ts'),
 'sidebar-menu-item': resolve(__dirname, 'src/lib/sidebar-menu-item/index.ts'),
 'sidebar-menu-skeleton': resolve(__dirname, 'src/lib/sidebar-menu-skeleton/index.ts'),
 'sidebar-menu-sub': resolve(__dirname, 'src/lib/sidebar-menu-sub/index.ts'),
 'sidebar-menu-sub-button': resolve(__dirname, 'src/lib/sidebar-menu-sub-button/index.ts'),
 'sidebar-menu-sub-item': resolve(__dirname, 'src/lib/sidebar-menu-sub-item/index.ts'),
 'sidebar-provider': resolve(__dirname, 'src/lib/sidebar-provider/index.ts'),
 'sidebar-rail': resolve(__dirname, 'src/lib/sidebar-rail/index.ts'),
 'sidebar-separator': resolve(__dirname, 'src/lib/sidebar-separator/index.ts'),
 'sidebar-trigger': resolve(__dirname, 'src/lib/sidebar-trigger/index.ts'),
 'skeleton': resolve(__dirname, 'src/lib/skeleton/index.ts'),
 'slider': resolve(__dirname, 'src/lib/slider/index.ts'),
 'switch': resolve(__dirname, 'src/lib/switch/index.ts'),
 'table': resolve(__dirname, 'src/lib/table/index.ts'),
 'table-body': resolve(__dirname, 'src/lib/table-body/index.ts'),
 'table-caption': resolve(__dirname, 'src/lib/table-caption/index.ts'),
 'table-cell': resolve(__dirname, 'src/lib/table-cell/index.ts'),
 'table-footer': resolve(__dirname, 'src/lib/table-footer/index.ts'),
 'table-head': resolve(__dirname, 'src/lib/table-head/index.ts'),
 'table-header': resolve(__dirname, 'src/lib/table-header/index.ts'),
 'table-row': resolve(__dirname, 'src/lib/table-row/index.ts'),
 'tabs': resolve(__dirname, 'src/lib/tabs/index.ts'),
 'tabs-content': resolve(__dirname, 'src/lib/tabs-content/index.ts'),
 'tabs-list': resolve(__dirname, 'src/lib/tabs-list/index.ts'),
 'tabs-trigger': resolve(__dirname, 'src/lib/tabs-trigger/index.ts'),
 'textarea': resolve(__dirname, 'src/lib/textarea/index.ts'),
 'toggle': resolve(__dirname, 'src/lib/toggle/index.ts'),
 'toggle-group': resolve(__dirname, 'src/lib/toggle-group/index.ts'),
 'toggle-group-item': resolve(__dirname, 'src/lib/toggle-group-item/index.ts')
 },
      formats: ['es']
    },
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      preserveEntrySignatures: 'strict',
      output: {
        entryFileNames: (chunk) => {
          // put each entry at dist/<entry>/index.js
          return `${chunk.name}/index.js`;
        },
      }
    }
  }
});