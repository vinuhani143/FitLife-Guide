import { interpretBmi } from '@/src/lib/calculations/bmi';
import { calculateBMR } from '@/src/lib/calculations/bmr';
import { estimateEnergyTarget } from '@/src/lib/calculations/goals';
import { calculateHealthyWeightRange } from '@/src/lib/calculations/healthyWeight';
import { calculateTDEE } from '@/src/lib/calculations/tdee';
import { ageFromDateOfBirth, lifeStageFromAge } from '@/src/lib/calculations/units';
import { estimateProteinTargetG, estimateWeightPlan } from '@/src/lib/calculations/weightPlan';
import { useApp } from '@/src/store/AppProvider';

export function useBodyMetrics() {
  const { profile } = useApp();
  const age = profile.dateOfBirth ? ageFromDateOfBirth(profile.dateOfBirth) : null;
  const lifeStage = age != null ? lifeStageFromAge(age) : null;
  const canBody = profile.weightKg != null && profile.heightCm != null && profile.weightKg > 0 && profile.heightCm > 0;
  const bmi = canBody ? interpretBmi(profile.weightKg!, profile.heightCm!, age) : null;
  const healthy = canBody ? calculateHealthyWeightRange(profile.heightCm!) : null;
  let bmr = null;
  let tdee = null;
  let target = null;
  if (canBody && age != null && profile.sex !== 'unspecified') {
    bmr = calculateBMR(profile.weightKg!, profile.heightCm!, age, profile.sex);
    tdee = calculateTDEE(bmr.bmrKcal, profile.activityLevel);
    target = estimateEnergyTarget(tdee, profile.goal, profile.sex);
  }
  const plan = estimateWeightPlan({
    currentKg: profile.weightKg,
    targetKg: profile.targetWeightKg,
    goal: profile.goal,
    dailyAdjustmentKcal: target?.adjustmentKcal ?? null,
  });
  const proteinTargetG = estimateProteinTargetG(profile.weightKg);
  return { profile, age, lifeStage, bmi, healthy, bmr, tdee, target, plan, proteinTargetG, canBody };
}
