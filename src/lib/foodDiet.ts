import type { FoodRecord } from '@/src/types/food';
import type { DietType } from '@/src/types/profile';

const NON_VEG_CATEGORIES = new Set(['chicken', 'fish', 'meat', 'eggs']);

const NON_VEG_FOOD_IDS = new Set([
  'chicken-curry',
  'chicken-biryani',
  'meat-biryani',
  'mutton-gravy',
  'mutton-raw',
  'hamburger',
  'fried-chicken-pieces',
  'egg-whole-raw',
  'egg-boiled',
  'egg-omelet',
  'chicken-breast-raw',
  'chicken-breast-roasted',
  'salmon-atlantic-farmed-raw',
]);

export function isVegetarianFood(food: FoodRecord): boolean {
  if (NON_VEG_CATEGORIES.has(food.category)) return false;
  if (NON_VEG_FOOD_IDS.has(food.id)) return false;
  return true;
}

export function foodMatchesDiet(food: FoodRecord, dietType: DietType): boolean {
  if (dietType === 'vegetarian') return isVegetarianFood(food);
  return true;
}

export function filterFoodsByDiet(foods: FoodRecord[], dietType: DietType): FoodRecord[] {
  return foods.filter((food) => foodMatchesDiet(food, dietType));
}
