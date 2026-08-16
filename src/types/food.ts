export type FoodCategory =
  | 'vegetables'
  | 'fruits'
  | 'grains'
  | 'millets'
  | 'pulses'
  | 'legumes'
  | 'nuts-seeds'
  | 'eggs'
  | 'chicken'
  | 'fish'
  | 'meat'
  | 'milk-dairy'
  | 'oils-fats';

export type FoodState =
  | 'raw'
  | 'boiled'
  | 'cooked'
  | 'steamed'
  | 'roasted'
  | 'fried'
  | 'dry';

export type DataConfidence = 'HIGH' | 'MEDIUM' | 'UNVERIFIED';

export type NutrientKey =
  | 'energyKcal'
  | 'proteinG'
  | 'carbohydrateG'
  | 'fatG'
  | 'fiberG'
  | 'sugarG'
  | 'calciumMg'
  | 'ironMg'
  | 'magnesiumMg'
  | 'phosphorusMg'
  | 'potassiumMg'
  | 'sodiumMg'
  | 'zincMg'
  | 'vitaminAMcg'
  | 'vitaminCMg'
  | 'vitaminDMcg'
  | 'vitaminEMg'
  | 'vitaminKMcg'
  | 'thiaminMg'
  | 'riboflavinMg'
  | 'niacinMg'
  | 'vitaminB6Mg'
  | 'folateMcg'
  | 'vitaminB12Mcg';

export type NutritionValues = Record<NutrientKey, number | null>;

export type FoodSource = {
  organization: string;
  database: string;
  reference: string;
  year: number | null;
  country: string;
  dataBasis: string;
  verifiedDate: string | null;
  url?: string;
  importStatus?: string;
};

export type FoodPortion = {
  labelEn: string;
  grams: number;
  amount: number | null;
  modifier: string;
};

export type FoodRecord = {
  id: string;
  nameEn: string;
  nameTe: string;
  category: FoodCategory;
  subcategory: string;
  state: FoodState;
  searchTerms: string[];
  usdaDescription: string | null;
  scientificName: string | null;
  fdcId: number | null;
  ndbNumber: number | string | null;
  publicationDate: string | null;
  usdaCategory: string | null;
  nutritionAvailable: boolean;
  confidence: DataConfidence;
  nutrition: NutritionValues;
  portions: FoodPortion[];
  serving: {
    defaultAmount: number;
    unit: 'g';
    basis: 'per_100g';
    commonLabelEn: string;
  };
  source: FoodSource;
};

export type FoodDatabaseFile = {
  foodDatabaseVersion: string;
  importedAt: string;
  dataset: string;
  datasetFile: string;
  note: string;
  foods: FoodRecord[];
};
