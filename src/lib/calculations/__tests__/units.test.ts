import { ageFromDateOfBirth, cmToFeetInches, feetInchesToCm, kgToLb, lbToKg, lifeStageFromAge } from '../units';

describe('units', () => {
  test('mass conversion', () => {
    expect(kgToLb(70)).toBeCloseTo(154.324, 3);
    expect(lbToKg(154.323582526)).toBeCloseTo(70, 3);
  });

  test('height conversion', () => {
    expect(feetInchesToCm(5, 9)).toBeCloseTo(175.26, 2);
    const back = cmToFeetInches(175.26);
    expect(back.feet).toBe(5);
    expect(back.inches).toBeCloseTo(9, 1);
  });

  test('age and life stage', () => {
    expect(ageFromDateOfBirth('2000-01-01', new Date('2026-01-01'))).toBe(26);
    expect(lifeStageFromAge(8)).toBe('child');
    expect(lifeStageFromAge(15)).toBe('adolescent');
    expect(lifeStageFromAge(30)).toBe('adult');
    expect(lifeStageFromAge(70)).toBe('older_adult');
  });
});
