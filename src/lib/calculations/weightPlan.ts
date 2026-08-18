import type { Goal } from '@/src/types/profile';

/**
 * Educational approximation only: 1 kg body weight ~ 7700 kcal.
 * Wishnofsky, M. Caloric equivalents of gained or lost weight. Am J Clin Nutr. 1958;6(5):542-546.
 * Real-world change is not this linear.
 */
export const WISHNOFSKY_KCAL_PER_KG = 7700;
export const WISHNOFSKY_SOURCE = {
  sourceName: 'Wishnofsky caloric equivalent of weight change',
  sourceReference:
    'Wishnofsky M. Caloric equivalents of gained or lost weight. American Journal of Clinical Nutrition. 1958;6(5):542-546. Used here only as an educational timeline estimate.',
  sourceYear: 1958,
};

/** Unsupervised educational cap. NHS commonly cites 0.5–1 kg/week; this app uses the lower end. */
export const MAX_EDUCATIONAL_WEEKLY_KG = 0.5;

export const WHO_PROTEIN_G_PER_KG = 0.83;
export const WHO_PROTEIN_SOURCE = {
  sourceName: 'WHO/FAO/UNU adult protein safe intake',
  sourceReference:
    'WHO/FAO/UNU. Protein and amino acid requirements in human nutrition. WHO Technical Report Series 935. 2007. Adult safe intake 0.83 g/kg. This is not a medical prescription.',
  sourceYear: 2007,
};

export type WeightPlanStatus =
  | 'need_profile'
  | 'need_target'
  | 'need_energy'
  | 'target_mismatch'
  | 'already_at_target'
  | 'estimated';

export type WeightPlan = {
  status: WeightPlanStatus;
  currentKg: number | null;
  targetKg: number | null;
  deltaKg: number | null;
  weeklyKg: number | null;
  estimatedDays: number | null;
  estimatedWeeks: number | null;
  dailyAdjustmentKcal: number | null;
  kcalPerKgAssumption: number;
  caution: string | null;
};

export function estimateWeeklyKgFromAdjustment(dailyAdjustmentKcal: number): number {
  const weekly = (Math.abs(dailyAdjustmentKcal) * 7) / WISHNOFSKY_KCAL_PER_KG;
  return Math.min(MAX_EDUCATIONAL_WEEKLY_KG, weekly);
}

export function estimateWeightPlan(input: {
  currentKg: number | null;
  targetKg: number | null;
  goal: Goal;
  dailyAdjustmentKcal: number | null;
}): WeightPlan {
  const base: WeightPlan = {
    status: 'need_profile',
    currentKg: input.currentKg,
    targetKg: input.targetKg,
    deltaKg: null,
    weeklyKg: null,
    estimatedDays: null,
    estimatedWeeks: null,
    dailyAdjustmentKcal: input.dailyAdjustmentKcal,
    kcalPerKgAssumption: WISHNOFSKY_KCAL_PER_KG,
    caution:
      'This timeline is an educational estimate, not a promise. Weight changes with water, glycogen, hormones, and measurement noise.',
  };

  if (input.currentKg == null || input.currentKg <= 0) {
    return { ...base, status: 'need_profile' };
  }
  if (input.goal === 'weight_maintenance' || input.goal === 'general_fitness') {
    if (input.targetKg == null) {
      return { ...base, status: 'already_at_target', deltaKg: 0 };
    }
  }
  if (input.targetKg == null || input.targetKg <= 0) {
    return { ...base, status: 'need_target' };
  }

  const deltaKg = input.targetKg - input.currentKg;
  if (Math.abs(deltaKg) < 0.25) {
    return { ...base, status: 'already_at_target', deltaKg: 0 };
  }

  const wantsLoss = input.goal === 'weight_loss';
  const wantsGain = input.goal === 'weight_gain' || input.goal === 'muscle_strength';
  if (wantsLoss && deltaKg >= 0) {
    return { ...base, status: 'target_mismatch', deltaKg };
  }
  if (wantsGain && deltaKg <= 0) {
    return { ...base, status: 'target_mismatch', deltaKg };
  }
  if (input.dailyAdjustmentKcal == null || input.dailyAdjustmentKcal === 0) {
    return { ...base, status: 'need_energy', deltaKg };
  }
  if (wantsLoss && input.dailyAdjustmentKcal > 0) {
    return { ...base, status: 'need_energy', deltaKg };
  }
  if (wantsGain && input.dailyAdjustmentKcal < 0) {
    return { ...base, status: 'need_energy', deltaKg };
  }

  const weeklyKg = estimateWeeklyKgFromAdjustment(input.dailyAdjustmentKcal);
  if (weeklyKg <= 0) {
    return { ...base, status: 'need_energy', deltaKg };
  }
  const estimatedWeeks = Math.abs(deltaKg) / weeklyKg;
  return {
    ...base,
    status: 'estimated',
    deltaKg,
    weeklyKg,
    estimatedWeeks,
    estimatedDays: Math.round(estimatedWeeks * 7),
  };
}

export function estimateProteinTargetG(weightKg: number | null): number | null {
  if (weightKg == null || weightKg <= 0) return null;
  return weightKg * WHO_PROTEIN_G_PER_KG;
}
