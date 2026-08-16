import {
  ageFromDateOfBirth,
  cmToFeetInches,
  feetInchesToCm,
  kgToLb,
  lbToKg,
  lifeStageFromAge,
  normalizeDateOfBirth,
  parseLocaleNumber,
  addDaysIso,
} from '../units';

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
    expect(ageFromDateOfBirth('01/01/2000', new Date('2026-01-01'))).toBe(26);
    expect(ageFromDateOfBirth('01-01-2000', new Date('2026-01-01'))).toBe(26);
    expect(lifeStageFromAge(8)).toBe('child');
    expect(lifeStageFromAge(15)).toBe('adolescent');
    expect(lifeStageFromAge(30)).toBe('adult');
    expect(lifeStageFromAge(70)).toBe('older_adult');
  });

  test('normalizes common date formats', () => {
    expect(normalizeDateOfBirth('1995-08-15')).toBe('1995-08-15');
    expect(normalizeDateOfBirth('15/08/1995')).toBe('1995-08-15');
    expect(normalizeDateOfBirth('15-8-1995')).toBe('1995-08-15');
    expect(normalizeDateOfBirth('32/01/1995')).toBeNull();
    expect(normalizeDateOfBirth('not-a-date')).toBeNull();
  });

  test('parses locale numbers', () => {
    expect(parseLocaleNumber('162,5')).toBe(162.5);
    expect(parseLocaleNumber('1,250')).toBe(1250);
    expect(parseLocaleNumber('58.2')).toBe(58.2);
    expect(parseLocaleNumber('')).toBeNull();
    expect(parseLocaleNumber('abc')).toBeNull();
  });

  test('adds calendar days to an ISO date', () => {
    expect(addDaysIso('2026-08-16', 9)).toBe('2026-08-25');
    expect(addDaysIso('2026-01-30', 2)).toBe('2026-02-01');
  });
});
