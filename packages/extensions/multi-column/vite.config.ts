import { defineConfig, mergeConfig } from 'vite'
import { defineConfig as defineVitestConfig } from 'vitest/config'

export default mergeConfig(
  defineConfig({
    build: {
      target: 'esnext',
      lib: {
        name: 'MultiColumn',
        entry: 'src/index.ts',
        formats: ['es', 'cjs', 'iife'],
        fileName: (format) => {
          switch (format) {
            case 'es':
              return 'index.mjs'
            case 'cjs':
              return 'index.cjs'
            case 'iife':
              return 'index.js'
            default:
              return 'index.js'
          }
        },
      },
      minify: true,
      rollupOptions: {
        external: [
          '@tiptap/core',
          '@tiptap/pm/commands',
          '@tiptap/pm/keymap',
          '@tiptap/pm/model',
          '@tiptap/pm/state',
          '@tiptap/pm/transform',
          '@tiptap/pm/view',
        ],
        output: {
          banner: `
/**
 *  Copyright ${new Date(Date.now()).getFullYear()} Yiitap 
 *  @license MIT
**/
`,
          exports: 'named',
          globals: {
            '@tiptap/core': 'TiptapCore',
            '@tiptap/pm/commands': 'TiptapPmCommands',
            '@tiptap/pm/keymap': 'TiptapPmKeymap',
            '@tiptap/pm/model': 'TiptapPmModel',
            '@tiptap/pm/state': 'TiptapPmState',
            '@tiptap/pm/transform': 'TiptapPmTransform',
            '@tiptap/pm/view': 'TiptapPmView',
          },
          assetFileNames: (assetInfo) => {
            const isCSS =
              assetInfo.names && assetInfo.names.some((n) => n.endsWith('.css'))
            if (isCSS) {
              return 'style.css'
            }
            return '[name][extname]'
          },
        },
      },
    },
    plugins: [],
  }),
  defineVitestConfig({
    test: {
      environment: 'jsdom',
    },
  })
)
