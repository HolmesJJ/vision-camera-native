/**
 * StackNavigatorHeader.tsx
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Custom header component for StackNavigator
 */

import React from 'react';
import { Appbar } from 'react-native-paper';
import {
  StackHeaderProps,
  StackNavigationOptions,
} from '@react-navigation/stack';

import { Option, Optional } from 'nasi-lemak';

export interface IStackNavigatorHeaderProps
  extends StackHeaderProps,
    StackNavigationOptions {
  /**
   * Whether to show or hide the back button.
   * Setting this to false to hide the back button.
   * Back button will be shown only if the current navigation
   * has screens in it's stack and is able to dispatch the action
   *
   * Defaults to true
   */
  backButton?: boolean;
}

export function StackNavigatorHeader(props: IStackNavigatorHeaderProps) {
  const navigation = props.navigation;
  const route = props.route;
  const title = Option.value(props.title, route.name);
  const backButton = Option.value(props.backButton, true);

  return (
    <Appbar.Header>
      <Optional predicate={backButton && navigation.canGoBack()}>
        <Appbar.BackAction onPress={navigation.goBack} />
      </Optional>
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}
