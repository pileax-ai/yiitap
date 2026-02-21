import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

/**
 * ESLint Flat Config for Yiitap
 * Optimized for Vue 3 + TypeScript Monorepo
 */
export default [
  // 1. Global ignores: Must be the first object in the array
  {
    ignores: [
      '**/.analysis/**',
      '**/dist/**',
      'packages/*/types/**',
      'node_modules/**',
    ],
  },

  // 2. Base ESLint recommended rules
  js.configs.recommended,

  // 3. Vue 3 essential rules
  ...pluginVue.configs['flat/essential'],

  // 4. Vue + TypeScript official adapter
  // Automatically handles parsers for .vue and .ts files
  ...vueTsEslintConfig(),

  // 5. Integrate Prettier as an ESLint rule
  eslintPluginPrettierRecommended,

  // 6. Project specific overrides and rules
  {
    name: 'yiitap/custom-rules',
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Common Node.js globals for Monorepo scripts
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
      },
    },
    rules: {
      // Logic & General rules
      'no-cond-assign': 'off',
      'no-undef': 'off',
      'prefer-const': 'off',

      // Vue specific rules
      'vue/multi-word-component-names': 'off',

      // TypeScript specific rules (if needed)
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
]
