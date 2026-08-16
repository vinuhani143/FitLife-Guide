import type { Goal } from '@/src/types/profile';
import type { NutritionValues } from '@/src/types/food';

export type IntakeBand = 'much_under' | 'a_bit_under' | 'on_track' | 'a_bit_over' | 'much_over' | 'unknown';

export type IntakeComparison = {
  energyBand: IntakeBand;
  proteinBand: IntakeBand;
  loggedKcal: number | null;
  targetKcal: number | null;
  loggedProteinG: number | null;
  proteinTargetG: number | null;
  energyMessageKey: string;
  proteinMessageKey: string;
  nextStepKey: string;
};

function bandFor(logged: number | null, target: number | null): IntakeBand {
  if (logged == null || target == null || target <= 0) return 'unknown';
  const ratio = logged / target;
  if (ratio < 0.8) return 'much_under';
  if (ratio < 0.95) return 'a_bit_under';
  if (ratio <= 1.1) return 'on_track';
  if (ratio <= 1.25) return 'a_bit_over';
  return 'much_over';
}

export function compareIntakeToNeed(input: {
  logged: NutritionValues;
  energyTargetKcal: number | null;
  proteinTargetG: number | null;
  goal: Goal;
}): IntakeComparison {
  const loggedKcal = input.logged.energyKcal;
  const loggedProteinG = input.logged.proteinG;
  const energyBand = bandFor(loggedKcal, input.energyTargetKcal);
  const proteinBand = bandFor(loggedProteinG, input.proteinTargetG);

  let energyMessageKey = 'coach.energy.unknown';
  if (energyBand === 'on_track') energyMessageKey = 'coach.energy.onTrack';
  else if (energyBand === 'much_under' || energyBand === 'a_bit_under') energyMessageKey = 'coach.energy.under';
  else if (energyBand === 'a_bit_over' || energyBand === 'much_over') energyMessageKey = 'coach.energy.over';

  let proteinMessageKey = 'coach.protein.unknown';
  if (proteinBand === 'on_track' || proteinBand === 'a_bit_over' || proteinBand === 'much_over') {
    proteinMessageKey = 'coach.protein.enough';
  } else if (proteinBand === 'much_under' || proteinBand === 'a_bit_under') {
    proteinMessageKey = 'coach.protein.under';
  }

  let nextStepKey = 'coach.next.logMore';
  if (energyBand === 'unknown') nextStepKey = 'coach.next.logFoods';
  else if (input.goal === 'weight_loss' && (energyBand === 'a_bit_over' || energyBand === 'much_over')) {
    nextStepKey = 'coach.next.lossOver';
  } else if (input.goal === 'weight_gain' && (energyBand === 'much_under' || energyBand === 'a_bit_under')) {
    nextStepKey = 'coach.next.gainUnder';
  } else if (energyBand === 'on_track') {
    nextStepKey = 'coach.next.keepPattern';
  }

  return {
    energyBand,
    proteinBand,
    loggedKcal,
    targetKcal: input.energyTargetKcal,
    loggedProteinG,
    proteinTargetG: input.proteinTargetG,
    energyMessageKey,
    proteinMessageKey,
    nextStepKey,
  };
}
