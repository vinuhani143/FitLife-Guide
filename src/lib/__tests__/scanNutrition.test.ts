import { catalogMatchesForScan, parseOpenFoodFactsProduct } from '../scanNutrition';

describe('scan nutrition', () => {
  test('copies Open Food Facts per 100 g values without inventing missing nutrients', () => {
    const parsed = parseOpenFoodFactsProduct('1234567890123', {
      status: 1,
      product: {
        product_name: 'Plain yogurt',
        brands: 'Example',
        nutriments: {
          'energy-kcal_100g': 61,
          proteins_100g: 3.5,
          carbohydrates_100g: 4.7,
          fat_100g: 3.3,
        },
      },
    });
    expect(parsed.found).toBe(true);
    expect(parsed.available).toBe(true);
    expect(parsed.per100g.energyKcal).toBe(61);
    expect(parsed.per100g.proteinG).toBe(3.5);
    expect(parsed.per100g.fiberG).toBeNull();
    expect(parsed.sourceName).toBe('Open Food Facts');
  });

  test('matches scanned names to verified catalog foods', () => {
    const matches = catalogMatchesForScan('idli coconut chutney', 'vegetarian');
    expect(matches.some((food) => food.id === 'idli')).toBe(true);
    expect(matches.some((food) => food.id === 'chicken-curry')).toBe(false);
  });
});
