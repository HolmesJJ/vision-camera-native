/**
 * FoodEntry.ts
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Food Page Style Sheet
 * @barrel hook
 */

import { StyleSheet } from 'react-native';

export function useFoodEntry() {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    input: {
      marginBottom: 20,
      width: '100%',
    },
    button: {
      marginBottom: 20,
      width: 150,
    },
    image: {
      width: 300,
      height: 300,
      marginBottom: 20,
    },
    tableContainer: {
      marginTop: 20,
      width: '100%',
    },
    tableRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    tableLabel: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    tableValue: {
      fontSize: 16,
    },
  });
}
