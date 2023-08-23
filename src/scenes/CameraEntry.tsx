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
  CameraDevice,
  CameraDevices,
  useCameraDevices,
  CameraRuntimeError,
  useFrameProcessor,
  FrameProcessorPerformanceSuggestion,
  Frame,
} from 'react-native-vision-camera';
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
  const devices: CameraDevices = useCameraDevices();
  const device: CameraDevice | undefined = devices.back;

  const frameProcessor = useFrameProcessor((frame: Frame) => {
    'worklet';
    console.log('Width: ' + frame.width + ', Height: ' + frame.height);
  }, []);

  const onFrameProcessorSuggestionAvailable = React.useCallback(
    (suggestion: FrameProcessorPerformanceSuggestion) => {
      console.log(
        `Suggestion available! ${suggestion.type}: Can do ${suggestion.suggestedFrameProcessorFps} FPS`,
      );
    },
    [],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.black} barStyle="light-content" />
      <View style={styles.container}>
        {Option.isSome(device) && (
          <Camera
            style={styles.camera}
            device={device!}
            isActive={isActive}
            onError={onError}
            frameProcessor={frameProcessor}
            orientation="portrait"
            onFrameProcessorPerformanceSuggestionAvailable={
              onFrameProcessorSuggestionAvailable
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
