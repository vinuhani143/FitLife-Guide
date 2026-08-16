import type { FoodCategory, FoodRecord } from '@/src/types/food';
import { validateFoodDatabase } from '@/src/lib/dataQuality';
import seed from './usda-sr-legacy-seed.json';

export const foodDatabaseVersion = seed.foodDatabaseVersion;
export const foodDatabaseMeta = {
  version: seed.foodDatabaseVersion,
  importedAt: seed.importedAt,
  dataset: seed.dataset,
  datasetFile: seed.datasetFile,
  note: seed.note,
};

export const foods: FoodRecord[] = seed.foods as FoodRecord[];

const byId = new Map(foods.map((food) => [food.id, food]));

export function getFoodById(id: string): FoodRecord | undefined {
  return byId.get(id);
}

export function getFoodsByCategory(category: FoodCategory): FoodRecord[] {
  return foods.filter((food) => food.category === category);
}

export function searchFoods(query: string): FoodRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return foods;
  return foods.filter((food) => {
    const haystack = [
      food.nameEn,
      food.nameTe,
      food.category,
      food.subcategory,
      food.state,
      food.usdaDescription ?? '',
      ...food.searchTerms,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function foodDatabaseIssues() {
  return validateFoodDatabase(foods);
}

export const explorerGroups: { key: string; categories: FoodCategory[] }[] = [
  { key: 'vegetables', categories: ['vegetables'] },
  { key: 'fruits', categories: ['fruits'] },
  { key: 'grains', categories: ['grains'] },
  { key: 'millets', categories: ['millets'] },
  { key: 'protein', categories: ['pulses', 'legumes', 'eggs', 'chicken', 'fish', 'meat'] },
  { key: 'nutsSeeds', categories: ['nuts-seeds'] },
  { key: 'dairy', categories: ['milk-dairy'] },
  { key: 'oils', categories: ['oils-fats'] },
  { key: 'prepared', categories: ['prepared'] },
  { key: 'bakery', categories: ['bakery'] },
  { key: 'snacks', categories: ['snacks'] },
];
