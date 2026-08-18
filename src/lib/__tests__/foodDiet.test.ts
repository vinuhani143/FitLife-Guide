import { foodFitsDietPreference, isVegetarianFood } from '../foodDiet';
import { foods, getFoodById } from '@/src/data/foods';

describe('food diet', () => {
  test('marks meat, egg, and mixed dishes as non-vegetarian', () => {
    expect(isVegetarianFood(getFoodById('idli')!)).toBe(true);
    expect(isVegetarianFood(getFoodById('dal')!)).toBe(true);
    expect(isVegetarianFood(getFoodById('yogurt-plain-whole')!)).toBe(true);
    expect(isVegetarianFood(getFoodById('chicken-curry')!)).toBe(false);
    expect(isVegetarianFood(getFoodById('egg-boiled')!)).toBe(false);
    expect(isVegetarianFood(getFoodById('hamburger')!)).toBe(false);
    expect(isVegetarianFood(getFoodById('prawns-cooked')!)).toBe(false);
    expect(isVegetarianFood(getFoodById('fish-cooked')!)).toBe(false);
    expect(foods.some((food) => food.id === 'chicken-biryani' && !isVegetarianFood(food))).toBe(true);
  });

  test('goal lists are veg-only or non-veg-only', () => {
    expect(foodFitsDietPreference(getFoodById('dal')!, 'vegetarian')).toBe(true);
    expect(foodFitsDietPreference(getFoodById('chicken-curry')!, 'vegetarian')).toBe(false);
    expect(foodFitsDietPreference(getFoodById('chicken-curry')!, 'non_vegetarian')).toBe(true);
    expect(foodFitsDietPreference(getFoodById('dal')!, 'non_vegetarian')).toBe(false);
  });
});
