import type { Sex } from '@/src/types/profile';

export const MIFFLIN_ST_JEOR_SOURCE = {
  sourceName: 'Mifflin-St Jeor equation',
  sourceOrganization: 'American Journal of Clinical Nutrition',
  sourceReference: 'Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO. A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr. 1990;51(2):241-247.',
  sourceYear: 1990,
  maleFormula: 'BMR = 10W + 6.25H - 5A + 5',
  femaleFormula: 'BMR = 10W + 6.25H - 5A - 161',
  units: 'W = kg, H = cm, A = age in years',
};

export type BmrResult = {
  bmrKcal: number;
  formula: string;
  sexUsed: Exclude<Sex, 'unspecified'>;
};

/**
 * Estimated BMR using Mifflin-St Jeor. This is an estimate, not a measured metabolic rate.
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: Sex,
): BmrResult {
  if (weightKg <= 0 || heightCm <= 0) {
    throw new Error('Weight and height must be positive.');
  }
  if (age <= 0 || age >= 130) {
    throw new Error('Age must be a realistic positive value.');
  }
  if (sex === 'unspecified') {
    throw new Error('Mifflin-St Jeor requires female or male sex to select the equation.');
  }
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (sex === 'male') {
    return {
      bmrKcal: base + 5,
      formula: MIFFLIN_ST_JEOR_SOURCE.maleFormula,
      sexUsed: 'male',
    };
  }
  return {
    bmrKcal: base - 161,
    formula: MIFFLIN_ST_JEOR_SOURCE.femaleFormula,
    sexUsed: 'female',
  };
}
