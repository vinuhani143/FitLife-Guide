import { getFoodById } from '@/src/data/foods';
import { canUseInDefaultCalculations } from '@/src/lib/dataQuality';
import { isVegetarianFood } from '@/src/lib/foodDiet';
import { calculateNutrition } from '@/src/lib/calculations/nutrition';
import { addDaysIso } from '@/src/lib/calculations/units';
import type { MealSlot } from '@/src/types/diary';
import type { DietType } from '@/src/types/profile';

export const MAX_TIMELINE_DAYS = 365;

type TemplateItem = {
  meal: MealSlot;
  foodId: string;
  grams: number;
};

export type PlannedFood = {
  meal: MealSlot;
  foodId: string;
  grams: number;
  energyKcal: number;
  proteinG: number | null;
};

export type PlannedDay = {
  dayNumber: number;
  dateIso: string;
  dietType: DietType;
  items: PlannedFood[];
  totalEnergyKcal: number;
  totalProteinG: number | null;
  targetKcal: number;
};

const OIL_IDS = new Set(['ghee', 'olive-oil', 'peanut-oil', 'butter-oil-anhydrous']);

const VEG_WEEK: TemplateItem[][] = [
  [
    { meal: 'breakfast', foodId: 'idli', grams: 150 },
    { meal: 'breakfast', foodId: 'chutney', grams: 35 },
    { meal: 'breakfast', foodId: 'milk-whole', grams: 200 },
    { meal: 'lunch', foodId: 'rice-white-cooked', grams: 200 },
    { meal: 'lunch', foodId: 'dal', grams: 180 },
    { meal: 'lunch', foodId: 'vegetable-curry', grams: 150 },
    { meal: 'lunch', foodId: 'yogurt-plain-whole', grams: 100 },
    { meal: 'dinner', foodId: 'roti-chapati', grams: 80 },
    { meal: 'dinner', foodId: 'vegetable-curry', grams: 150 },
    { meal: 'evening_snack', foodId: 'banana-raw', grams: 118 },
  ],
  [
    { meal: 'breakfast', foodId: 'dosa-plain', grams: 105 },
    { meal: 'breakfast', foodId: 'chutney', grams: 35 },
    { meal: 'breakfast', foodId: 'milk-whole', grams: 200 },
    { meal: 'lunch', foodId: 'vegetable-biryani', grams: 250 },
    { meal: 'lunch', foodId: 'dal', grams: 150 },
    { meal: 'lunch', foodId: 'yogurt-plain-whole', grams: 120 },
    { meal: 'dinner', foodId: 'upma', grams: 200 },
    { meal: 'dinner', foodId: 'mixed-vegetables-cooked', grams: 120 },
    { meal: 'evening_snack', foodId: 'apple-raw', grams: 150 },
  ],
  [
    { meal: 'breakfast', foodId: 'upma', grams: 200 },
    { meal: 'breakfast', foodId: 'milk-whole', grams: 200 },
    { meal: 'lunch', foodId: 'rice-white-cooked', grams: 200 },
    { meal: 'lunch', foodId: 'lentil-curry', grams: 180 },
    { meal: 'lunch', foodId: 'yogurt-plain-whole', grams: 100 },
    { meal: 'lunch', foodId: 'tomato-raw', grams: 80 },
    { meal: 'dinner', foodId: 'roti-chapati', grams: 80 },
    { meal: 'dinner', foodId: 'vegetable-curry', grams: 180 },
    { meal: 'evening_snack', foodId: 'orange-raw', grams: 150 },
  ],
  [
    { meal: 'breakfast', foodId: 'oats-cooked', grams: 250 },
    { meal: 'breakfast', foodId: 'milk-whole', grams: 200 },
    { meal: 'breakfast', foodId: 'banana-raw', grams: 118 },
    { meal: 'lunch', foodId: 'rice-white-cooked', grams: 180 },
    { meal: 'lunch', foodId: 'dal', grams: 180 },
    { meal: 'lunch', foodId: 'mixed-vegetables-cooked', grams: 120 },
    { meal: 'lunch', foodId: 'yogurt-plain-whole', grams: 100 },
    { meal: 'dinner', foodId: 'paratha', grams: 70 },
    { meal: 'dinner', foodId: 'vegetable-curry', grams: 150 },
    { meal: 'evening_snack', foodId: 'papaya-raw', grams: 145 },
  ],
  [
    { meal: 'breakfast', foodId: 'idli', grams: 150 },
    { meal: 'breakfast', foodId: 'chutney', grams: 35 },
    { meal: 'breakfast', foodId: 'banana-raw', grams: 118 },
    { meal: 'lunch', foodId: 'roti-chapati', grams: 80 },
    { meal: 'lunch', foodId: 'dal', grams: 180 },
    { meal: 'lunch', foodId: 'vegetable-curry', grams: 150 },
    { meal: 'lunch', foodId: 'yogurt-plain-whole', grams: 100 },
    { meal: 'dinner', foodId: 'rice-white-cooked', grams: 180 },
    { meal: 'dinner', foodId: 'lentil-curry', grams: 150 },
    { meal: 'evening_snack', foodId: 'yogurt-plain-whole', grams: 120 },
  ],
  [
    { meal: 'breakfast', foodId: 'dosa-plain', grams: 70 },
    { meal: 'breakfast', foodId: 'idli', grams: 76 },
    { meal: 'breakfast', foodId: 'chutney', grams: 35 },
    { meal: 'breakfast', foodId: 'milk-whole', grams: 200 },
    { meal: 'lunch', foodId: 'rice-white-cooked', grams: 200 },
    { meal: 'lunch', foodId: 'dal', grams: 150 },
    { meal: 'lunch', foodId: 'vegetable-curry', grams: 150 },
    { meal: 'lunch', foodId: 'yogurt-plain-whole', grams: 100 },
    { meal: 'dinner', foodId: 'roti-chapati', grams: 80 },
    { meal: 'dinner', foodId: 'mixed-vegetables-cooked', grams: 150 },
    { meal: 'evening_snack', foodId: 'mango-raw', grams: 120 },
  ],
  [
    { meal: 'breakfast', foodId: 'poori', grams: 72 },
    { meal: 'breakfast', foodId: 'vegetable-curry', grams: 150 },
    { meal: 'breakfast', foodId: 'milk-whole', grams: 200 },
    { meal: 'lunch', foodId: 'vegetable-biryani', grams: 220 },
    { meal: 'lunch', foodId: 'dal', grams: 150 },
    { meal: 'lunch', foodId: 'yogurt-plain-whole', grams: 120 },
    { meal: 'lunch', foodId: 'ghee', grams: 5 },
    { meal: 'dinner', foodId: 'upma', grams: 180 },
    { meal: 'dinner', foodId: 'vegetable-curry', grams: 120 },
    { meal: 'evening_snack', foodId: 'banana-raw', grams: 118 },
  ],
];

const NON_VEG_WEEK: TemplateItem[][] = [
  [
    { meal: 'breakfast', foodId: 'idli', grams: 114 },
    { meal: 'breakfast', foodId: 'egg-boiled', grams: 50 },
    { meal: 'breakfast', foodId: 'chutney', grams: 30 },
    { meal: 'breakfast', foodId: 'milk-whole', grams: 200 },
    { meal: 'lunch', foodId: 'rice-white-cooked', grams: 200 },
    { meal: 'lunch', foodId: 'chicken-curry', grams: 200 },
    { meal: 'lunch', foodId: 'yogurt-plain-whole', grams: 100 },
    { meal: 'dinner', foodId: 'roti-chapati', grams: 80 },
    { meal: 'dinner', foodId: 'vegetable-curry', grams: 150 },
    { meal: 'evening_snack', foodId: 'banana-raw', grams: 118 },
  ],
  [
    { meal: 'breakfast', foodId: 'egg-omelet', grams: 61 },
    { meal: 'breakfast', foodId: 'roti-chapati', grams: 40 },
    { meal: 'breakfast', foodId: 'milk-whole', grams: 200 },
    { meal: 'lunch', foodId: 'chicken-biryani', grams: 250 },
    { meal: 'lunch', foodId: 'yogurt-plain-whole', grams: 120 },
    { meal: 'dinner', foodId: 'rice-white-cooked', grams: 150 },
    { meal: 'dinner', foodId: 'dal', grams: 150 },
    { meal: 'evening_snack', foodId: 'apple-raw', grams: 150 },
  ],
  [
    { meal: 'breakfast', foodId: 'dosa-plain', grams: 105 },
    { meal: 'breakfast', foodId: 'chutney', grams: 35 },
    { meal: 'breakfast', foodId: 'egg-boiled', grams: 50 },
    { meal: 'lunch', foodId: 'rice-white-cooked', grams: 200 },
    { meal: 'lunch', foodId: 'mutton-gravy', grams: 150 },
    { meal: 'lunch', foodId: 'mixed-vegetables-cooked', grams: 100 },
    { meal: 'dinner', foodId: 'roti-chapati', grams: 80 },
    { meal: 'dinner', foodId: 'chicken-curry', grams: 150 },
    { meal: 'evening_snack', foodId: 'yogurt-plain-whole', grams: 120 },
  ],
  [
    { meal: 'breakfast', foodId: 'oats-cooked', grams: 250 },
    { meal: 'breakfast', foodId: 'milk-whole', grams: 200 },
    { meal: 'breakfast', foodId: 'egg-boiled', grams: 50 },
    { meal: 'lunch', foodId: 'meat-biryani', grams: 220 },
    { meal: 'lunch', foodId: 'yogurt-plain-whole', grams: 120 },
    { meal: 'dinner', foodId: 'rice-white-cooked', grams: 150 },
    { meal: 'dinner', foodId: 'dal', grams: 150 },
    { meal: 'dinner', foodId: 'vegetable-curry', grams: 120 },
    { meal: 'evening_snack', foodId: 'banana-raw', grams: 118 },
  ],
  [
    { meal: 'breakfast', foodId: 'idli', grams: 150 },
    { meal: 'breakfast', foodId: 'chutney', grams: 35 },
    { meal: 'breakfast', foodId: 'milk-whole', grams: 200 },
    { meal: 'lunch', foodId: 'rice-white-cooked', grams: 180 },
    { meal: 'lunch', foodId: 'chicken-breast-roasted', grams: 120 },
    { meal: 'lunch', foodId: 'vegetable-curry', grams: 150 },
    { meal: 'dinner', foodId: 'roti-chapati', grams: 80 },
    { meal: 'dinner', foodId: 'dal', grams: 150 },
    { meal: 'evening_snack', foodId: 'orange-raw', grams: 150 },
  ],
  [
    { meal: 'breakfast', foodId: 'upma', grams: 200 },
    { meal: 'breakfast', foodId: 'egg-boiled', grams: 50 },
    { meal: 'breakfast', foodId: 'milk-whole', grams: 200 },
    { meal: 'lunch', foodId: 'rice-white-cooked', grams: 200 },
    { meal: 'lunch', foodId: 'chicken-curry', grams: 200 },
    { meal: 'lunch', foodId: 'yogurt-plain-whole', grams: 100 },
    { meal: 'dinner', foodId: 'vegetable-biryani', grams: 180 },
    { meal: 'dinner', foodId: 'yogurt-plain-whole', grams: 100 },
    { meal: 'evening_snack', foodId: 'papaya-raw', grams: 145 },
  ],
  [
    { meal: 'breakfast', foodId: 'poori', grams: 72 },
    { meal: 'breakfast', foodId: 'egg-omelet', grams: 61 },
    { meal: 'breakfast', foodId: 'milk-whole', grams: 200 },
    { meal: 'lunch', foodId: 'rice-white-cooked', grams: 180 },
    { meal: 'lunch', foodId: 'dal', grams: 150 },
    { meal: 'lunch', foodId: 'chicken-curry', grams: 150 },
    { meal: 'lunch', foodId: 'yogurt-plain-whole', grams: 100 },
    { meal: 'dinner', foodId: 'roti-chapati', grams: 80 },
    { meal: 'dinner', foodId: 'mutton-gravy', grams: 120 },
    { meal: 'evening_snack', foodId: 'banana-raw', grams: 118 },
  ],
];

function roundGrams(grams: number, foodId: string): number {
  const min = OIL_IDS.has(foodId) ? 3 : foodId === 'chutney' ? 15 : 20;
  const max = OIL_IDS.has(foodId) ? 12 : 450;
  const stepped = Math.round(grams / 5) * 5;
  return Math.min(max, Math.max(min, stepped));
}

export function scaleTemplateToTarget(template: TemplateItem[], targetKcal: number): PlannedFood[] {
  const resolved = template
    .map((item) => {
      const food = getFoodById(item.foodId);
      if (!food || !canUseInDefaultCalculations(food) || food.nutrition.energyKcal == null) return null;
      const scaled = calculateNutrition(food, item.grams);
      return {
        ...item,
        energyKcal: scaled.values.energyKcal ?? 0,
        proteinG: scaled.values.proteinG,
      };
    })
    .filter((item): item is TemplateItem & { energyKcal: number; proteinG: number | null } => item != null);

  const rest = resolved.filter((item) => !OIL_IDS.has(item.foodId));
  const oils = resolved.filter((item) => OIL_IDS.has(item.foodId));
  const restEnergy = rest.reduce((sum, item) => sum + item.energyKcal, 0);
  const oilEnergy = oils.reduce((sum, item) => sum + item.energyKcal, 0);
  const remaining = Math.max(500, targetKcal - oilEnergy);
  const factor = restEnergy > 0 ? Math.min(1.7, Math.max(0.55, remaining / restEnergy)) : 1;

  const scaledRest = rest.map((item) => {
    const grams = roundGrams(item.grams * factor, item.foodId);
    const nutrition = calculateNutrition(getFoodById(item.foodId)!, grams);
    return {
      meal: item.meal,
      foodId: item.foodId,
      grams,
      energyKcal: nutrition.values.energyKcal ?? 0,
      proteinG: nutrition.values.proteinG,
    };
  });

  const scaledOils = oils.map((item) => {
    const grams = roundGrams(item.grams, item.foodId);
    const nutrition = calculateNutrition(getFoodById(item.foodId)!, grams);
    return {
      meal: item.meal,
      foodId: item.foodId,
      grams,
      energyKcal: nutrition.values.energyKcal ?? 0,
      proteinG: nutrition.values.proteinG,
    };
  });

  return [...scaledRest, ...scaledOils];
}

function weekForDiet(dietType: DietType): TemplateItem[][] {
  return dietType === 'vegetarian' ? VEG_WEEK : NON_VEG_WEEK;
}

export function buildPlannedDay(input: {
  dayNumber: number;
  dateIso: string;
  dietType: DietType;
  targetKcal: number;
}): PlannedDay {
  const week = weekForDiet(input.dietType);
  const template = week[(input.dayNumber - 1) % week.length];
  const items = scaleTemplateToTarget(template, input.targetKcal);
  const totalEnergyKcal = items.reduce((sum, item) => sum + item.energyKcal, 0);
  const proteinParts = items.map((item) => item.proteinG);
  const totalProteinG = proteinParts.every((value) => value == null)
    ? null
    : proteinParts.reduce((sum, value) => (sum ?? 0) + (value ?? 0), 0);
  return {
    dayNumber: input.dayNumber,
    dateIso: input.dateIso,
    dietType: input.dietType,
    items,
    totalEnergyKcal,
    totalProteinG,
    targetKcal: input.targetKcal,
  };
}

export function buildTimelineMealPlan(input: {
  estimatedDays: number;
  dietType: DietType;
  targetKcal: number;
  startDateIso: string;
}): PlannedDay[] {
  const days = Math.min(MAX_TIMELINE_DAYS, Math.max(1, Math.round(input.estimatedDays)));
  return Array.from({ length: days }, (_, index) =>
    buildPlannedDay({
      dayNumber: index + 1,
      dateIso: addDaysIso(input.startDateIso, index),
      dietType: input.dietType,
      targetKcal: input.targetKcal,
    }),
  );
}

export function assertTemplateUsesVerifiedDietFoods(): string[] {
  const issues: string[] = [];
  for (const [dietType, week] of [
    ['vegetarian', VEG_WEEK],
    ['non_vegetarian', NON_VEG_WEEK],
  ] as const) {
    week.forEach((day, dayIndex) => {
      for (const item of day) {
        const food = getFoodById(item.foodId);
        if (!food) {
          issues.push(`${dietType} day ${dayIndex + 1} missing ${item.foodId}`);
          continue;
        }
        if (!canUseInDefaultCalculations(food)) {
          issues.push(`${dietType} day ${dayIndex + 1} unverified ${item.foodId}`);
        }
        if (dietType === 'vegetarian' && !isVegetarianFood(food)) {
          issues.push(`vegetarian template includes non-veg ${item.foodId}`);
        }
      }
    });
  }
  return issues;
}

export const MEAL_ORDER: MealSlot[] = ['breakfast', 'morning_snack', 'lunch', 'evening_snack', 'dinner'];
