/**
 * App.tsx
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file React Native Application Base
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, Text } from 'react-native-paper';

import { Default as DefaultTheme } from 'assets/themes/Default';

interface IAppProps {
  appName: string;
}

export function App(props: IAppProps) {
  const appName = props.appName;
  return (
    <SafeAreaProvider>
      <PaperProvider theme={DefaultTheme}>
        <Text>{appName}</Text>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
