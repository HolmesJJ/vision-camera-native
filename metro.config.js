/**
 * metro.config.js
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * Metro configuration for React Native
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const nodeLibs = require('node-libs-react-native');

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    extraNodeModules: nodeLibs,
    assetExts: ['tflite', 'png', 'jpg'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
