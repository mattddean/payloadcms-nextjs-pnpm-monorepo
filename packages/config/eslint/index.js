// @ts-check

/** @type {import("eslint").Linter.Config} */
const config = {
  $schema: 'https://json.schemastore.org/eslintrc',
  extends: ['next', 'turbo', 'plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/recommended-requiring-type-checking', 'prettier'],
  rules: {
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@next/next/no-html-link-for-pages': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', fixStyle: 'inline-type-imports' }],
  },
  plugins: ['only-warn'],
  ignorePatterns: ['**/*.config.js', '**/*.config.cjs', 'packages/config/**'],
  reportUnusedDisableDirectives: true,
}

module.exports = config
