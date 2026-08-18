import { foods, searchFoods } from '@/src/data/foods';
import { foodMatchesDiet } from '@/src/lib/foodDiet';
import { canUseInDefaultCalculations } from '@/src/lib/dataQuality';
import type { FoodRecord } from '@/src/types/food';
import type { DietType } from '@/src/types/profile';
import type { NutritionValues } from '@/src/types/food';
import { EMPTY_NUTRITION } from '@/src/data/foods/schema';

export type PackagedProductNutrition = {
  barcode: string;
  name: string | null;
  brands: string | null;
  found: boolean;
  per100g: NutritionValues;
  available: boolean;
  sourceName: string;
  sourceUrl: string;
};

const HINTS: { pattern: RegExp; foodId: string }[] = [
  { pattern: /idli/i, foodId: 'idli' },
  { pattern: /dosa|dosai/i, foodId: 'dosa-plain' },
  { pattern: /upma/i, foodId: 'upma' },
  { pattern: /vada|medu/i, foodId: 'vada' },
  { pattern: /poori|puri/i, foodId: 'poori' },
  { pattern: /roti|chapati|chapatti/i, foodId: 'roti-chapati' },
  { pattern: /chutney|chatni/i, foodId: 'chutney' },
  { pattern: /biryani|biriyani/i, foodId: 'vegetable-biryani' },
  { pattern: /chicken/i, foodId: 'chicken-curry' },
  { pattern: /mutton|lamb/i, foodId: 'mutton-gravy' },
  { pattern: /yogurt|curd|dahi/i, foodId: 'yogurt-plain-whole' },
  { pattern: /\bmilk\b|dairy/i, foodId: 'milk-whole' },
  { pattern: /ghee/i, foodId: 'ghee' },
  { pattern: /rice/i, foodId: 'rice-white-cooked' },
  { pattern: /\bdal\b|lentil|pappu/i, foodId: 'dal' },
  { pattern: /banana/i, foodId: 'banana-raw' },
  { pattern: /apple/i, foodId: 'apple-raw' },
  { pattern: /orange/i, foodId: 'orange-raw' },
  { pattern: /bread/i, foodId: 'bread-white' },
  { pattern: /biscuit|cracker/i, foodId: 'graham-biscuit' },
  { pattern: /chip|crisp/i, foodId: 'potato-chips' },
  { pattern: /pizza/i, foodId: 'pizza-cheese' },
  { pattern: /burger|hamburger/i, foodId: 'hamburger' },
  { pattern: /egg/i, foodId: 'egg-boiled' },
  { pattern: /oat/i, foodId: 'oats-cooked' },
  { pattern: /ice cream/i, foodId: 'ice-cream-vanilla' },
  { pattern: /cola|soda/i, foodId: 'cola' },
  { pattern: /chocolate/i, foodId: 'milk-chocolate' },
];

function numberOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function parseOpenFoodFactsProduct(barcode: string, payload: Record<string, unknown>): PackagedProductNutrition {
  const status = payload.status;
  const product = (payload.product ?? {}) as Record<string, unknown>;
  const nutriments = (product.nutriments ?? {}) as Record<string, unknown>;
  const found = status === 1 || status === '1';
  const per100g: NutritionValues = {
    ...EMPTY_NUTRITION,
    energyKcal: numberOrNull(nutriments['energy-kcal_100g'] ?? nutriments['energy-kcal']),
    proteinG: numberOrNull(nutriments.proteins_100g),
    carbohydrateG: numberOrNull(nutriments.carbohydrates_100g),
    fatG: numberOrNull(nutriments.fat_100g),
    fiberG: numberOrNull(nutriments.fiber_100g),
    sugarG: numberOrNull(nutriments.sugars_100g),
    sodiumMg: numberOrNull(nutriments.sodium_100g) != null ? (numberOrNull(nutriments.sodium_100g) as number) * 1000 : numberOrNull(nutriments.salt_100g) != null ? (numberOrNull(nutriments.salt_100g) as number) * 400 : null,
    calciumMg: numberOrNull(nutriments.calcium_100g) != null ? (numberOrNull(nutriments.calcium_100g) as number) * 1000 : null,
    ironMg: numberOrNull(nutriments.iron_100g) != null ? (numberOrNull(nutriments.iron_100g) as number) * 1000 : null,
  };
  const name = typeof product.product_name === 'string' && product.product_name.trim() ? product.product_name.trim() : null;
  return {
    barcode,
    name,
    brands: typeof product.brands === 'string' ? product.brands : null,
    found,
    per100g,
    available: found && per100g.energyKcal != null,
    sourceName: 'Open Food Facts',
    sourceUrl: `https://world.openfoodfacts.org/product/${barcode}`,
  };
}

export async function fetchOpenFoodFactsProduct(
  barcode: string,
  fetchImpl: typeof fetch = fetch,
): Promise<PackagedProductNutrition> {
  const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`;
  const response = await fetchImpl(url, {
    headers: {
      'User-Agent': 'FitLifeGuide/1.1.5 (educational; https://github.com/vinuhani143/FitLife-Guide)',
    },
  });
  if (!response.ok) {
    return {
      barcode,
      name: null,
      brands: null,
      found: false,
      per100g: { ...EMPTY_NUTRITION },
      available: false,
      sourceName: 'Open Food Facts',
      sourceUrl: `https://world.openfoodfacts.org/product/${barcode}`,
    };
  }
  const payload = (await response.json()) as Record<string, unknown>;
  return parseOpenFoodFactsProduct(barcode, payload);
}

export function catalogMatchesForScan(query: string, dietType: DietType, limit = 8): FoodRecord[] {
  const q = query.trim();
  const matches = new Map<string, FoodRecord>();
  if (q) {
    for (const hint of HINTS) {
      if (hint.pattern.test(q)) {
        const food = foods.find((item) => item.id === hint.foodId);
        if (food && foodMatchesDiet(food, dietType) && canUseInDefaultCalculations(food)) {
          matches.set(food.id, food);
        }
      }
    }
    for (const food of searchFoods(q)) {
      if (foodMatchesDiet(food, dietType)) matches.set(food.id, food);
    }
  }
  return [...matches.values()].slice(0, limit);
}
