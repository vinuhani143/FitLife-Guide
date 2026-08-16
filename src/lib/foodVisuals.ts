import type { FoodCategory, FoodRecord } from '@/src/types/food';
import type { MealSlot } from '@/src/types/diary';

const FOOD_EMOJI: Record<string, string> = {
  idli: '🫓',
  vada: '🍩',
  'dosa-plain': '🥞',
  'dosa-filled': '🥞',
  upma: '🥣',
  poori: '🫓',
  'roti-chapati': '🫓',
  paratha: '🫓',
  naan: '🫓',
  chutney: '🥣',
  sambar: '🍲',
  rasam: '🍲',
  pongal: '🍚',
  'lemon-rice': '🍋',
  'vegetable-korma': '🍛',
  'vegetable-fry': '🥘',
  'vegetable-curry': '🍛',
  dal: '🍲',
  'lentil-curry': '🍲',
  'rice-white-cooked': '🍚',
  'rice-white-raw': '🌾',
  'yogurt-plain-whole': '🥛',
  'milk-whole': '🥛',
  paneer: '🧀',
  ghee: '🧈',
  'banana-raw': '🍌',
  'apple-raw': '🍎',
  'orange-raw': '🍊',
  'mango-raw': '🥭',
  'papaya-raw': '🧡',
  'guava-raw': '🍐',
  'grapes-raw': '🍇',
  'watermelon-raw': '🍉',
  'pomegranate-raw': '🔴',
  'egg-boiled': '🥚',
  'egg-omelet': '🍳',
  'egg-whole-raw': '🥚',
  'chicken-curry': '🍗',
  'chicken-biryani': '🍛',
  'chicken-breast-roasted': '🍗',
  'chicken-breast-raw': '🍗',
  'fried-chicken-pieces': '🍗',
  'mutton-gravy': '🍖',
  'mutton-raw': '🍖',
  'meat-biryani': '🍛',
  'vegetable-biryani': '🍛',
  'fish-cooked': '🐟',
  'prawns-cooked': '🦐',
  'salmon-atlantic-farmed-raw': '🐟',
  samosa: '🥟',
  pakora: '🧆',
  'potato-chips': '🍟',
  'french-fries': '🍟',
  'pizza-cheese': '🍕',
  hamburger: '🍔',
  'ice-cream-vanilla': '🍦',
  cola: '🥤',
  'cookie-chocolate-chip': '🍪',
  'graham-biscuit': '🍪',
  'doughnut-plain': '🍩',
  'bread-white': '🍞',
  'milk-chocolate': '🍫',
  popcorn: '🍿',
  'pound-cake': '🍰',
  'oats-cooked': '🥣',
  'oats-dry': '🌾',
  pesarattu: '🥞',
  'ragi-java': '🥤',
  'spinach-raw': '🥬',
  'carrot-raw': '🥕',
  'tomato-raw': '🍅',
  'cabbage-raw': '🥬',
  'cauliflower-raw': '🥦',
  almonds: '🥜',
  'peanuts-raw': '🥜',
};

const CATEGORY_EMOJI: Record<FoodCategory, string> = {
  vegetables: '🥦',
  fruits: '🍎',
  grains: '🌾',
  millets: '🌾',
  pulses: '🫘',
  legumes: '🫘',
  'nuts-seeds': '🥜',
  eggs: '🥚',
  chicken: '🍗',
  fish: '🐟',
  meat: '🍖',
  'milk-dairy': '🥛',
  'oils-fats': '🧈',
  prepared: '🍽️',
  bakery: '🍞',
  snacks: '🍪',
};

export type MealVisual = {
  emoji: string;
  tintLight: string;
  tintDark: string;
  accent: string;
};

export const MEAL_VISUAL: Record<MealSlot, MealVisual> = {
  breakfast: { emoji: '🌅', tintLight: '#FFF4D6', tintDark: '#3A2F14', accent: '#D97706' },
  morning_snack: { emoji: '🍎', tintLight: '#FFE8F0', tintDark: '#3A1F2A', accent: '#DB2777' },
  lunch: { emoji: '☀️', tintLight: '#D9F6EF', tintDark: '#14332E', accent: '#0F766E' },
  evening_snack: { emoji: '🍪', tintLight: '#EFE6FF', tintDark: '#2A2140', accent: '#7C3AED' },
  dinner: { emoji: '🌙', tintLight: '#E4ECFF', tintDark: '#1C2740', accent: '#2563EB' },
};

export const MEAL_ORDER: MealSlot[] = ['breakfast', 'morning_snack', 'lunch', 'evening_snack', 'dinner'];

export function foodEmoji(food: Pick<FoodRecord, 'id' | 'category'> | string): string {
  if (typeof food === 'string') return FOOD_EMOJI[food] ?? '🍽️';
  return FOOD_EMOJI[food.id] ?? CATEGORY_EMOJI[food.category] ?? '🍽️';
}

export function mealTint(meal: MealSlot, dark: boolean): string {
  return dark ? MEAL_VISUAL[meal].tintDark : MEAL_VISUAL[meal].tintLight;
}

export function sizeEmoji(size: 'small' | 'medium' | 'large'): string {
  if (size === 'small') return '🥣';
  if (size === 'large') return '🍲';
  return '🍽️';
}
