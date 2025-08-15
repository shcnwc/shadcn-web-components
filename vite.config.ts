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
        "scripts/**/*",
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