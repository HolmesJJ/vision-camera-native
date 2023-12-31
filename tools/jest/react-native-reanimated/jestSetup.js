/**
 * jestSetup.js
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Jest startup stript for mocking of react-native-reanimated
 *       (https://reactnavigation.org/docs/testing/)
 */

/* eslint-disable no-undef */

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported
// because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
