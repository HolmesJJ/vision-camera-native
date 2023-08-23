/**
 * Snackbar.ts
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Global Snackbar Style Sheet
 * @barrel hook
 */

import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

import * as Colors from 'styles/Colors';

export function useSnackbar() {
  const { colors } = useTheme();
  return StyleSheet.create({
    success: {
      color: colors.background,
      backgroundColor: Colors.success,
    },
    warning: {
      color: colors.background,
      backgroundColor: Colors.warning,
    },
    error: {
      color: colors.background,
      backgroundColor: Colors.error,
    },
    default: {
      color: Colors.background,
      backgroundColor: Colors.transparent,
    },
  });
}
