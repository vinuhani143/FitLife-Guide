import type { NutritionValues } from './food';

export type MealSlot =
  | 'breakfast'
  | 'morning_snack'
  | 'lunch'
  | 'evening_snack'
  | 'dinner';

export type DiaryEntry = {
  id: string;
  date: string;
  meal: MealSlot;
  foodId: string;
  amountGrams: number;
  createdAt: string;
};

export type WaterEntry = {
  id: string;
  date: string;
  amountMl: number;
  createdAt: string;
};

export type ActivityEntry = {
  id: string;
  date: string;
  activityId: string;
  intensity: 'light' | 'moderate' | 'vigorous';
  durationMinutes: number;
  notes?: string;
};

export type DailyNutritionTotal = NutritionValues & {
  foodsCounted: number;
  foodsSkippedUnverified: number;
};
