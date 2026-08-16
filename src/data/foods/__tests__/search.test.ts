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

  test('everyday meals copy official USDA energy and leave missing recipes unverified', () => {
    const chutney = searchFoods('chutney').find((food) => food.id === 'chutney');
    const ghee = searchFoods('neyyi').find((food) => food.id === 'ghee');
    const curry = searchFoods('chicken curry').find((food) => food.id === 'chicken-curry');
    expect(chutney?.nutrition.energyKcal).toBe(246);
    expect(chutney?.fdcId).toBe(2709309);
    expect(ghee?.nutrition.energyKcal).toBe(876);
    expect(curry?.nutrition.energyKcal).toBe(107);
    expect(searchFoods('sambar').some((food) => food.id === 'sambar' && !food.nutritionAvailable)).toBe(true);
    expect(searchFoods('rasam').some((food) => food.id === 'rasam' && !food.nutritionAvailable)).toBe(true);
    expect(searchFoods('pongal').some((food) => food.id === 'pongal' && !food.nutritionAvailable)).toBe(true);
    expect(searchFoods('lemon rice').some((food) => food.id === 'lemon-rice' && !food.nutritionAvailable)).toBe(true);
    expect(searchFoods('kurma').some((food) => food.id === 'vegetable-korma' && !food.nutritionAvailable)).toBe(true);
    expect(searchFoods('vepudu').some((food) => food.id === 'vegetable-fry' && !food.nutritionAvailable)).toBe(true);
  });

  test('bakery and snack catalog items keep official USDA energy', () => {
    expect(searchFoods('chips').some((food) => food.id === 'potato-chips' && food.nutrition.energyKcal === 532)).toBe(true);
    expect(searchFoods('pizza').some((food) => food.id === 'pizza-cheese' && food.nutrition.energyKcal === 266)).toBe(true);
    expect(searchFoods('biscuit').some((food) => food.id === 'graham-biscuit' && food.nutritionAvailable)).toBe(true);
  });

  test('Telugu lunch words find catalog foods', () => {
    expect(searchFoods('పప్పు').some((food) => food.id === 'dal')).toBe(true);
    expect(searchFoods('పెరుగు').some((food) => food.id === 'yogurt-plain-whole')).toBe(true);
    expect(searchFoods('పాలు').some((food) => food.id === 'milk-whole')).toBe(true);
    expect(searchFoods('నెయ్యి').some((food) => food.id === 'ghee')).toBe(true);
  });
});
