const nextEslint = require('eslint-config-next')

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  ...nextEslint,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
]
