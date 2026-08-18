import { calculateHealthyWeightRange } from '../healthyWeight';

describe('healthy weight range', () => {
  test('uses adult BMI 18.5-24.9', () => {
    const range = calculateHealthyWeightRange(170);
    const m2 = 1.7 * 1.7;
    expect(range.minKg).toBeCloseTo(18.5 * m2);
    expect(range.maxKg).toBeCloseTo(24.9 * m2);
  });
});
