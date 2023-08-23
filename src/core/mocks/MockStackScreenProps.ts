/**
 * MockStackScreenProps.ts
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file A Mock react-navigation StackScreenProps interface to be used for
 *       individual component testing
 */

/* eslint-disable no-undef */

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { StackNavigationEventMap } from '@react-navigation/stack/lib/typescript/src/types';

export class MockStackScreenProps<
  ParamList extends Record<string, object | undefined>,
  RouteName extends keyof ParamList,
> implements StackScreenProps<ParamList, RouteName>
{
  public navigation: StackNavigationProp<ParamList, RouteName> =
    new MockNavigation<ParamList, RouteName>();
  public route: RouteProp<ParamList, RouteName> | any;

  constructor(params?: ParamList[RouteName]) {
    this.route = {
      params: params,
    };
  }
}

class MockNavigation<
  ParamList extends Record<string, object | undefined>,
  RouteName extends keyof ParamList,
> implements StackNavigationProp<ParamList, RouteName>
{
  protected?:
    | ({ a: ParamList; b: keyof ParamList; c: {} } & {
        a: ParamList;
        b: RouteName;
        c: StackNavigationEventMap;
      })
    | undefined;

  public getId = jest.fn();
  public addListener = jest.fn();
  public canGoBack = jest.fn();
  public dangerouslyGetParent = jest.fn();
  public dangerouslyGetState = jest.fn();
  public dispatch = jest.fn();
  public getParent = jest.fn();
  public getState = jest.fn();
  public goBack = jest.fn();
  public isFocused = jest.fn();
  public navigate = jest.fn();
  public pop = jest.fn();
  public popToTop = jest.fn();
  public push = jest.fn();
  public removeListener = jest.fn();
  public replace = jest.fn();
  public reset = jest.fn();
  public setOptions = jest.fn();
  public setParams = jest.fn();
}
