import { FOOD_CATEGORIES, FOOD_STATES, NUTRIENT_KEYS } from '@/src/data/foods/schema';
import type { FoodRecord } from '@/src/types/food';

export type ValidationIssue = {
  foodId: string;
  code:
    | 'missing_source'
    | 'missing_basis'
    | 'negative_value'
    | 'missing_units'
    | 'raw_cooked_ambiguity'
    | 'duplicate_id'
    | 'unverified_used_as_high'
    | 'zero_used_without_source_value';
  message: string;
};

export function validateFoodNutrition(food: FoodRecord): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!food.source?.organization || !food.source.database || !food.source.reference) {
    issues.push({
      foodId: food.id,
      code: 'missing_source',
      message: 'Food is missing organization, database, or reference.',
    });
  }
  if (!food.source?.dataBasis || !food.serving?.basis) {
    issues.push({
      foodId: food.id,
      code: 'missing_basis',
      message: 'Food is missing a data basis (for example per 100 g).',
    });
  }
  if (!food.serving?.unit) {
    issues.push({
      foodId: food.id,
      code: 'missing_units',
      message: 'Food serving is missing a unit.',
    });
  }
  if (!FOOD_STATES.includes(food.state)) {
    issues.push({
      foodId: food.id,
      code: 'raw_cooked_ambiguity',
      message: 'Food state is missing or not a recognized raw/cooked/dry state.',
    });
  }
  if (!FOOD_CATEGORIES.includes(food.category)) {
    issues.push({
      foodId: food.id,
      code: 'raw_cooked_ambiguity',
      message: `Unrecognized food category: ${food.category}`,
    });
  }
  for (const key of NUTRIENT_KEYS) {
    const value = food.nutrition[key];
    if (value != null && value < 0) {
      issues.push({
        foodId: food.id,
        code: 'negative_value',
        message: `${key} is negative.`,
      });
    }
  }
  if (food.confidence === 'HIGH' && !food.nutritionAvailable) {
    issues.push({
      foodId: food.id,
      code: 'unverified_used_as_high',
      message: 'Unavailable nutrition cannot be HIGH confidence.',
    });
  }
  if (food.confidence === 'UNVERIFIED' && food.nutritionAvailable) {
    issues.push({
      foodId: food.id,
      code: 'unverified_used_as_high',
      message: 'UNVERIFIED foods must not be marked as available for calculations.',
    });
  }
  return issues;
}

export function validateFoodDatabase(foods: FoodRecord[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seen = new Set<string>();
  for (const food of foods) {
    if (seen.has(food.id)) {
      issues.push({
        foodId: food.id,
        code: 'duplicate_id',
        message: `Duplicate food ID ${food.id}`,
      });
    }
    seen.add(food.id);
    issues.push(...validateFoodNutrition(food));
  }
  return issues;
}

export function canUseInDefaultCalculations(food: FoodRecord): boolean {
  return food.nutritionAvailable && food.confidence === 'HIGH' && food.source.dataBasis === 'per 100 g';
}
