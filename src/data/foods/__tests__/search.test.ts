import { searchFoods } from '../index';

describe('food search', () => {
  test('English and Telugu names return the same ragi record', () => {
    const en = searchFoods('Ragi');
    const te = searchFoods('రాగి');
    expect(en.some((food) => food.id === 'ragi-raw')).toBe(true);
    expect(te.some((food) => food.id === 'ragi-raw')).toBe(true);
  });

  test('search by category and food type', () => {
    expect(searchFoods('millets').some((food) => food.id === 'sorghum-grain')).toBe(true);
    expect(searchFoods('cooked rice').some((food) => food.id === 'rice-white-cooked')).toBe(true);
  });
});
