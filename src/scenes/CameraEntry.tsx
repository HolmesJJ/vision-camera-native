/**
 * CameraEntry.tsx
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Entry point for Camera Scene
 */

import React from 'react';
import {
  AppState,
  AppStateStatus,
  Platform,
  StatusBar,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Camera,
  CameraDevice,
  useCameraDevice,
  CameraRuntimeError,
  useFrameProcessor,
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

  // Check if foreground is active
  const [isForeground, setForeground] = React.useState<boolean>(true);
  React.useEffect(() => {
    const onChange = (state: AppStateStatus): void => {
      setForeground(state === 'active');
    };
    const listener = AppState.addEventListener('change', onChange);
    return () => listener.remove();
  }, [setForeground]);

  // Check if camera is initialized
  const [isInitialized, setInitialized] = React.useState<boolean>(false);
  const onError = React.useCallback((error: CameraRuntimeError) => {
    console.error(error);
    setInitialized(false);
  }, []);
  const onInitialized = React.useCallback(() => {
    setInitialized(true);
  }, []);

  // Check if camera is focused
  const isFocused: boolean = useIsFocused();

  // https://github.com/mrousavy/react-native-vision-camera/issues/2291
  // Check if camera is ready
  const [isReady, setReady] = React.useState(Platform.OS === 'ios');
  React.useEffect(() => {
    if (Platform.OS === 'ios') {
      return () => {};
    }
    let timeout: any;
    if (isInitialized) {
      timeout = setTimeout(() => {
        setReady(true);
      }, 500);
    }
    setReady(false);
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isInitialized]);

  const isActive: boolean =
    isReady && isFocused && isForeground && isInitialized;
  console.log(isActive);

  // Camera Format Settings
  const device: CameraDevice | undefined = useCameraDevice('back');
  // const format = useCameraFormat(device, Templates.FrameProcessingBarcodeXGA);

  // https://react-native-vision-camera.com/docs/guides/frame-processors
  // https://github.com/mrousavy/react-native-vision-camera/issues/1913
  const frameProcessor = useFrameProcessor((frame: Frame) => {
    'worklet';
    console.log('Width: ' + frame.width + ', Height: ' + frame.height);
  }, []);

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
            onInitialized={onInitialized}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
