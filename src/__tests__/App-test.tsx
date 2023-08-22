/**
 * App.test.tsx
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Tests for App
 */

import React from 'react';
import { render } from '@testing-library/react-native';

import { App } from 'root';

test('snapshot', () => {
  const tree = render(<App appName="visioncamera" />);
  expect(tree.toJSON()).toMatchSnapshot();
});
