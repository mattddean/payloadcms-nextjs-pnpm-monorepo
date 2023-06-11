/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  extends: ['@acme/eslint-config', 'plugin:tailwindcss/recommended'], // uses the config in `packages/config/eslint`
  plugins: ['tailwindcss'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './apps/*/tsconfig.json', './packages/*/tsconfig.json'],
  },
  rules: {
    'tailwindcss/classnames-order': 'off',
  },
  settings: {
    next: {
      rootDir: ['apps/nextjs'],
    },
    tailwindcss: {
      config: './apps/nextjs/tailwind.config.js',
    },
  },
}

module.exports = config
