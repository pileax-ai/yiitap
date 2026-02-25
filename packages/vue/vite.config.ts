/// <reference types="vitest"/>
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'
import { visualizer } from 'rollup-plugin-visualizer'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['model-viewer'].includes(tag),
        },
      },
    }),
    Inspect({
      build: true,
      outputDir: '.analysis/inspect',
    }),
    visualizer({
      filename: '.analysis/visualizer/stats.html',
    }),
  ],
  optimizeDeps: {
    include: ['mermaid'],
  },
  resolve: {
    alias: {
      /*
       * We recommend to not use aliases in the lib's source,
       * because they will leak into the generated d.ts files and then
       * break the lib's types in the consuming app.
       */
    },
  },
  build: {
    lib: {
      name: 'YiiEditor',
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
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
    sourcemap: true,
    rollupOptions: {
      external: [
        'vue',
        // /^@tiptap\/.*/,
        // /^@yiitap\/.*/,
        '@tiptap/extension-audio',
        '@tiptap/extension-mathematics',
        '@tiptap/markdown',
        '@yiitap/i18n',
        '@yiitap/util-emoji',
        '@mermaid-js/layout-elk',
        'katex',
        'lowlight',
        'markdown-it',
        'mermaid',
        'openai',
        'yjs',
      ],
      output: {
        banner: `
/**
 *  Copyright ${new Date(Date.now()).getFullYear()} Yiitap 
 *  @license MIT
**/
`,
        exports: 'named',
        globals: (id) => {
          // Manual
          const map: Record<string, string> = {
            vue: 'Vue',
            yjs: 'Yjs',
            mermaid: 'Mermaid',
            katex: 'Katex',
            'markdown-it': 'MarkdownIt',
            openai: 'OpenAI',
          }
          if (map[id]) return map[id]

          // Tiptap，camel naming
          // example: @tiptap/extension-bold -> TiptapExtensionBold
          return (
            'Custom' +
            id
              .replace(/^@/, '')
              .replace(/[-/](.)/g, (_, c) => c.toUpperCase()) // to camel
              .replace(/[^a-zA-Z0-9]/g, '')
          )
        },
      },
    },
  },
})
