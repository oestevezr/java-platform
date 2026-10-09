import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
export default tseslint.config(
 { ignores: ['**/dist/**', 'node_modules/**', '.agents/**', '.claude/**', '.serena/**', 'playwright-report/**', 'test-results/**', 'content/sources/**'] },
 js.configs.recommended, ...tseslint.configs.recommended,
 { files: ['**/*.{js,mjs,ts,tsx}'], languageOptions: { globals: { ...globals.browser, ...globals.node } } },
 { files: ['apps/web/**/*.{ts,tsx}'], plugins: { 'react-hooks': reactHooks }, rules: { 'react-hooks/rules-of-hooks': 'error', 'react-hooks/exhaustive-deps': 'warn' } }
);
