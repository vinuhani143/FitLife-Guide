import type { FitnessInputs } from '@/src/types/profile';

export const WHO_ACTIVITY_SOURCE = {
  sourceName: 'WHO Guidelines on Physical Activity and Sedentary Behaviour',
  sourceOrganization: 'World Health Organization',
  sourceReference: 'WHO. Guidelines on physical activity and sedentary behaviour. Geneva: World Health Organization; 2020.',
  sourceYear: 2020,
  adultAerobic:
    'Adults: 150–300 minutes of moderate-intensity aerobic activity per week, or 75–150 minutes of vigorous activity, or an equivalent combination.',
  adultStrength: 'Muscle-strengthening activities on 2 or more days per week.',
};

export const COMPENDIUM_SOURCE = {
  sourceName: '2011 Compendium of Physical Activities',
  sourceOrganization: 'Ainsworth et al., Medicine & Science in Sports & Exercise',
  sourceReference:
    'Ainsworth BE, Haskell WL, Herrmann SD, et al. 2011 Compendium of Physical Activities: a second update of codes and MET values. Med Sci Sports Exerc. 2011;43(8):1575-1581.',
  sourceYear: 2011,
  formula: 'Estimated kcal = MET × body weight (kg) × duration (hours)',
};

export type FitnessProfileResult =
  | {
      status: 'insufficient';
      message: string;
    }
  | {
      status: 'estimated';
      score: number;
      band: 'developing' | 'building' | 'established' | 'high';
      notes: string[];
      inputsUsed: number;
    };

function countProvided(inputs: FitnessInputs): number {
  return Object.values(inputs).filter((value) => value != null).length;
}

/**
 * Educational fitness profile from user-entered measures.
 * This is not a clinical fitness age and is not a diagnosis.
 */
export function estimateFitnessProfile(inputs: FitnessInputs, age: number | null): FitnessProfileResult {
  const inputsUsed = countProvided(inputs);
  if (inputsUsed < 3) {
    return {
      status: 'insufficient',
      message: 'Not enough data to estimate fitness profile.',
    };
  }

  let points = 0;
  let max = 0;
  const notes: string[] = [];

  if (inputs.weeklyModerateMinutes != null || inputs.weeklyVigorousMinutes != null) {
    max += 30;
    const moderate = inputs.weeklyModerateMinutes ?? 0;
    const vigorous = inputs.weeklyVigorousMinutes ?? 0;
    const equivalent = moderate + vigorous * 2;
    if (equivalent >= 300) points += 30;
    else if (equivalent >= 150) points += 22;
    else if (equivalent >= 75) points += 12;
    else points += 5;
    notes.push('Aerobic minutes are compared with the WHO 2020 adult recommendation (150–300 moderate minutes or equivalent).');
  }

  if (inputs.strengthDaysPerWeek != null) {
    max += 20;
    if (inputs.strengthDaysPerWeek >= 3) points += 20;
    else if (inputs.strengthDaysPerWeek >= 2) points += 16;
    else if (inputs.strengthDaysPerWeek >= 1) points += 8;
    notes.push('Strength-training frequency is compared with the WHO 2020 adult recommendation of 2 or more days per week.');
  }

  if (inputs.restingHeartRateBpm != null) {
    max += 15;
    const rhr = inputs.restingHeartRateBpm;
    if (rhr >= 40 && rhr < 60) points += 15;
    else if (rhr < 70) points += 11;
    else if (rhr < 80) points += 7;
    else if (rhr <= 100) points += 4;
    notes.push(
      'Resting heart rate is interpreted only as a general adult observation. The American Heart Association describes a typical adult resting heart rate range of about 60–100 beats per minute. This is not a diagnosis.',
    );
  }

  if (inputs.pushUps != null) {
    max += 10;
    if (inputs.pushUps >= 20) points += 10;
    else if (inputs.pushUps >= 10) points += 6;
    else points += 3;
  }

  if (inputs.sitToStandReps != null) {
    max += 10;
    if (inputs.sitToStandReps >= 14) points += 10;
    else if (inputs.sitToStandReps >= 10) points += 6;
    else points += 3;
  }

  if (inputs.flexibilitySelfScore != null) {
    max += 8;
    points += Math.min(8, Math.max(0, inputs.flexibilitySelfScore));
  }

  if (age != null && age >= 65 && inputs.balanceSelfScore != null) {
    max += 7;
    points += Math.min(7, Math.max(0, inputs.balanceSelfScore));
  } else if (inputs.walkRunMinutesPerWeek != null) {
    max += 7;
    if (inputs.walkRunMinutesPerWeek >= 150) points += 7;
    else if (inputs.walkRunMinutesPerWeek >= 75) points += 4;
    else points += 2;
  }

  const score = max === 0 ? 0 : Math.round((points / max) * 100);
  const band = score >= 80 ? 'high' : score >= 60 ? 'established' : score >= 40 ? 'building' : 'developing';

  return {
    status: 'estimated',
    score,
    band,
    notes,
    inputsUsed,
  };
}

export function weeklyAerobicEquivalent(moderateMinutes: number, vigorousMinutes: number): number {
  return moderateMinutes + vigorousMinutes * 2;
}

export function meetsWhoAerobic(moderateMinutes: number, vigorousMinutes: number): boolean {
  return weeklyAerobicEquivalent(moderateMinutes, vigorousMinutes) >= 150;
}

export function estimateActivityKcal(met: number, weightKg: number, durationMinutes: number): number {
  if (met <= 0 || weightKg <= 0 || durationMinutes <= 0) {
    throw new Error('MET, weight and duration must be positive.');
  }
  return met * weightKg * (durationMinutes / 60);
}
