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
  Code,
  CodeScannerFrame,
  useCameraDevice,
  useCodeScanner,
  CameraRuntimeError,
} from 'react-native-vision-camera';
import 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/core';
import {
  Canvas,
  matchFont,
  PaintStyle,
  Rect,
  Skia,
  Text,
} from '@shopify/react-native-skia';
import * as Colors from 'styles/Colors';
import { Option } from 'nasi-lemak';

import { RouteDefinition, StackScreenProps } from 'components/navigators';
import { useCameraEntry as useStyles } from 'styles/camera';

interface Detection {
  x: number; // left
  y: number; // top
  width: number; // right = x + width
  height: number; // bottom = y + height
  type: string;
  value: string;
}

export interface ICameraEntryProps
  extends StackScreenProps<RouteDefinition.CAMERA> {}

export function CameraEntry(_props: ICameraEntryProps) {
  const styles = useStyles();

  const rectPaint = Skia.Paint();
  rectPaint.setStyle(PaintStyle.Stroke);
  rectPaint.setStrokeWidth(1);
  rectPaint.setColor(Skia.Color('red'));

  const textPaint = Skia.Paint();
  textPaint.setStyle(PaintStyle.Fill);
  textPaint.setColor(Skia.Color('red'));

  const fontStyle = {
    fontFamily: 'Arial',
    fontSize: 16,
  };
  const font = matchFont(fontStyle);
  if (!font) {
    console.error('Font not found');
  }

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

  // Camera Format Settings
  const device: CameraDevice | undefined = useCameraDevice('back');

  const [detections, setDetections] = React.useState<Detection[]>([]);
  // https://github.com/mrousavy/react-native-vision-camera/issues/1613
  // const setDetectionsOnJS = Worklets.createRunInJsFn(setDetections);

  const [canvasLayout, setCanvasLayout] = React.useState<number[]>([]);

  // https://github.com/mrousavy/react-native-vision-camera/issues/2436
  const codeScanner = useCodeScanner({
    codeTypes: [
      'code-128',
      'code-39',
      'code-93',
      'codabar',
      'ean-13',
      'ean-8',
      'itf',
      'upc-e',
      'upc-a',
    ],
    onCodeScanned: React.useCallback(
      async (codes: Code[], frame: CodeScannerFrame) => {
        const [canvasWidth, canvasHeight] = canvasLayout;
        const newDetections: Detection[] = codes.map((code) => {
          const scaleWidth = canvasWidth / frame.height;
          const scaleHeight = canvasHeight / frame.width;
          return {
            x:
              (frame.height -
                (code.frame?.y ?? 0) -
                (code.frame?.height ?? 0)) *
              scaleWidth,
            y: (code.frame?.x ?? 0) * scaleHeight,
            width: (code.frame?.height ?? 0) * scaleWidth,
            height: (code.frame?.width ?? 0) * scaleHeight,
            type: code.type,
            value: code.value ?? 'Unknown',
          };
        });
        setDetections(newDetections);
      },
      [canvasLayout],
    ),
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
            orientation="portrait"
            onInitialized={onInitialized}
            codeScanner={codeScanner}
          />
        )}
        <Canvas
          style={styles.canvas}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setCanvasLayout([width, height]);
          }}
        >
          {Object.entries(detections).map(([key, detection], index) => {
            console.log('Index:', index);
            console.log('Key:', key);
            console.log('Detection:', detection);
            return (
              <React.Fragment key={index}>
                <Rect
                  x={detection.x}
                  y={detection.y}
                  width={detection.width}
                  height={detection.height}
                  paint={rectPaint}
                />
                <Text
                  x={detection.x}
                  y={detection.y - 10}
                  text={detection.type + ': ' + detection.value}
                  paint={textPaint}
                  font={font}
                />
              </React.Fragment>
            );
          })}
        </Canvas>
      </View>
    </SafeAreaView>
  );
}
