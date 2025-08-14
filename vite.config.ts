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
        'shadcn-web-components': resolve(__dirname, 'src/index.js'),
        button: resolve(__dirname, 'src/lib/button/index.js'),
        dialog: resolve(__dirname, 'src/lib/dialog/index.js'),
        'dialog-content': resolve(__dirname, 'src/lib/dialog-content/index.js'),
        'dialog-title': resolve(__dirname, 'src/lib/dialog-title/index.js'),
        'dialog-overlay': resolve(__dirname, 'src/lib/dialog-overlay/index.js'),
        'dialog-header': resolve(__dirname, 'src/lib/dialog-header/index.js'),
        'dialog-footer': resolve(__dirname, 'src/lib/dialog-footer/index.js'),
        'dialog-description': resolve(__dirname, 'src/lib/dialog-description/index.js'),
        'dialog-trigger': resolve(__dirname, 'src/lib/dialog-trigger/index.js'),
        'dialog-close': resolve(__dirname, 'src/lib/dialog-close/index.js')
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