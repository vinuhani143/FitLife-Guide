import type { Goal, Sex } from '@/src/types/profile';

export const GOAL_SOURCE = {
  sourceName: 'Educational energy-target method',
  sourceReference:
    'Targets are modest adjustments to estimated TDEE. They are not prescribed medical diets. Extreme deficits are not used.',
  sourceYear: null,
};

export type EnergyTarget = {
  targetKcal: number | null;
  label: 'estimated_target';
  adjustmentKcal: number;
  caution: string | null;
};

/**
 * Educational estimated target only. Never an individualized medical prescription.
 * Weight-loss deficit is capped at 500 kcal and never more than 20% of TDEE.
 */
export function estimateEnergyTarget(tdee: number, goal: Goal, sex: Sex): EnergyTarget {
  if (tdee <= 0) {
    throw new Error('TDEE must be positive.');
  }
  let adjustment = 0;
  if (goal === 'weight_loss') {
    adjustment = -Math.min(500, tdee * 0.2);
  } else if (goal === 'weight_gain' || goal === 'muscle_strength') {
    adjustment = Math.min(300, tdee * 0.1);
  }
  const raw = tdee + adjustment;
  const floor = sex === 'female' ? 1200 : sex === 'male' ? 1500 : 1200;
  let target = raw;
  let caution: string | null = null;
  if (goal === 'weight_loss' && raw < floor) {
    target = Math.max(raw, floor);
    caution =
      'The calculated deficit would go below a commonly used adult energy floor used for unsupervised tracking. This app does not recommend very-low-calorie diets. Discuss individual needs with a qualified professional.';
  }
  return {
    targetKcal: target,
    label: 'estimated_target',
    adjustmentKcal: target - tdee,
    caution,
  };
}
