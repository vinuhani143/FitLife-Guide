import { foodEmoji, MEAL_VISUAL, sizeEmoji } from '../foodVisuals';
import { getFoodById } from '@/src/data/foods';

describe('food visuals', () => {
  test('everyday plate foods have a picture emoji', () => {
    expect(foodEmoji('idli')).toBe('🫓');
    expect(foodEmoji('dosa-plain')).toBe('🥞');
    expect(foodEmoji('chicken-curry')).toBe('🍗');
    expect(foodEmoji('fish-cooked')).toBe('🐟');
    expect(foodEmoji(getFoodById('dal')!)).toBe('🍲');
  });

  test('unknown catalog foods still get a plate picture from category', () => {
    expect(foodEmoji(getFoodById('spinach-raw')!)).toBe('🥬');
    expect(foodEmoji('not-a-real-food')).toBe('🍽️');
  });

  test('meals and sizes have kid-readable pictures', () => {
    expect(MEAL_VISUAL.breakfast.emoji).toBe('🌅');
    expect(MEAL_VISUAL.dinner.emoji).toBe('🌙');
    expect(sizeEmoji('small')).toBe('🥣');
    expect(sizeEmoji('medium')).toBe('🍽️');
    expect(sizeEmoji('large')).toBe('🍲');
  });
});
