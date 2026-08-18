import { assertTemplateUsesVerifiedDietFoods, buildPlannedDay, buildTimelineMealPlan } from '../dayMealPlan';
import { isVegetarianFood } from '../../foodDiet';
import { getFoodById } from '@/src/data/foods';

describe('day meal plan', () => {
  test('templates only use verified catalog foods and keep veg lists vegetarian', () => {
    expect(assertTemplateUsesVerifiedDietFoods()).toEqual([]);
  });

  test('builds one day per estimated timeline day and stays near the energy target', () => {
    const days = buildTimelineMealPlan({
      estimatedDays: 10,
      dietType: 'vegetarian',
      targetKcal: 1800,
      startDateIso: '2026-08-16',
    });
    expect(days).toHaveLength(10);
    expect(days[0].dateIso).toBe('2026-08-16');
    expect(days[9].dateIso).toBe('2026-08-25');
    for (const day of days) {
      expect(day.items.length).toBeGreaterThan(3);
      expect(Math.abs(day.totalEnergyKcal - 1800) / 1800).toBeLessThan(0.25);
      for (const item of day.items) {
        const food = getFoodById(item.foodId)!;
        expect(isVegetarianFood(food)).toBe(true);
        expect(item.energyKcal).toBeGreaterThan(0);
      }
    }
  });

  test('non-veg plan includes an animal-source food', () => {
    const day = buildPlannedDay({
      dayNumber: 1,
      dateIso: '2026-08-16',
      dietType: 'non_vegetarian',
      targetKcal: 2000,
    });
    expect(day.items.some((item) => !isVegetarianFood(getFoodById(item.foodId)!))).toBe(true);
  });
});
