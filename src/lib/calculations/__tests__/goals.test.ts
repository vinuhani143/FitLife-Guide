import { estimateEnergyTarget } from '../goals';

describe('energy targets', () => {
  test('weight loss uses a modest capped deficit', () => {
    const result = estimateEnergyTarget(2500, 'weight_loss', 'male');
    expect(result.adjustmentKcal).toBeGreaterThanOrEqual(-500);
    expect(result.targetKcal).toBeGreaterThanOrEqual(2000);
    expect(result.label).toBe('estimated_target');
  });

  test('does not use extreme deficits', () => {
    const result = estimateEnergyTarget(1600, 'weight_loss', 'female');
    expect(result.targetKcal).toBeGreaterThanOrEqual(1200);
    expect(Math.abs(result.adjustmentKcal)).toBeLessThanOrEqual(500);
  });

  test('maintenance keeps TDEE', () => {
    const result = estimateEnergyTarget(2200, 'weight_maintenance', 'female');
    expect(result.targetKcal).toBe(2200);
  });
});
