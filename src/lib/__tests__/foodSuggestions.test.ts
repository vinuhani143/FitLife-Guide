import { BREAKFAST_FOOD_IDS, COMMON_MEAL_FOOD_IDS, LUNCH_FOOD_IDS, NON_VEG_DIARY_FOOD_IDS, SNACK_FOOD_IDS, commonMealFoods, nonVegDiaryFoods } from '../foodSuggestions';
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

  test('non-veg diary list includes chicken, mutton, fish, prawns, and eggs', () => {
    expect(nonVegDiaryFoods().map((food) => food.id)).toEqual([...NON_VEG_DIARY_FOOD_IDS]);
    expect(NON_VEG_DIARY_FOOD_IDS).toEqual(expect.arrayContaining([
      'chicken-curry',
      'mutton-gravy',
      'fish-cooked',
      'prawns-cooked',
      'egg-boiled',
    ]));
  });
});
