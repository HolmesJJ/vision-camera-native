/**
 * StackParamList.ts
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Defined parameter list type for navigator type checking
 */

import { RouteDefinition } from 'components/navigators/RouteDefinition';

export type StackParamList = {
  [RouteDefinition.MAIN]: undefined;
  [RouteDefinition.CAMERA]: undefined;
  [RouteDefinition.FOOD]: undefined;
  [RouteDefinition.TEST]: undefined;
};
