/**
 * CameraEntry.ts
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Camera Page Style Sheet
 * @barrel hook
 */

import { StyleSheet } from 'react-native';

export function useCameraEntry() {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
    },
    camera: {
      height: '100%',
      width: '100%',
      position: 'absolute',
      zIndex: 1,
    },
    canvas: {
      position: 'absolute',
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 2,
    },
  });
}
