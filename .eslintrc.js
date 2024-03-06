/**
 * .eslintrc.js
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file ESLint configuration stript
 */

module.exports = {
  root: true,
  extends: '@react-native',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'eslint-comments/no-unused-disable': 'off',
      },
    },
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
