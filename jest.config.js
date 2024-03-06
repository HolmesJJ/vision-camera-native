/**
 * jest.config.js
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Jest configuration stript
 */

const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  ...tsjPreset,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  preset: 'react-native',
  setupFiles: ['<rootDir>/tools/jestSetup.js'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transform: {
    ...tsjPreset.transform,
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        babelConfig: true,
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@react-native|react-native|@react-navigation)',
  ],
};
