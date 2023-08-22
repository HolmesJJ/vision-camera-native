/**
 * Default.ts
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Default Theme color definitions
 */

import {
  DefaultTheme as NavigationDefaultTheme,
  Theme as NavigationThemeType,
} from '@react-navigation/native';
import { DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import { MD3Theme as PaperThemeType } from 'react-native-paper/lib/typescript/types';
import * as Colors from 'styles/Colors';

// Internal const for type checking against the 2 themes combined
const DefaultTheme: PaperThemeType & NavigationThemeType = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    background: Colors.background,
    error: Colors.error,
    primary: Colors.primary,
  },
};

export const Default = {
  ...DefaultTheme,
};
