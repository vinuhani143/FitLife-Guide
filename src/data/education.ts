export type EducationArticle = {
  slug: string;
  titleKey: string;
  sources: string[];
};

export const EDUCATION_ARTICLES: EducationArticle[] = [
  { slug: 'protein', titleKey: 'edu.protein.title', sources: ['usda-sr-legacy', 'fao-infoods'] },
  { slug: 'carbohydrates', titleKey: 'edu.carbohydrates.title', sources: ['usda-sr-legacy', 'fao-infoods'] },
  { slug: 'fat', titleKey: 'edu.fat.title', sources: ['usda-sr-legacy', 'fao-infoods'] },
  { slug: 'fiber', titleKey: 'edu.fiber.title', sources: ['usda-sr-legacy'] },
  { slug: 'vitamins', titleKey: 'edu.vitamins.title', sources: ['usda-sr-legacy'] },
  { slug: 'minerals', titleKey: 'edu.minerals.title', sources: ['usda-sr-legacy'] },
  { slug: 'calories', titleKey: 'edu.calories.title', sources: ['usda-sr-legacy', 'atwater-general', 'fao-who-unu-2004'] },
  { slug: 'bmr', titleKey: 'edu.bmr.title', sources: ['mifflin-1990'] },
  { slug: 'tdee', titleKey: 'edu.tdee.title', sources: ['fao-who-unu-2004', 'mifflin-1990'] },
  { slug: 'bmi', titleKey: 'edu.bmi.title', sources: ['who-bmi-2000', 'who-child-bmi'] },
  { slug: 'metabolic-health', titleKey: 'edu.metabolic.title', sources: ['who-bmi-2000'] },
  { slug: 'physical-fitness', titleKey: 'edu.fitness.title', sources: ['who-pa-2020'] },
  { slug: 'aerobic-fitness', titleKey: 'edu.aerobic.title', sources: ['who-pa-2020'] },
  { slug: 'strength', titleKey: 'edu.strength.title', sources: ['who-pa-2020'] },
  { slug: 'flexibility', titleKey: 'edu.flexibility.title', sources: ['who-pa-2020'] },
  { slug: 'balance', titleKey: 'edu.balance.title', sources: ['who-pa-2020'] },
];
