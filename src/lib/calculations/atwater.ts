import type { NutritionValues } from '@/src/types/food';

/** Atwater general factors taught in school: protein 4, available carbohydrate 4, fat 9. */
export const ATWATER_KCAL_PER_G = {
  protein: 4,
  availableCarbohydrate: 4,
  fat: 9,
  fiber: 0,
  water: 0,
} as const;

export type AtwaterBreakdown = {
  proteinG: number;
  fatG: number;
  carbohydrateG: number;
  fiberG: number;
  availableCarbG: number;
  proteinKcal: number;
  availableCarbKcal: number;
  fatKcal: number;
  fiberKcal: number;
  waterKcal: number;
  textbookKcal: number;
  carbIncludingFiberKcal: number;
  complete: boolean;
  fiberReported: boolean;
};

function n(value: number | null | undefined): number {
  return value ?? 0;
}

/**
 * Textbook 4-4-9 energy from macros.
 * Fiber and water count as 0 kcal. Available carbohydrate is total carbohydrate minus fiber
 * when fiber is reported. This is an educational check — it does not replace USDA Energy.
 */
export function atwaterBreakdown(values: NutritionValues): AtwaterBreakdown | null {
  if (values.proteinG == null || values.carbohydrateG == null || values.fatG == null) return null;
  const fiberReported = values.fiberG != null;
  const fiberG = n(values.fiberG);
  const availableCarbG = Math.max(0, values.carbohydrateG - fiberG);
  const proteinKcal = values.proteinG * ATWATER_KCAL_PER_G.protein;
  const availableCarbKcal = availableCarbG * ATWATER_KCAL_PER_G.availableCarbohydrate;
  const fatKcal = values.fatG * ATWATER_KCAL_PER_G.fat;
  const fiberKcal = fiberG * ATWATER_KCAL_PER_G.fiber;
  const carbIncludingFiberKcal =
    values.proteinG * ATWATER_KCAL_PER_G.protein
    + values.carbohydrateG * ATWATER_KCAL_PER_G.availableCarbohydrate
    + values.fatG * ATWATER_KCAL_PER_G.fat;
  return {
    proteinG: values.proteinG,
    fatG: values.fatG,
    carbohydrateG: values.carbohydrateG,
    fiberG,
    availableCarbG,
    proteinKcal,
    availableCarbKcal,
    fatKcal,
    fiberKcal,
    waterKcal: 0,
    textbookKcal: proteinKcal + availableCarbKcal + fatKcal + fiberKcal,
    carbIncludingFiberKcal,
    complete: true,
    fiberReported,
  };
}
