import { getFoodById } from '@/src/data/foods';
import { addNutrition, calculateNutrition } from '@/src/lib/calculations/nutrition';
import { canUseInDefaultCalculations } from '@/src/lib/dataQuality';
import { EMPTY_NUTRITION } from '@/src/data/foods/schema';
import type { NutritionValues } from '@/src/types/food';
import type { DietType } from '@/src/types/profile';

export type SizeKey = 'small' | 'medium' | 'large';

export type SizeOption = {
  key: SizeKey;
  grams: number;
  pieceNoteEn: string;
};

export type PlateItemSelection = {
  foodId: string;
  size: SizeKey | null;
};

const STAND_IN: Record<string, { foodId: string; noteKey: string }> = {
  sambar: { foodId: 'lentil-curry', noteKey: 'scan.standIn.sambar' },
  rasam: { foodId: 'lentil-curry', noteKey: 'scan.standIn.rasam' },
  'vegetable-korma': { foodId: 'vegetable-curry', noteKey: 'scan.standIn.korma' },
  'vegetable-fry': { foodId: 'mixed-vegetables-cooked', noteKey: 'scan.standIn.fry' },
};

const SIZE_TABLE: Record<string, SizeOption[]> = {
  idli: [
    { key: 'small', grams: 76, pieceNoteEn: '2 pieces (38 g each, USDA)' },
    { key: 'medium', grams: 152, pieceNoteEn: '4 pieces' },
    { key: 'large', grams: 228, pieceNoteEn: '6 pieces' },
  ],
  vada: [
    { key: 'small', grams: 30, pieceNoteEn: '1 piece (USDA)' },
    { key: 'medium', grams: 60, pieceNoteEn: '2 pieces' },
    { key: 'large', grams: 90, pieceNoteEn: '3 pieces' },
  ],
  sambar: [
    { key: 'small', grams: 100, pieceNoteEn: '100 g bowl' },
    { key: 'medium', grams: 200, pieceNoteEn: '200 g' },
    { key: 'large', grams: 240, pieceNoteEn: '1 cup (240 g)' },
  ],
  'dosa-plain': [
    { key: 'small', grams: 35, pieceNoteEn: '1 small (USDA)' },
    { key: 'medium', grams: 95, pieceNoteEn: 'about 1 medium' },
    { key: 'large', grams: 155, pieceNoteEn: '1 large (USDA)' },
  ],
  chutney: [
    { key: 'small', grams: 16, pieceNoteEn: '1 tbsp-scale (USDA portion 16 g)' },
    { key: 'medium', grams: 32, pieceNoteEn: '2 portions' },
    { key: 'large', grams: 48, pieceNoteEn: '3 portions' },
  ],
  'egg-boiled': [
    { key: 'small', grams: 50, pieceNoteEn: '1 egg' },
    { key: 'medium', grams: 100, pieceNoteEn: '2 eggs' },
    { key: 'large', grams: 150, pieceNoteEn: '3 eggs' },
  ],
  'chicken-curry': [
    { key: 'small', grams: 120, pieceNoteEn: 'half cup' },
    { key: 'medium', grams: 240, pieceNoteEn: '1 cup (USDA)' },
    { key: 'large', grams: 360, pieceNoteEn: '1.5 cups' },
  ],
  'mutton-gravy': [
    { key: 'small', grams: 122, pieceNoteEn: 'half cup' },
    { key: 'medium', grams: 244, pieceNoteEn: '1 cup (USDA)' },
    { key: 'large', grams: 366, pieceNoteEn: '1.5 cups' },
  ],
  'rice-white-cooked': [
    { key: 'small', grams: 100, pieceNoteEn: '100 g' },
    { key: 'medium', grams: 158, pieceNoteEn: 'USDA serving' },
    { key: 'large', grams: 250, pieceNoteEn: '250 g' },
  ],
  dal: [
    { key: 'small', grams: 120, pieceNoteEn: 'half cup' },
    { key: 'medium', grams: 240, pieceNoteEn: '1 cup (USDA)' },
    { key: 'large', grams: 360, pieceNoteEn: '1.5 cups' },
  ],
  'prawns-cooked': [
    { key: 'small', grams: 85, pieceNoteEn: 'about 85 g' },
    { key: 'medium', grams: 120, pieceNoteEn: '120 g' },
    { key: 'large', grams: 180, pieceNoteEn: '180 g' },
  ],
  'fish-cooked': [
    { key: 'small', grams: 85, pieceNoteEn: 'about 85 g' },
    { key: 'medium', grams: 120, pieceNoteEn: '120 g' },
    { key: 'large', grams: 180, pieceNoteEn: '180 g' },
  ],
};

export const VEG_PLATE_FOOD_IDS = [
  'idli',
  'vada',
  'sambar',
  'dosa-plain',
  'chutney',
  'upma',
  'poori',
  'rice-white-cooked',
  'dal',
  'yogurt-plain-whole',
  'vegetable-curry',
] as const;

export const NON_VEG_PLATE_FOOD_IDS = [
  'egg-boiled',
  'egg-omelet',
  'chicken-curry',
  'fried-chicken-pieces',
  'mutton-gravy',
  'fish-cooked',
  'prawns-cooked',
  'chicken-biryani',
] as const;

export function defaultPlateFoodIds(_dietType: DietType): string[] {
  return ['idli', 'vada', 'sambar'];
}

export function plateCandidateIds(dietType: DietType): string[] {
  if (dietType === 'non_vegetarian') return [...VEG_PLATE_FOOD_IDS, ...NON_VEG_PLATE_FOOD_IDS];
  return [...VEG_PLATE_FOOD_IDS];
}

export function standInFor(foodId: string): { foodId: string; noteKey: string } | null {
  return STAND_IN[foodId] ?? null;
}

export function nutritionSourceFoodId(foodId: string): string {
  return STAND_IN[foodId]?.foodId ?? foodId;
}

export function sizeOptionsForFood(foodId: string): SizeOption[] {
  if (SIZE_TABLE[foodId]) return SIZE_TABLE[foodId];
  const food = getFoodById(nutritionSourceFoodId(foodId));
  const base = food?.serving.defaultAmount && food.serving.defaultAmount > 0 ? food.serving.defaultAmount : 100;
  return [
    { key: 'small', grams: Math.round(base * 0.5), pieceNoteEn: 'half serving' },
    { key: 'medium', grams: Math.round(base), pieceNoteEn: 'usual serving' },
    { key: 'large', grams: Math.round(base * 1.5), pieceNoteEn: 'large serving' },
  ];
}

export function gramsForSize(foodId: string, size: SizeKey): number {
  const option = sizeOptionsForFood(foodId).find((item) => item.key === size);
  return option?.grams ?? 100;
}

export function plateItemNutrition(foodId: string, grams: number) {
  const sourceId = nutritionSourceFoodId(foodId);
  const food = getFoodById(sourceId);
  if (!food || !canUseInDefaultCalculations(food)) {
    return {
      available: false,
      values: { ...EMPTY_NUTRITION },
      sourceFoodId: sourceId,
      standIn: standInFor(foodId),
    };
  }
  const scaled = calculateNutrition(food, grams);
  return {
    available: scaled.available,
    values: scaled.values,
    sourceFoodId: sourceId,
    standIn: standInFor(foodId),
  };
}

export function plateTotals(selections: PlateItemSelection[]): {
  values: NutritionValues;
  skipped: number;
  counted: number;
} {
  return selections.reduce(
    (acc, item) => {
      if (!item.size) return acc;
      const result = plateItemNutrition(item.foodId, gramsForSize(item.foodId, item.size));
      if (!result.available) return { ...acc, skipped: acc.skipped + 1 };
      return {
        values: addNutrition(acc.values, result.values),
        skipped: acc.skipped,
        counted: acc.counted + 1,
      };
    },
    { values: { ...EMPTY_NUTRITION }, skipped: 0, counted: 0 },
  );
}
