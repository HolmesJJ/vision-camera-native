/**
 * index.js
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Entry point for React Native
 */

import 'node-libs-react-native/globals';
import { AppRegistry } from 'react-native';
import { App } from 'root';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
