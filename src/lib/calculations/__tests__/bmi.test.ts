import { calculateBMI, classifyAdultBmi, interpretBmi } from '../bmi';

describe('BMI', () => {
  test('calculates WHO BMI formula', () => {
    expect(calculateBMI(70, 175)).toBeCloseTo(22.857, 3);
  });

  test('rejects non-positive inputs', () => {
    expect(() => calculateBMI(0, 170)).toThrow();
    expect(() => calculateBMI(70, 0)).toThrow();
  });

  test('classifies adult WHO categories', () => {
    expect(classifyAdultBmi(18.49)).toBe('underweight');
    expect(classifyAdultBmi(18.5)).toBe('normal');
    expect(classifyAdultBmi(24.9)).toBe('normal');
    expect(classifyAdultBmi(25)).toBe('overweight');
    expect(classifyAdultBmi(30)).toBe('obesity_class_i');
    expect(classifyAdultBmi(35)).toBe('obesity_class_ii');
    expect(classifyAdultBmi(40)).toBe('obesity_class_iii');
  });

  test('does not apply adult categories to children', () => {
    const result = interpretBmi(30, 130, 8);
    expect(result.interpretable).toBe(false);
    expect(result.category).toBeNull();
    expect(result.reason).toMatch(/age- and sex-specific/);
  });

  test('does not apply adult categories to adolescents', () => {
    const result = interpretBmi(60, 165, 15);
    expect(result.interpretable).toBe(false);
    expect(result.category).toBeNull();
  });

  test('applies adult categories at age 18+', () => {
    const result = interpretBmi(70, 175, 30);
    expect(result.interpretable).toBe(true);
    expect(result.category).toBe('normal');
  });
});
