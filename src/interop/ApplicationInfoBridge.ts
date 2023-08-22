/**
 * ApplicationInfoBridge.ts
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file React Native module to get native Application Info
 */

import { NativeModules } from 'react-native';

export interface IApplicationInfoBridge {
  /**
   * Gets the native Application Name
   */
  getAppName(): Promise<string>;
}

export const ApplicationInfoBridge: IApplicationInfoBridge =
  NativeModules.ApplicationInfoBridge || {};
