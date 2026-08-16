import { foods } from '@/src/data/foods';
import { canUseInDefaultCalculations } from '@/src/lib/dataQuality';
import type { FoodRecord } from '@/src/types/food';
import type { Goal } from '@/src/types/profile';

export type FoodSuggestion = {
  food: FoodRecord;
  reasonKey: string;
  energyPer100: number;
  proteinPer100: number | null;
  fiberPer100: number | null;
};

const SKIP_CATEGORIES = new Set(['oils-fats']);

function energyDensity(food: FoodRecord): number | null {
  return food.nutrition.energyKcal;
}

export function suggestFoodsForGoal(goal: Goal, limit = 6): FoodSuggestion[] {
  const verified = foods.filter(
    (food) => canUseInDefaultCalculations(food) && !SKIP_CATEGORIES.has(food.category) && energyDensity(food) != null,
  );

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

export const COMMON_MEAL_FOOD_IDS = [
  'idli',
  'dosa-plain',
  'upma',
  'vada',
  'roti-chapati',
  'poori',
  'pesarattu',
  'ragi-java',
  'dal',
  'rice-white-cooked',
  'yogurt-plain-whole',
  'banana-raw',
] as const;

export function commonMealFoods(): FoodRecord[] {
  return COMMON_MEAL_FOOD_IDS.map((id) => foods.find((food) => food.id === id)).filter(
    (food): food is FoodRecord => Boolean(food),
  );
}
