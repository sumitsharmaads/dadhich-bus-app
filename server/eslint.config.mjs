import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(js.configs.recommended, ...tseslint.configs.recommended, {
  files: ['src/**/*.{ts,tsx}'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: ['./tsconfig.json'],
      tsconfigRootDir: new URL('.', import.meta.url).pathname,
      ecmaVersion: 2021,
      sourceType: 'module',
    },
  },
  plugins: {
    import: importPlugin,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.json'],
      },
    },
  },
  rules: {
    'import/order': [
      'warn',
      {
        groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index']],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
});
