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
import { Worklets } from 'react-native-worklets-core';
import {
  Tensor,
  TensorflowModel,
  useTensorflowModel,
} from 'react-native-fast-tflite';
import { useResizePlugin } from 'vision-camera-resize-plugin';
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
  left: number;
  top: number;
  right: number;
  bottom: number;
  label: string;
  confidence: number;
}

export interface ICameraEntryProps
  extends StackScreenProps<RouteDefinition.CAMERA> {}

function tensorToString(tensor: Tensor): string {
  return `\n  - ${tensor.dataType} ${tensor.name}[${tensor.shape}]`;
}

function modelToString(model: TensorflowModel): string {
  return (
    `TFLite Model (${model.delegate}):\n` +
    `- Inputs: ${model.inputs.map(tensorToString).join('')}\n` +
    `- Outputs: ${model.outputs.map(tensorToString).join('')}`
  );
}

export function CameraEntry(_props: ICameraEntryProps) {
  const styles = useStyles();
  const { resize } = useResizePlugin();

  const objectDetection = useTensorflowModel(
    require('assets/efficientdet.tflite'),
  );
  const model =
    objectDetection.state === 'loaded' ? objectDetection.model : undefined;

  React.useEffect(() => {
    if (model === undefined) {
      return;
    }
    console.log(`Model loaded! Shape:\n${modelToString(model)}]`);
  }, [model]);

  const paint = Skia.Paint();
  paint.setStyle(PaintStyle.Stroke);
  paint.setStrokeWidth(1);
  paint.setColor(Skia.Color('red'));

  const fontStyle = {
    fontSize: 14,
  };
  const font = matchFont(fontStyle);

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
  // const format = useCameraFormat(device, Templates.FrameProcessingBarcodeXGA);

  const [detections, setDetections] = React.useState<Detection[]>([]);
  // https://github.com/mrousavy/react-native-vision-camera/issues/1613
  const setDetectionsOnJS = Worklets.createRunInJsFn(setDetections);

  const [canvasLayout, setCanvasLayout] = React.useState<number[]>([]);

  // https://react-native-vision-camera.com/docs/guides/frame-processors
  // https://github.com/mrousavy/react-native-vision-camera/issues/1913
  const frameProcessor = useFrameProcessor(
    (frame: Frame) => {
      'worklet';

      // console.log('Width: ' + frame.width + ', Height: ' + frame.height);
      if (model === undefined) {
        return;
      }

      // 1. Resize 4k Frame to 192x192x3 using vision-camera-resize-plugin
      const resized = resize(frame, {
        scale: {
          width: 320,
          height: 320,
        },
        pixelFormat: 'rgb',
        dataType: 'uint8',
        rotation: '0deg',
      });

      // 2. Run model with given input buffer synchronously
      const outputs = model.runSync([resized]);

      // 3. Interpret outputs accordingly
      const detectedObjects = [];
      const detection_boxes = outputs[0];
      const detection_classes = outputs[1];
      const detection_scores = outputs[2];
      const num_detections = outputs[3]?.[0] ?? 0;
      console.log(`Detected ${num_detections} objects!`);

      for (let i = 0; i < detection_boxes.length; i += 4) {
        const confidence = detection_scores[i / 4];
        if (confidence > 0.1) {
          // 4. Draw a red box around the detected object!
          const [canvasWidth, canvasHeight] = canvasLayout;
          const object = {
            left: detection_boxes[i] * canvasWidth,
            top: detection_boxes[i + 1] * canvasHeight,
            right: detection_boxes[i + 2] * canvasWidth,
            bottom: detection_boxes[i + 3] * canvasHeight,
            label: '' + detection_classes[i / 4],
            confidence: confidence,
          } as Detection;
          detectedObjects.push(object);
        }
      }
      setDetectionsOnJS(detectedObjects);
    },
    [model, canvasLayout],
  );

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
                  x={detection.left}
                  y={detection.top}
                  width={detection.right - detection.left}
                  height={detection.bottom - detection.top}
                  paint={paint}
                />
                <Text
                  x={detection.left}
                  y={detection.top - 10}
                  text={detection.label}
                  paint={paint}
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
