/**
 * StackScreenProps.ts
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file props for App's stack navigation screens
 */

import { StackScreenProps as NavigationStackScreenProps } from '@react-navigation/stack';

import { StackParamList } from 'components/navigators';

export interface StackScreenProps<RouteName extends keyof StackParamList>
  extends NavigationStackScreenProps<StackParamList, RouteName> {}
