module.exports = {
  // Specifies the ESLint parser
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  parserOptions: {
    // Allows for the parsing of modern ECMAScript features
    ecmaVersion: 2019,
    // Allows for the use of imports
    sourceType: 'module',
  },
  rules: {
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/consistent-indexed-object-style': 'error',
    'comma-spacing': 'off',
    '@typescript-eslint/comma-spacing': ['error'],
    '@typescript-eslint/consistent-type-imports': ['error'],
    'sort-imports': 1,
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
      },
    ],
  },
}
