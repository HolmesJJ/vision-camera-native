/**
 * index.js
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Entry point for React Native
 */

/**
 * This issue still presists
 * "RCTBridge required dispatch_sync to load RNGestureHandlerModule.
 * This may lead to deadlocks."
 * https://github.com/software-mansion/react-native-gesture-handler/issues/722
 */

import 'node-libs-react-native/globals';
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { App } from 'root';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
