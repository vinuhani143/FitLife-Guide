import type { FoodRecord } from '@/src/types/food';
import { EMPTY_NUTRITION } from '@/src/data/foods/schema';
import { calculateNutrition, scaleNutrient } from '../nutrition';

const highFood: FoodRecord = {
  id: 'test-banana',
  nameEn: 'Banana',
  nameTe: 'test',
  category: 'fruits',
  subcategory: 'tropical',
  state: 'raw',
  searchTerms: [],
  usdaDescription: 'Bananas, raw',
  scientificName: null,
  fdcId: 173944,
  ndbNumber: null,
  publicationDate: '2019-04-01',
  usdaCategory: null,
  nutritionAvailable: true,
  confidence: 'HIGH',
  nutrition: { ...EMPTY_NUTRITION, energyKcal: 89, proteinG: 1.09 },
  portions: [],
  serving: { defaultAmount: 118, unit: 'g', basis: 'per_100g', commonLabelEn: '1 medium' },
  source: {
    organization: 'USDA',
    database: 'SR Legacy',
    reference: 'FDC ID 173944',
    year: 2018,
    country: 'United States',
    dataBasis: 'per 100 g',
    verifiedDate: '2026-08-16',
  },
};

const unverified: FoodRecord = {
  ...highFood,
  id: 'ragi-raw',
  nutritionAvailable: false,
  confidence: 'UNVERIFIED',
  nutrition: { ...EMPTY_NUTRITION },
};

describe('nutrition scaling', () => {
  test('scales from per 100 g without excessive rounding', () => {
    expect(scaleNutrient(89, 150)).toBeCloseTo(133.5);
    const scaled = calculateNutrition(highFood, 150);
    expect(scaled.values.energyKcal).toBeCloseTo(133.5);
    expect(scaled.calculationNote).toContain('100 g = 89 kcal');
    expect(scaled.calculationNote).toContain('150 g = 133.5 kcal');
    expect(scaled.usedInCalculations).toBe(true);
  });

  test('does not invent values for unverified foods', () => {
    const scaled = calculateNutrition(unverified, 100);
    expect(scaled.available).toBe(false);
    expect(scaled.usedInCalculations).toBe(false);
    expect(scaled.values.energyKcal).toBeNull();
    expect(scaled.calculationNote).toBe('Verified nutritional data not available');
  });

  test('keeps null when the source value is missing', () => {
    expect(scaleNutrient(null, 100)).toBeNull();
  });
});
