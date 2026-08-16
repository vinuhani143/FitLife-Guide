import { EMPTY_NUTRITION } from '@/src/data/foods/schema';
import { compareIntakeToNeed } from '../intakeCoach';
import { estimateProteinTargetG, estimateWeeklyKgFromAdjustment, estimateWeightPlan } from '../weightPlan';

describe('weight plan', () => {
  test('estimates days from a capped educational deficit', () => {
    const weekly = estimateWeeklyKgFromAdjustment(-500);
    expect(weekly).toBeCloseTo((500 * 7) / 7700, 5);
    expect(weekly).toBeLessThanOrEqual(0.5);

    const plan = estimateWeightPlan({
      currentKg: 80,
      targetKg: 75,
      goal: 'weight_loss',
      dailyAdjustmentKcal: -500,
    });
    expect(plan.status).toBe('estimated');
    expect(plan.estimatedDays).toBe(Math.round((5 / weekly) * 7));
  });

  test('weight gain needs a higher target', () => {
    const plan = estimateWeightPlan({
      currentKg: 55,
      targetKg: 50,
      goal: 'weight_gain',
      dailyAdjustmentKcal: 300,
    });
    expect(plan.status).toBe('target_mismatch');
  });

  test('protein target uses WHO 0.83 g/kg', () => {
    expect(estimateProteinTargetG(70)).toBeCloseTo(58.1, 5);
  });
});

describe('intake coach', () => {
  test('flags energy above the estimated target', () => {
    const result = compareIntakeToNeed({
      logged: { ...EMPTY_NUTRITION, energyKcal: 2300, proteinG: 40 },
      energyTargetKcal: 1800,
      proteinTargetG: 58,
      goal: 'weight_loss',
    });
    expect(result.energyBand).toBe('much_over');
    expect(result.nextStepKey).toBe('coach.next.lossOver');
    expect(result.proteinMessageKey).toBe('coach.protein.under');
  });
});
