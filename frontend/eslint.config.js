import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    /**
     * `react-refresh/only-export-components` guards Fast Refresh, which needs a
     * module to export components and nothing else. Two files legitimately
     * break that rule and are not Fast-Refresh targets:
     *   - router.tsx: declares lazy() route components alongside the `router`
     *   - ui/button.tsx: exports `buttonVariants` beside Button (shadcn convention)
     */
    files: ['src/router.tsx', 'src/components/ui/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
