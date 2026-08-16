import { BREAKFAST_FOOD_IDS, COMMON_MEAL_FOOD_IDS, LUNCH_FOOD_IDS, SNACK_FOOD_IDS, commonMealFoods } from '../foodSuggestions';

describe('common meal chips', () => {
  test('breakfast, lunch, and snack lists resolve to catalog foods', () => {
    expect(commonMealFoods().map((food) => food.id)).toEqual([...COMMON_MEAL_FOOD_IDS]);
    expect(commonMealFoods('breakfast').map((food) => food.id)).toEqual([...BREAKFAST_FOOD_IDS]);
    expect(commonMealFoods('lunch').map((food) => food.id)).toEqual([...LUNCH_FOOD_IDS]);
    expect(commonMealFoods('dinner').map((food) => food.id)).toEqual([...LUNCH_FOOD_IDS]);
    expect(commonMealFoods('morning_snack').map((food) => food.id)).toEqual([...SNACK_FOOD_IDS]);
  });
});
