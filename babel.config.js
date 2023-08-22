/**
 * babel.config.js
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Babel configuration stript
 */

module.exports = {
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
    test: {
      plugins: ['react-native-config-node/transform'],
    },
  },
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          root: './src',
          '^assets(.*)': './src/assets\\1',
          '^components(.*)': './src/components\\1',
          '^core(.*)': './src/core\\1',
          '^interop(.*)': './src/interop\\1',
          '^models(.*)': './src/models\\1',
          '^scenes(.*)': './src/scenes\\1',
          '^services(.*)': './src/services\\1',
          '^styles(.*)': './src/styles\\1',
          '^viewmodels(.*)': './src/viewmodels\\1',
        },
      },
    ],
  ],
  presets: ['module:metro-react-native-babel-preset'],
};
