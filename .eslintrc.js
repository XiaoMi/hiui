// MIFE dotfiles

module.exports = {
  parser: '@typescript-eslint/parser',
  root: true,
  env: {
    browser: true,
    es2021: true,
    'jest/globals': true,
  },
  // @hi-ui/utility-types/global 声明的全局类型，避免 no-undef 误报
  globals: {
    AnyType: 'readonly',
    Dict: 'readonly',
    AnyObject: 'readonly',
    AnyArray: 'readonly',
    UnknownObject: 'readonly',
    AnyFn: 'readonly',
    AnyClass: 'readonly',
    AnyComponent: 'readonly',
    PipeFn: 'readonly',
    ArrayToUnion: 'readonly',
    DeepPartial: 'readonly',
    FnParameters: 'readonly',
    Optionals: 'readonly',
    LiteralUnion: 'readonly',
    ValueOf: 'readonly',
    MaybeAsync: 'readonly',
    Primitive: 'readonly',
    NonFnValue: 'readonly',
    FieldPath: 'readonly',
    GetterFn: 'readonly',
    AnyGetter: 'readonly',
    GetBoolFn: 'readonly',
    BoolGetter: 'readonly',
  },
  extends: ['plugin:react/recommended', 'standard', 'prettier', 'prettier/@typescript-eslint'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier', 'jest'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'prettier/prettier': ['error', require('./package.json').prettier],
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
