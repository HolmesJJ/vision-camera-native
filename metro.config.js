/**
 * metro.config.js
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    extraNodeModules: require('node-libs-react-native'),
  },
};
