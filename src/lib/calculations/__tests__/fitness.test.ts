import { estimateActivityKcal, estimateFitnessProfile, meetsWhoAerobic } from '../fitness';
import { defaultFitnessInputs } from '@/src/store/defaults';

describe('fitness profile', () => {
  test('requires at least three inputs', () => {
    const result = estimateFitnessProfile(defaultFitnessInputs, 30);
    expect(result.status).toBe('insufficient');
  });

  test('does not invent a fitness age from BMI', () => {
    const result = estimateFitnessProfile(
      {
        ...defaultFitnessInputs,
        weeklyModerateMinutes: 180,
        strengthDaysPerWeek: 2,
        restingHeartRateBpm: 62,
      },
      40,
    );
    expect(result.status).toBe('estimated');
    if (result.status === 'estimated') {
      expect(result.score).toBeGreaterThan(0);
      expect(result.notes.some((note) => note.includes('WHO'))).toBe(true);
    }
  });

  test('WHO aerobic equivalent', () => {
    expect(meetsWhoAerobic(150, 0)).toBe(true);
    expect(meetsWhoAerobic(0, 75)).toBe(true);
    expect(meetsWhoAerobic(60, 0)).toBe(false);
  });

  test('estimated kcal uses MET x kg x hours', () => {
    expect(estimateActivityKcal(3.5, 70, 60)).toBeCloseTo(245);
  });
});
