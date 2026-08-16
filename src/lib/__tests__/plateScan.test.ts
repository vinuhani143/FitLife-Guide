import { gramsForSize, plateCandidateIds, plateItemNutrition, plateTotals, sizeOptionsForFood } from '../plateScan';

describe('plate scan sizes', () => {
  test('idli and vada sizes use official USDA piece weights', () => {
    const idli = sizeOptionsForFood('idli');
    expect(idli.map((item) => item.grams)).toEqual([76, 152, 228]);
    expect(gramsForSize('idli', 'small')).toBe(76);
    expect(sizeOptionsForFood('vada').map((item) => item.grams)).toEqual([30, 60, 90]);
  });

  test('sambar small bowl uses 100 g of USDA lentil curry, not invented sambar numbers', () => {
    const result = plateItemNutrition('sambar', 100);
    expect(result.available).toBe(true);
    expect(result.sourceFoodId).toBe('lentil-curry');
    expect(result.standIn?.foodId).toBe('lentil-curry');
    expect(result.values.energyKcal).toBe(111);
  });

  test('plate total adds selected sizes', () => {
    const total = plateTotals([
      { foodId: 'idli', size: 'small' },
      { foodId: 'vada', size: 'small' },
      { foodId: 'sambar', size: 'small' },
    ]);
    expect(total.counted).toBe(3);
    expect(total.values.energyKcal).toBeCloseTo(76 * 1.28 + 30 * 2.66 + 111, 5);
  });

  test('non-veg plate candidates include chicken, mutton, fish, prawns, and eggs', () => {
    expect(plateCandidateIds('non_vegetarian')).toEqual(expect.arrayContaining([
      'idli',
      'vada',
      'sambar',
      'chicken-curry',
      'mutton-gravy',
      'fish-cooked',
      'prawns-cooked',
      'egg-boiled',
    ]));
    expect(plateCandidateIds('vegetarian')).not.toContain('chicken-curry');
  });
});
