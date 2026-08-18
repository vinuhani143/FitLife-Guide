import { calculateBMR } from '../bmr';

describe('Mifflin-St Jeor BMR', () => {
  test('male formula 10W + 6.25H - 5A + 5', () => {
    const result = calculateBMR(80, 180, 30, 'male');
    expect(result.bmrKcal).toBe(10 * 80 + 6.25 * 180 - 5 * 30 + 5);
    expect(result.formula).toContain('+ 5');
  });

  test('female formula 10W + 6.25H - 5A - 161', () => {
    const result = calculateBMR(60, 165, 28, 'female');
    expect(result.bmrKcal).toBe(10 * 60 + 6.25 * 165 - 5 * 28 - 161);
    expect(result.formula).toContain('- 161');
  });

  test('requires specified sex', () => {
    expect(() => calculateBMR(70, 170, 25, 'unspecified')).toThrow();
  });
});
