import type { FoodRecord, NutrientKey, NutritionValues } from '@/src/types/food';
import { EMPTY_NUTRITION, NUTRIENT_KEYS } from '@/src/data/foods/schema';

export type ScaledNutrition = {
  values: NutritionValues;
  grams: number;
  basisGrams: 100;
  available: boolean;
  usedInCalculations: boolean;
  calculationNote: string;
};

export function scaleNutrient(valuePer100g: number | null, grams: number): number | null {
  if (valuePer100g == null) return null;
  return (valuePer100g * grams) / 100;
}

export function calculateNutrition(food: FoodRecord, amountGrams: number): ScaledNutrition {
  if (amountGrams <= 0) {
    throw new Error('Amount must be positive.');
  }
  if (!food.nutritionAvailable || food.confidence === 'UNVERIFIED') {
    return {
      values: { ...EMPTY_NUTRITION },
      grams: amountGrams,
      basisGrams: 100,
      available: false,
      usedInCalculations: false,
      calculationNote: 'Verified nutritional data not available',
    };
  }
  const values = { ...EMPTY_NUTRITION };
  for (const key of NUTRIENT_KEYS) {
    values[key] = scaleNutrient(food.nutrition[key], amountGrams);
  }
  const energy = food.nutrition.energyKcal;
  const note =
    energy == null
      ? `Values scaled from ${food.source.dataBasis}. Energy is not available in the source record.`
      : `How this value was calculated: 100 g = ${energy} kcal, so ${amountGrams} g = ${(energy * amountGrams) / 100} kcal. This is USDA published Energy, scaled by weight, not rebuilt from 4×protein + 4×carbs + 9×fat.`;
  return {
    values,
    grams: amountGrams,
    basisGrams: 100,
    available: true,
    usedInCalculations: food.confidence === 'HIGH',
    calculationNote: note,
  };
}

export function addNutrition(a: NutritionValues, b: NutritionValues): NutritionValues {
  const out = { ...EMPTY_NUTRITION };
  for (const key of NUTRIENT_KEYS) {
    if (a[key] == null && b[key] == null) {
      out[key] = null;
    } else {
      out[key] = (a[key] ?? 0) + (b[key] ?? 0);
    }
  }
  return out;
}

export function compareFoods(foods: FoodRecord[], grams = 100): Record<string, NutritionValues> {
  const table: Record<string, NutritionValues> = {};
  for (const food of foods) {
    table[food.id] = calculateNutrition(food, grams).values;
  }
  return table;
}

export const MACRO_KEYS: NutrientKey[] = [
  'energyKcal',
  'proteinG',
  'carbohydrateG',
  'fatG',
  'fiberG',
  'sugarG',
];

export const MINERAL_KEYS: NutrientKey[] = [
  'calciumMg',
  'ironMg',
  'magnesiumMg',
  'phosphorusMg',
  'potassiumMg',
  'sodiumMg',
  'zincMg',
];

export const VITAMIN_KEYS: NutrientKey[] = [
  'vitaminAMcg',
  'vitaminCMg',
  'vitaminDMcg',
  'vitaminEMg',
  'vitaminKMcg',
  'thiaminMg',
  'riboflavinMg',
  'niacinMg',
  'vitaminB6Mg',
  'folateMcg',
  'vitaminB12Mcg',
];
