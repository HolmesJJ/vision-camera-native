/**
 * ApplicationContext.ts
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Application Context to get app related info
 * @barrel hooks
 * @barrel export ApplicationContext
 */

import React from 'react';

import { Type as SnackbarType } from 'models/SnackbarTypes';
import { name as defaultAppName } from '../../app.json';

export interface ApplicationContext {
  appName: string;
  showSnackbar: (
    message: string,
    label?: string,
    duration?: number,
    type?: SnackbarType,
  ) => void;
}

const Context = React.createContext<ApplicationContext>({
  appName: defaultAppName,
  showSnackbar: () => {},
});

export const Provider = Context.Provider;

export function useApplicationContext(): ApplicationContext {
  return React.useContext(Context);
}
