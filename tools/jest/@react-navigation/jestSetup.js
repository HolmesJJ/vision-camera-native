/**
 * jestSetup.js
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Jest startup stript for mocking of react-navigation's hooks
 */

/* eslint-disable no-undef */

// Mock useNavigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
  useRoute: () => ({}),
}));
