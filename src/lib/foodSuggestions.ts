import { foods } from '@/src/data/foods';
import { canUseInDefaultCalculations } from '@/src/lib/dataQuality';
import { foodFitsDietPreference, foodMatchesDiet } from '@/src/lib/foodDiet';
import type { MealSlot } from '@/src/types/diary';
import type { FoodRecord } from '@/src/types/food';
import type { DietType, Goal } from '@/src/types/profile';

export type FoodSuggestion = {
  food: FoodRecord;
  reasonKey: string;
  energyPer100: number;
  proteinPer100: number | null;
  fiberPer100: number | null;
};

const SKIP_CATEGORIES = new Set(['oils-fats', 'snacks', 'bakery']);
const RAW_OK_CATEGORIES = new Set(['vegetables', 'fruits', 'nuts-seeds', 'millets']);

function energyDensity(food: FoodRecord): number | null {
  return food.nutrition.energyKcal;
}

function usableForGoalList(food: FoodRecord, dietType: DietType): boolean {
  if (!canUseInDefaultCalculations(food)) return false;
  if (SKIP_CATEGORIES.has(food.category)) return false;
  if (energyDensity(food) == null) return false;
  if (food.state === 'raw' && !RAW_OK_CATEGORIES.has(food.category)) return false;
  return foodFitsDietPreference(food, dietType);
}

export function suggestFoodsForGoal(goal: Goal, limit = 6, dietType: DietType = 'vegetarian'): FoodSuggestion[] {
  const verified = foods.filter((food) => usableForGoalList(food, dietType));

  const scored = verified.map((food) => {
    const energy = food.nutrition.energyKcal ?? 0;
    const protein = food.nutrition.proteinG;
    const fiber = food.nutrition.fiberG;
    const proteinPerKcal = energy > 0 && protein != null ? protein / energy : 0;
    let score = 0;
    let reasonKey = 'suggest.balanced';
    if (goal === 'weight_loss') {
      score = (fiber ?? 0) * 2 + proteinPerKcal * 80 - energy / 80;
      reasonKey = energy <= 150 ? 'suggest.lossLight' : 'suggest.lossProtein';
    } else if (goal === 'weight_gain' || goal === 'muscle_strength') {
      score = energy / 40 + (protein ?? 0);
      reasonKey = protein != null && protein >= 8 ? 'suggest.gainProtein' : 'suggest.gainEnergy';
    } else {
      score = (protein ?? 0) + (fiber ?? 0) - Math.abs(energy - 150) / 40;
      reasonKey = 'suggest.balanced';
    }
    return {
      food,
      reasonKey,
      energyPer100: energy,
      proteinPer100: protein,
      fiberPer100: fiber,
      score,
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score: _score, ...rest }) => rest);
}

export const BREAKFAST_FOOD_IDS = [
  'idli',
  'vada',
  'dosa-plain',
  'upma',
  'poori',
  'chutney',
  'sambar',
  'pongal',
  'lemon-rice',
  'vegetable-korma',
  'oats-cooked',
  'milk-whole',
  'egg-boiled',
  'banana-raw',
  'pesarattu',
  'ragi-java',
] as const;

export const LUNCH_FOOD_IDS = [
  'rice-white-cooked',
  'dal',
  'sambar',
  'rasam',
  'yogurt-plain-whole',
  'ghee',
  'chicken-curry',
  'mutton-gravy',
  'fish-cooked',
  'prawns-cooked',
  'egg-boiled',
  'egg-omelet',
  'chicken-breast-roasted',
  'vegetable-curry',
  'vegetable-fry',
  'chicken-biryani',
  'meat-biryani',
  'vegetable-biryani',
  'roti-chapati',
  'lentil-curry',
] as const;

export const NON_VEG_DIARY_FOOD_IDS = [
  'chicken-curry',
  'chicken-biryani',
  'chicken-breast-roasted',
  'fried-chicken-pieces',
  'mutton-gravy',
  'meat-biryani',
  'fish-cooked',
  'prawns-cooked',
  'egg-boiled',
  'egg-omelet',
] as const;

export const SNACK_FOOD_IDS = [
  'samosa',
  'pakora',
  'potato-chips',
  'french-fries',
  'pizza-cheese',
  'hamburger',
  'ice-cream-vanilla',
  'cola',
  'cookie-chocolate-chip',
  'graham-biscuit',
  'doughnut-plain',
  'bread-white',
  'milk-chocolate',
  'popcorn',
] as const;

export const COMMON_MEAL_FOOD_IDS = [
  'idli',
  'dosa-plain',
  'upma',
  'vada',
  'roti-chapati',
  'poori',
  'chutney',
  'dal',
  'rice-white-cooked',
  'yogurt-plain-whole',
  'vegetable-curry',
  'chicken-curry',
  'milk-whole',
  'banana-raw',
] as const;

function foodsForIds(ids: readonly string[]): FoodRecord[] {
  return ids.map((id) => foods.find((food) => food.id === id)).filter((food): food is FoodRecord => Boolean(food));
}

export function nonVegDiaryFoods(): FoodRecord[] {
  return foodsForIds(NON_VEG_DIARY_FOOD_IDS);
}

export function commonMealFoods(meal?: MealSlot, dietType: DietType = 'vegetarian'): FoodRecord[] {
  if (meal === 'breakfast') return foodsForIds(BREAKFAST_FOOD_IDS).filter((food) => foodMatchesDiet(food, dietType));
  if (meal === 'lunch' || meal === 'dinner') return foodsForIds(LUNCH_FOOD_IDS).filter((food) => foodMatchesDiet(food, dietType));
  if (meal === 'morning_snack' || meal === 'evening_snack') {
    return foodsForIds(SNACK_FOOD_IDS).filter((food) => foodMatchesDiet(food, dietType));
  }
  return foodsForIds(COMMON_MEAL_FOOD_IDS).filter((food) => foodMatchesDiet(food, dietType));
}
