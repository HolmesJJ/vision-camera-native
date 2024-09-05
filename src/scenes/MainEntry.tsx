/**
 * MainEntry.tsx
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Entry point for Main Scene
 */

import React from 'react';
import { NativeModules, StatusBar, View, Linking } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
import { Optional } from 'nasi-lemak';

import { RouteDefinition, StackScreenProps } from 'components/navigators';
import { useMainEntry as useStyles } from 'styles/main';

export interface IMainEntryProps
  extends StackScreenProps<RouteDefinition.MAIN> {}

export function MainEntry(props: IMainEntryProps) {
  const navigation = props.navigation;
  const { ActivityStarter } = NativeModules;
  const styles = useStyles();

  const [cameraPermissionStatus, setCameraPermissionStatus] =
    React.useState<CameraPermissionStatus>('not-determined');
  const [microphonePermissionStatus, setMicrophonePermissionStatus] =
    React.useState<CameraPermissionStatus>('not-determined');
  const [disabled, setDisabled] = React.useState<boolean>(true);

  const requestMicrophonePermission = React.useCallback(async () => {
    const permission = await Camera.requestMicrophonePermission();
    if (permission === 'denied') {
      await Linking.openSettings();
    }
    setMicrophonePermissionStatus(permission);
  }, []);

  const requestCameraPermission = React.useCallback(async () => {
    const permission = await Camera.requestCameraPermission();
    if (permission === 'denied') {
      await Linking.openSettings();
    }
    setCameraPermissionStatus(permission);
  }, []);

  React.useEffect(() => {
    setCameraPermissionStatus(Camera.getCameraPermissionStatus());
    setMicrophonePermissionStatus(Camera.getMicrophonePermissionStatus());
  }, []);

  React.useEffect(() => {
    if (
      cameraPermissionStatus === 'granted' &&
      microphonePermissionStatus === 'granted'
    ) {
      setDisabled(false);
    }
  }, [cameraPermissionStatus, microphonePermissionStatus, navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.container}>
        <Optional predicate={disabled}>
          <View>
            {cameraPermissionStatus !== 'granted' && (
              <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>
                  Vision Camera needs camera permission
                </Text>
                <Button
                  style={styles.permissionButton}
                  testID="cameraButton"
                  mode="contained"
                  onPress={requestCameraPermission}
                >
                  Grant
                </Button>
              </View>
            )}
            {microphonePermissionStatus !== 'granted' && (
              <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>
                  Vision Camera needs microphone permission
                </Text>
                <Button
                  style={styles.permissionButton}
                  testID="cameraButton"
                  mode="contained"
                  onPress={requestMicrophonePermission}
                >
                  Grant
                </Button>
              </View>
            )}
          </View>
        </Optional>
        <Optional predicate={!disabled}>
          <Button
            style={styles.cameraButton}
            testID="visionCameraButton"
            mode="contained"
            disabled={disabled}
            onPress={() => {
              navigation.navigate(RouteDefinition.CAMERA);
            }}
          >
            VISION CAMERA
          </Button>
        </Optional>
        <Optional predicate={!disabled}>
          <Button
            style={styles.cameraButton}
            testID="nativeCameraButton"
            mode="contained"
            disabled={disabled}
            onPress={() => ActivityStarter.navigateToCamera()}
          >
            NATIVE CAMERA
          </Button>
        </Optional>
        <Optional predicate={!disabled}>
          <Button
            style={styles.testButton}
            testID="testButton"
            mode="contained"
            disabled={disabled}
            onPress={() => {
              navigation.navigate(RouteDefinition.FOOD);
            }}
          >
            OPEN FOOD FACTS
          </Button>
        </Optional>
        <Optional predicate={!disabled}>
          <Button
            style={styles.testButton}
            testID="testButton"
            mode="contained"
            disabled={disabled}
            onPress={() => {
              navigation.navigate(RouteDefinition.TEST);
            }}
          >
            TEST MODEL
          </Button>
        </Optional>
      </View>
    </SafeAreaView>
  );
}
