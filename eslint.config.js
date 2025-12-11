import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-plugin-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import tanstackQuery from '@tanstack/eslint-plugin-query'
import tanstackRouter from '@tanstack/eslint-plugin-router'

export default defineConfig([
  globalIgnores(['dist', '.vite']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier
    ],
    plugins:{
      'react-hooks': reactHooks,
      'tanstack-query': tanstackQuery,
      'tanstack-roouter': tanstackRouter,
      prettier: eslintPluginPrettier,
    },
    

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      ...tanstackQuery.configs.recommended.rules,
      ...tanstackRouter.configs.recommended.rules,
      'prettier/prettier': 'error'
    },
  },
])
