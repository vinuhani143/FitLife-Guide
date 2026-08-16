import { BREAKFAST_FOOD_IDS, COMMON_MEAL_FOOD_IDS, LUNCH_FOOD_IDS, SNACK_FOOD_IDS, commonMealFoods } from '../foodSuggestions';
import { isVegetarianFood } from '../foodDiet';

describe('common meal chips', () => {
  test('breakfast, lunch, and snack lists resolve to catalog foods', () => {
    expect(commonMealFoods(undefined, 'non_vegetarian').map((food) => food.id)).toEqual([...COMMON_MEAL_FOOD_IDS]);
    expect(commonMealFoods('breakfast', 'non_vegetarian').map((food) => food.id)).toEqual([...BREAKFAST_FOOD_IDS]);
    expect(commonMealFoods('lunch', 'non_vegetarian').map((food) => food.id)).toEqual([...LUNCH_FOOD_IDS]);
    expect(commonMealFoods('dinner', 'non_vegetarian').map((food) => food.id)).toEqual([...LUNCH_FOOD_IDS]);
    expect(commonMealFoods('morning_snack', 'non_vegetarian').map((food) => food.id)).toEqual([...SNACK_FOOD_IDS]);
  });

  test('vegetarian chips exclude meat and egg dishes', () => {
    expect(commonMealFoods('lunch', 'vegetarian').every(isVegetarianFood)).toBe(true);
    expect(commonMealFoods('breakfast', 'vegetarian').some((food) => food.id === 'egg-boiled')).toBe(false);
  });
});
