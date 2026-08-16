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

  test('Indian breakfast items keep official USDA energy', () => {
    const idli = searchFoods('idli').find((food) => food.id === 'idli');
    const dosa = searchFoods('dosa').find((food) => food.id === 'dosa-plain');
    expect(idli?.nutrition.energyKcal).toBe(128);
    expect(idli?.fdcId).toBe(2708346);
    expect(dosa?.nutrition.energyKcal).toBe(210);
    expect(searchFoods('పెసరట్టు').some((food) => food.id === 'pesarattu' && !food.nutritionAvailable)).toBe(true);
  });
});
