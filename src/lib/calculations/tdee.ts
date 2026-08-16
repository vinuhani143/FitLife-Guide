import type { ActivityLevel } from '@/src/types/profile';

export const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

export const TDEE_SOURCE = {
  sourceName: 'Estimated daily energy requirement (BMR x activity factor)',
  sourceOrganization: 'Commonly used activity factors derived from Harris-Benedict practice; PAL concepts also appear in FAO/WHO/UNU human energy requirement work',
  sourceReference:
    'Activity multipliers 1.2, 1.375, 1.55, 1.725 and 1.9 are widely used applied factors. FAO/WHO/UNU Human Energy Requirements (2004) discusses physical activity level (PAL) ranges rather than these exact five multipliers.',
  sourceYear: 2004,
  formula: 'TDEE = BMR × activity factor',
};

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  if (bmr <= 0) {
    throw new Error('BMR must be positive.');
  }
  return bmr * ACTIVITY_FACTORS[activityLevel];
}
