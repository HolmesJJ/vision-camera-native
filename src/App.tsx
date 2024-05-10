/**
 * App.tsx
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file React Native Application Base
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, Snackbar } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Option } from 'nasi-lemak';

import { Default as DefaultTheme } from 'assets/themes/Default';
import { Provider as ApplicationContextProvider } from 'core/ApplicationContext';
import { Type as SnackbarType } from 'models/SnackbarTypes';
import {
  RouteDefinition,
  StackParamList,
  StackNavigatorHeader as Header,
} from 'components/navigators';
import { MainEntry, CameraEntry, TestEntry } from 'scenes/';
import { useSnackbar as useSnackbarStyles } from 'styles/';

const Stack = createStackNavigator<StackParamList>();

const CustomStackNavigatorHeader = (
  props: Header.IStackNavigatorHeaderProps,
) => {
  return <Header.StackNavigatorHeader {...props} backButton={false} />;
};

interface IAppProps {
  appName: string;
}

export function App(props: IAppProps) {
  const appName = props.appName;

  const [snackbarProps, setSnackbarProps] = React.useState<{
    visibility: boolean;
    message: string;
    label?: string;
    duration?: number;
    type?: SnackbarType;
  }>({
    visibility: false,
    message: '',
  });
  const showSnackbar = (
    message: string,
    label?: string,
    duration?: number,
    type?: SnackbarType,
  ) => {
    if (Option.truthy(message)) {
      setSnackbarProps({
        visibility: true,
        message: message,
        label: label,
        duration: duration,
        type: type,
      });
    } else {
      setSnackbarProps({
        visibility: false,
        message: '',
      });
    }
  };
  const snackbarStyle = useSnackbarStyles();

  return (
    <SafeAreaProvider>
      <PaperProvider theme={DefaultTheme}>
        <ApplicationContextProvider
          value={{
            appName,
            showSnackbar,
          }}
        >
          <NavigationContainer theme={DefaultTheme}>
            <Stack.Navigator
              screenOptions={{
                title: appName,
                headerShown: false,
                header: CustomStackNavigatorHeader,
              }}
            >
              <Stack.Screen name={RouteDefinition.MAIN} component={MainEntry} />
              <Stack.Screen
                name={RouteDefinition.CAMERA}
                component={CameraEntry}
              />
              <Stack.Screen name={RouteDefinition.TEST} component={TestEntry} />
            </Stack.Navigator>
          </NavigationContainer>
          <Snackbar
            visible={snackbarProps.visibility}
            onDismiss={() =>
              setSnackbarProps({ visibility: false, message: '' })
            }
            duration={Option.value(snackbarProps.duration, 15000)}
            style={
              snackbarProps.type === 'SUCCESS'
                ? snackbarStyle.success
                : snackbarProps.type === 'WARNING'
                ? snackbarStyle.warning
                : snackbarProps.type === 'ERROR'
                ? snackbarStyle.error
                : snackbarStyle.default
            }
            action={{
              label: Option.value(snackbarProps.label, ''),
              onPress: () => {},
            }}
          >
            {snackbarProps.message}
          </Snackbar>
        </ApplicationContextProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
