/**
 * MainEntry.test.tsx
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Tests for MainEntry
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import * as ReactNavigationNative from '@react-navigation/native';

import { RouteDefinition, StackParamList } from 'components/navigators';
import { MockStackScreenProps } from 'core/mocks';
import { MainEntry } from 'scenes/';

jest.useFakeTimers();

jest.mock('react-native-config', () => ({
  ENDPOINT_SERVER_URL: 'mock endpoint',
  ENDPOINT_POLL_INTERVAL_MS: 1000,
}));

const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  return {
    ...(jest.requireActual(
      '@react-navigation/native',
    ) as typeof ReactNavigationNative),
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});

const props = new MockStackScreenProps<StackParamList, RouteDefinition.MAIN>();

test('snapshot', () => {
  const tree = render(<MainEntry {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});
