module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh', 'prettier', 'eslint-plugin-import-helpers'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'no-undef': 'off',
    'prettier/prettier': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'import-helpers/order-imports': [
      'warn',
      {
        newlinesBetween: 'always',
        groups: [
          '/^react/',
          // next
          '/^next/',
          ['/^autosuggest-highlight/'],
          'module',
          ['/^@/hooks/'],
          '/^@hookform/',
          ['/^@/contexts/'],
          ['/^@/components/'],
          ['/^@/pages/'],
          ['/^@/styles/'],
          ['/^@/utils/'],
          ['/^@/types/'],
          ['/^@/services/'],
          ['/^@/config/'],
          ['/^@/assets/'],
          ['/^@/'],
          ['/^@types/'],
          ['parent', 'sibling', 'index'],
        ],
        alphabetize: {
          order: 'asc',
          ignoreCase: true,
        }, // alphabetical ascendent order
      },
    ],
  },
}
