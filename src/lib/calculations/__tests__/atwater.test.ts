import { atwaterBreakdown, ATWATER_KCAL_PER_G } from '../atwater';
import { getFoodById } from '@/src/data/foods';
import { calculateNutrition } from '../nutrition';
import { EMPTY_NUTRITION } from '@/src/data/foods/schema';

describe('Atwater 4-4-9 educational check', () => {
  test('uses 4 kcal/g protein, 4 kcal/g available carbs, 9 kcal/g fat, 0 for fiber and water', () => {
    expect(ATWATER_KCAL_PER_G.protein).toBe(4);
    expect(ATWATER_KCAL_PER_G.availableCarbohydrate).toBe(4);
    expect(ATWATER_KCAL_PER_G.fat).toBe(9);
    expect(ATWATER_KCAL_PER_G.fiber).toBe(0);
    expect(ATWATER_KCAL_PER_G.water).toBe(0);
  });

  test('idli textbook math is lower than USDA energy because USDA carbohydrate includes fiber', () => {
    const idli = getFoodById('idli')!;
    const math = atwaterBreakdown(idli.nutrition)!;
    expect(idli.nutrition.energyKcal).toBe(128);
    expect(idli.nutrition.proteinG).toBe(6.36);
    expect(idli.nutrition.carbohydrateG).toBe(25.0);
    expect(idli.nutrition.fatG).toBe(0.35);
    expect(idli.nutrition.fiberG).toBe(5.8);
    expect(math.availableCarbG).toBeCloseTo(19.2, 5);
    expect(math.proteinKcal).toBeCloseTo(25.44, 5);
    expect(math.availableCarbKcal).toBeCloseTo(76.8, 5);
    expect(math.fatKcal).toBeCloseTo(3.15, 5);
    expect(math.fiberKcal).toBe(0);
    expect(math.textbookKcal).toBeCloseTo(105.39, 5);
    expect(math.carbIncludingFiberKcal).toBeCloseTo(128.59, 5);
  });

  test('does not replace USDA published energy when scaling a serving', () => {
    const idli = getFoodById('idli')!;
    const scaled = calculateNutrition(idli, 100);
    expect(scaled.values.energyKcal).toBe(128);
    expect(scaled.values.energyKcal).not.toBe(atwaterBreakdown(idli.nutrition)!.textbookKcal);
  });

  test('returns null when macros are missing, and does not invent them', () => {
    expect(atwaterBreakdown({ ...EMPTY_NUTRITION, energyKcal: 100 })).toBeNull();
  });
});
