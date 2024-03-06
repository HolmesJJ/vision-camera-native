/**
 * CameraEntry.tsx
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Entry point for Camera Scene
 */

import React from 'react';
import { AppState, AppStateStatus, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Camera,
  CodeScanner,
  CameraDevice,
  useCameraDevice,
  CameraRuntimeError,
  useFrameProcessor,
  useCodeScanner,
  Frame,
} from 'react-native-vision-camera';
import 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/core';
import * as Colors from 'styles/Colors';
import { Option } from 'nasi-lemak';

import { RouteDefinition, StackScreenProps } from 'components/navigators';
import { useCameraEntry as useStyles } from 'styles/camera';

export interface ICameraEntryProps
  extends StackScreenProps<RouteDefinition.CAMERA> {}

export function CameraEntry(_props: ICameraEntryProps) {
  const styles = useStyles();

  const onError = React.useCallback((error: CameraRuntimeError) => {
    console.error(error);
  }, []);

  // Check if camera page is active
  const [isForeground, setIsForeground] = React.useState<boolean>(true);
  React.useEffect(() => {
    const onChange = (state: AppStateStatus): void => {
      setIsForeground(state === 'active');
    };
    const listener = AppState.addEventListener('change', onChange);
    return () => listener.remove();
  }, [setIsForeground]);
  const isFocussed: boolean = useIsFocused();
  const isActive: boolean = isFocussed && isForeground;

  // Camera Format Settings
  const device: CameraDevice | undefined = useCameraDevice('back');

  // https://www.react-native-vision-camera.com/docs/guides/frame-processors-plugins-overview
  // https://github.com/mrousavy/react-native-vision-camera/issues/1195
  const frameProcessor = useFrameProcessor((frame: Frame) => {
    'worklet';
    console.log('Width: ' + frame.width + ', Height: ' + frame.height);
  }, []);

  const codeScanner: CodeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      console.log(`Scanned ${codes.length} codes!`);
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.black} barStyle="light-content" />
      <View style={styles.container}>
        {Option.isSome(device) && (
          <Camera
            style={styles.camera}
            device={device}
            isActive={isActive}
            onError={onError}
            frameProcessor={frameProcessor}
            orientation="portrait"
            codeScanner={codeScanner}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
