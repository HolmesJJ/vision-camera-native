/**
 * FoodEntry.tsx
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Entry point for Food Scene
 */

import React from 'react';
import { Image, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, TextInput } from 'react-native-paper';
import 'react-native-reanimated';
import * as Colors from 'styles/Colors';

import { RouteDefinition, StackScreenProps } from 'components/navigators';
import { useFoodEntry as useStyles } from 'styles/food';

export interface IFoodEntryProps
  extends StackScreenProps<RouteDefinition.FOOD> {}

export function FoodEntry(_props: IFoodEntryProps) {
  const styles = useStyles();
  const [id, setId] = React.useState('075779311145');
  const [productInfo, setProductInfo] = React.useState({
    imageUrl: '',
    energyKcal: '',
    energyKj: '',
    fat: '',
    carbohydrates: '',
    sugars: '',
    fiber: '',
    proteins: '',
    salt: '',
    ingredients: '',
  });

  const fetchProductData = async () => {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.net/api/v2/product/${id}`,
      );
      const data = await response.json();
      const { product } = data;
      setProductInfo({
        imageUrl: product.image_url,
        energyKcal: product.nutriments['energy-kcal']
          ? product.nutriments['energy-kcal'].toFixed(2)
          : 'N/A',
        energyKj: product.nutriments.energy
          ? product.nutriments.energy.toFixed(2)
          : 'N/A',
        fat: product.nutriments.fat ? product.nutriments.fat.toFixed(2) : 'N/A',
        carbohydrates: product.nutriments.carbohydrates
          ? product.nutriments.carbohydrates.toFixed(2)
          : 'N/A',
        sugars: product.nutriments.sugars
          ? product.nutriments.sugars.toFixed(2)
          : 'N/A',
        fiber: product.nutriments.fiber
          ? product.nutriments.fiber.toFixed(2)
          : 'N/A',
        proteins: product.nutriments.proteins
          ? product.nutriments.proteins.toFixed(2)
          : 'N/A',
        salt: product.nutriments.salt
          ? product.nutriments.salt.toFixed(2)
          : 'N/A',
        ingredients: product.ingredients_text
          ? product.ingredients_text
          : 'N/A',
      });
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.black} barStyle="light-content" />
      <View style={styles.container}>
        <TextInput
          label="Product ID"
          value={id}
          onChangeText={(text) => setId(text)}
          mode="outlined"
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={fetchProductData}
          style={styles.button}
        >
          CHECK
        </Button>
        {productInfo.imageUrl ? (
          <Image source={{ uri: productInfo.imageUrl }} style={styles.image} />
        ) : null}
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Energy (kcal):</Text>
            <Text style={styles.tableValue}>
              {productInfo.energyKcal} kcal/100g
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Energy (kJ):</Text>
            <Text style={styles.tableValue}>
              {productInfo.energyKj} kJ/100g
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Fat:</Text>
            <Text style={styles.tableValue}>{productInfo.fat} g/100g</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Carbohydrates:</Text>
            <Text style={styles.tableValue}>
              {productInfo.carbohydrates} g/100g
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Sugars:</Text>
            <Text style={styles.tableValue}>{productInfo.sugars} g/100g</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Fiber:</Text>
            <Text style={styles.tableValue}>{productInfo.fiber} g/100g</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Proteins:</Text>
            <Text style={styles.tableValue}>{productInfo.proteins} g/100g</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Salt:</Text>
            <Text style={styles.tableValue}>{productInfo.salt} g/100g</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Ingredients:</Text>
            <Text style={styles.tableValue}>{productInfo.ingredients}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
