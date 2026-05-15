import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import perfectionist from 'eslint-plugin-perfectionist';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      perfectionist,
    },
    rules: {
      '@typescript-eslint/no-namespace': 'off',
      'perfectionist/sort-classes': [
        'error',
        {
          order: 'asc',
          type: 'natural',
        },
      ],
    },
  },
  {
    files: ['**/*.tsx'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js'],
  }
);
