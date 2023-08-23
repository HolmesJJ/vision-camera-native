/**
 * App.test.tsx
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Tests for App
 */

import React from 'react';
import { render } from '@testing-library/react-native';

import { App } from 'root';

jest.mock('react-native-config', () => ({
  ENDPOINT_SERVER_URL: 'mock endpoint',
  ENDPOINT_POLL_INTERVAL_MS: 1000,
}));

test('snapshot', () => {
  const tree = render(<App appName="visioncamera" />);
  expect(tree.toJSON()).toMatchSnapshot();
});
