/**
 * TestEntry.ts
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Test Page Style Sheet
 * @barrel hook
 */

import { StyleSheet } from 'react-native';

export function useTestEntry() {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 300,
      height: 300,
    },
    detectButton: {
      margin: 30,
      width: 200,
    },
    outputsText: {
      fontSize: 18,
      textAlign: 'center',
      marginTop: 10,
    },
  });
}
