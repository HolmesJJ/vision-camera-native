/**
 * TestEntry.tsx
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Entry point for Test Scene
 */

import React from 'react';
import { Image, StatusBar, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Tensor,
  TensorflowModel,
  useTensorflowModel,
} from 'react-native-fast-tflite';
import { readFile } from 'react-native-fs';
import 'react-native-reanimated';
import * as Colors from 'styles/Colors';

import { RouteDefinition, StackScreenProps } from 'components/navigators';
import { useTestEntry as useStyles } from 'styles/test';

export interface ITestEntryProps
  extends StackScreenProps<RouteDefinition.TEST> {}

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

export function TestEntry(_props: ITestEntryProps) {
  const styles = useStyles();

  // https://github.com/mrousavy/react-native-fast-tflite/issues/11
  React.useEffect(() => {
    const processImage = async () => {
      console.log('aaa');
      const imagePath = 'assets/images/cat.jpg';
      const imageBase64 = await readFile(imagePath, 'base64').catch((err) =>
        console.error('Failed to read file:', err),
      );
      console.log(imageBase64);
    };
    processImage();
  }, []);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.black} barStyle="light-content" />
      <View style={styles.container}>
        <Image source={require('assets/images/cat.jpg')} style={styles.image} />
        <Button
          style={styles.detectButton}
          testID="detectButton"
          mode="contained"
          onPress={() => {}}
        >
          Detect
        </Button>
        <Text style={styles.outputsText}>Results</Text>
      </View>
    </SafeAreaView>
  );
}
