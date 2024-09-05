/**
 * TestEntry.tsx
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Entry point for Test Scene
 */

import React from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import { Image, StatusBar, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Tensor,
  TensorflowModel,
  useTensorflowModel,
} from 'react-native-fast-tflite';
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

  const [image, setImage] = React.useState<string | null>(null);

  // https://github.com/mrousavy/react-native-fast-tflite/issues/11
  React.useEffect(() => {
    let imagePath: string | null = null;
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch(
        'GET',
        'https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_1280.jpg',
      )
      .then((resp) => {
        imagePath = resp.path();
        return resp.readFile('base64');
      })
      .then((base64Data) => {
        setImage(base64Data);
        if (imagePath) {
          return RNFetchBlob.fs.unlink(imagePath);
        }
        return null;
      })
      .catch((error) => {
        console.error('Failed to fetch or convert image:', error);
        if (imagePath) {
          RNFetchBlob.fs
            .unlink(imagePath)
            .catch((err) => console.error('Failed to remove file:', err));
        }
      });
    return () => {
      if (imagePath) {
        RNFetchBlob.fs
          .unlink(imagePath)
          .catch((err) => console.error('Cleanup failed:', err));
      }
    };
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

  async function handleDetection() {
    if (!image || !model) {
      console.warn('Image or model is not loaded yet.');
      return;
    }
    // TODO
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.black} barStyle="light-content" />
      <View style={styles.container}>
        {image ? (
          <Image
            source={{ uri: `data:image/png;base64,${image}` }}
            style={styles.image}
          />
        ) : (
          <Text>Loading...</Text>
        )}
        <Button
          style={styles.detectButton}
          testID="detectButton"
          mode="contained"
          onPress={handleDetection}
        >
          Detect
        </Button>
        <Text style={styles.outputsText}>Results</Text>
      </View>
    </SafeAreaView>
  );
}
