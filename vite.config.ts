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
 'avatar': resolve(__dirname, 'src/lib/avatar/index.ts'),
 'avatar-fallback': resolve(__dirname, 'src/lib/avatar-fallback/index.ts'),
 'avatar-image': resolve(__dirname, 'src/lib/avatar-image/index.ts'),
 'badge': resolve(__dirname, 'src/lib/badge/index.ts'),
 'button': resolve(__dirname, 'src/lib/button/index.ts'),
 'checkbox': resolve(__dirname, 'src/lib/checkbox/index.ts'),
 'input': resolve(__dirname, 'src/lib/input/index.ts'),
 'label': resolve(__dirname, 'src/lib/label/index.ts'),
 'progress': resolve(__dirname, 'src/lib/progress/index.ts'),
 'separator': resolve(__dirname, 'src/lib/separator/index.ts'),
 'shadcn-web-components': resolve(__dirname, 'src/index.js'),
 'skeleton': resolve(__dirname, 'src/lib/skeleton/index.ts'),
 'switch': resolve(__dirname, 'src/lib/switch/index.ts'),
 'tabs': resolve(__dirname, 'src/lib/tabs/index.ts'),
 'tabs-content': resolve(__dirname, 'src/lib/tabs-content/index.ts'),
 'tabs-list': resolve(__dirname, 'src/lib/tabs-list/index.ts'),
 'tabs-trigger': resolve(__dirname, 'src/lib/tabs-trigger/index.ts'),
 'textarea': resolve(__dirname, 'src/lib/textarea/index.ts')
 },
      formats: ['es']
    },
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: '[name].js'
      }
    }
  }
});