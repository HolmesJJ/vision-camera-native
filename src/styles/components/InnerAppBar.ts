/**
 * InnerAppBar.ts
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file hook to get Stylesheet for InnerAppBar which uses Theme
 * @barrel hooks
 */

import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export function useInnerAppBar() {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      elevation: 1,
      marginBottom: 5,
    },
    content: {
      flexBasis: 'auto',
      flexGrow: 6,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    icon: {
      flexBasis: 0,
      flexGrow: 1,
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },
  });
}
