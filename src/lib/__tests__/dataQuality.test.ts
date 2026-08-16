import { foods } from '@/src/data/foods';
import { canUseInDefaultCalculations, validateFoodDatabase, validateFoodNutrition } from '../dataQuality';
import { EMPTY_NUTRITION } from '@/src/data/foods/schema';
import type { FoodRecord } from '@/src/types/food';

describe('data quality', () => {
  test('seed database has no blocking validation issues', () => {
    const issues = validateFoodDatabase(foods);
    expect(issues).toEqual([]);
  });

  test('seed has unique IDs and mixed availability', () => {
    const ids = foods.map((food) => food.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(foods.some((food) => food.id === 'ragi-raw' && !food.nutritionAvailable)).toBe(true);
    expect(foods.some((food) => food.id === 'banana-raw' && food.nutrition.energyKcal === 89)).toBe(true);
  });

  test('detects missing source, negative values, and raw/cooked ambiguity', () => {
    const bad: FoodRecord = {
      id: 'bad',
      nameEn: 'Bad',
      nameTe: 'Bad',
      category: 'fruits',
      subcategory: 'x',
      state: 'raw',
      searchTerms: [],
      usdaDescription: null,
      scientificName: null,
      fdcId: null,
      ndbNumber: null,
      publicationDate: null,
      usdaCategory: null,
      nutritionAvailable: true,
      confidence: 'HIGH',
      nutrition: { ...EMPTY_NUTRITION, energyKcal: -2 },
      portions: [],
      serving: { defaultAmount: 100, unit: 'g', basis: 'per_100g', commonLabelEn: '100 g' },
      source: {
        organization: '',
        database: '',
        reference: '',
        year: null,
        country: '',
        dataBasis: '',
        verifiedDate: null,
      },
    };
    const issues = validateFoodNutrition(bad);
    expect(issues.some((issue) => issue.code === 'missing_source')).toBe(true);
    expect(issues.some((issue) => issue.code === 'negative_value')).toBe(true);
    expect(issues.some((issue) => issue.code === 'missing_basis')).toBe(true);
  });

  test('only HIGH available foods are used in default calculations', () => {
    const banana = foods.find((food) => food.id === 'banana-raw')!;
    const ragi = foods.find((food) => food.id === 'ragi-raw')!;
    expect(canUseInDefaultCalculations(banana)).toBe(true);
    expect(canUseInDefaultCalculations(ragi)).toBe(false);
  });
});
