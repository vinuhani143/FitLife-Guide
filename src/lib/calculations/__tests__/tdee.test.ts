import { ACTIVITY_FACTORS, calculateTDEE } from '../tdee';

describe('TDEE', () => {
  test('uses requested activity multipliers', () => {
    expect(ACTIVITY_FACTORS.sedentary).toBe(1.2);
    expect(ACTIVITY_FACTORS.lightly_active).toBe(1.375);
    expect(ACTIVITY_FACTORS.moderately_active).toBe(1.55);
    expect(ACTIVITY_FACTORS.very_active).toBe(1.725);
    expect(ACTIVITY_FACTORS.extra_active).toBe(1.9);
  });

  test('multiplies BMR by activity factor', () => {
    expect(calculateTDEE(1600, 'moderately_active')).toBeCloseTo(2480);
  });
});
