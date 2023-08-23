/**
 * MainEntry.ts
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Main Page Style Sheet
 * @barrel hook
 */

import { StyleSheet } from 'react-native';

export function useMainEntry() {
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
    permissionContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 50,
      marginLeft: 20,
      marginRight: 20,
    },
    permissionText: {
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 10,
    },
    permissionButton: {
      width: 100,
    },
    cameraButton: {
      margin: 8,
      width: 150,
    },
  });
}
