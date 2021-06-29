module.exports = {
  parser: '@typescript-eslint/parser',
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'standard', 'prettier', 'prettier/@typescript-eslint'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
        printWidth: 100,
        trailingComma: 'es5',
      },
    ],
    'no-use-before-define': 0,
    '@typescript-eslint/no-use-before-define': 0,
    'react/prop-types': 0,
    'react/no-children-prop': 0,
    'react-hooks/rules-of-hooks': 2, // check Hook rules
    'react-hooks/exhaustive-deps': 1, // check effect deps
    'no-case-declarations': 0,
  },
  ignorePatterns: ['*.d.ts', 'lib'],
}
