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
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // "@typescript-eslint/explicit-function-return-type": "off",
    // "eslint/prettier/prettier)"
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
