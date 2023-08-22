/**
 * jest.config.js
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Jest configuration stript
 */

const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  ...tsjPreset,
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  preset: 'react-native',
  setupFiles: ['<rootDir>/tools/jestSetup.js'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transform: tsjPreset.transform,
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@react-native|react-native|@react-native-community|@react-navigation)',
  ],
};
