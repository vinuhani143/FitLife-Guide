export type SourceEntry = {
  id: string;
  category: 'who' | 'fao' | 'usda' | 'indian' | 'equation' | 'activity' | 'packaged';
  name: string;
  organization: string;
  reference: string;
  year: number | null;
  url: string | null;
  usedFor: string;
};

export const SOURCES: SourceEntry[] = [
  {
    id: 'who-bmi-2000',
    category: 'who',
    name: 'WHO adult BMI classification',
    organization: 'World Health Organization',
    reference: 'Obesity: preventing and managing the global epidemic. WHO Technical Report Series 894.',
    year: 2000,
    url: 'https://iris.who.int/handle/10665/42330',
    usedFor: 'Adult BMI categories and the 18.5–24.9 healthy BMI range used for screening.',
  },
  {
    id: 'who-child-bmi',
    category: 'who',
    name: 'WHO BMI-for-age growth references',
    organization: 'World Health Organization',
    reference:
      'WHO. Growth reference data for 5–19 years. Adult BMI cut-offs are not applied to children or adolescents in this app because the percentile tables are not bundled.',
    year: 2007,
    url: 'https://www.who.int/tools/growth-reference-data-for-5to19-years',
    usedFor: 'Explains why child/adolescent BMI is not given an adult category.',
  },
  {
    id: 'who-pa-2020',
    category: 'who',
    name: 'WHO physical activity guidelines',
    organization: 'World Health Organization',
    reference: 'Guidelines on physical activity and sedentary behaviour. Geneva: World Health Organization; 2020.',
    year: 2020,
    url: 'https://www.who.int/publications/i/item/9789240015128',
    usedFor: 'Adult aerobic (150–300 moderate minutes or 75–150 vigorous) and strength (2+ days) recommendations.',
  },
  {
    id: 'fao-infoods',
    category: 'fao',
    name: 'FAO/INFOODS food composition framework',
    organization: 'Food and Agriculture Organization of the United Nations / INFOODS',
    reference:
      'FAO/INFOODS. International Network of Food Data Systems. Food composition data should keep source, basis, and food state explicit and should not mix incompatible tables silently.',
    year: null,
    url: 'https://www.fao.org/infoods/infoods/en/',
    usedFor: 'Methodology: do not mix databases; keep raw and cooked records separate; use null for unknown values.',
  },
  {
    id: 'fao-who-unu-2004',
    category: 'fao',
    name: 'Human energy requirements',
    organization: 'FAO/WHO/UNU',
    reference: 'Human energy requirements. Report of a Joint FAO/WHO/UNU Expert Consultation. Rome: FAO; 2004.',
    year: 2004,
    url: 'https://www.fao.org/4/y5686e/y5686e00.htm',
    usedFor: 'Background on physical activity level (PAL). The app’s five TDEE multipliers are commonly used applied factors, not identical to FAO PAL bands.',
  },
  {
    id: 'usda-sr-legacy',
    category: 'usda',
    name: 'USDA FoodData Central, SR Legacy',
    organization: 'U.S. Department of Agriculture, Agricultural Research Service',
    reference: 'FoodData Central SR Legacy April 2018 release file: FoodData_Central_sr_legacy_food_json_2018-04.json',
    year: 2018,
    url: 'https://fdc.nal.usda.gov/',
    usedFor: 'Default food nutrient values copied from SR Legacy in seed 2026.1+, including cooked oats, eggs, bakery, snack foods, cooked shrimp/prawns (FDC 171971), and cooked Atlantic cod (FDC 171956) in seed 2026.4.',
  },
  {
    id: 'usda-fndds',
    category: 'usda',
    name: 'USDA FoodData Central, Survey (FNDDS)',
    organization: 'U.S. Department of Agriculture, Agricultural Research Service',
    reference:
      'Food and Nutrient Database for Dietary Studies records accessed from FoodData Central on 2026-08-16, including Idli (FDC 2708346), Dosa plain (2708347), Upma (2709128), Vada (2709130), Puri (2707714), Chapatti/roti (2707713), Dal (2707427), Chutney (2709309), Ghee (2710168), Chicken curry (2706437), Chicken biryani (2706538), Meat biryani (2706490), Vegetable curry (2710067), Lentil curry (2707431), Lamb/mutton with gravy (2706413), and Pakora (2710066). Homemade recipes vary.',
    year: 2024,
    url: 'https://fdc.nal.usda.gov/',
    usedFor: 'Prepared Indian breakfast, lunch, and snack items added in seed 2026.2 and 2026.3. Values are copied, not invented.',
  },
  {
    id: 'wishnofsky-1958',
    category: 'equation',
    name: 'Wishnofsky caloric equivalent of weight change',
    organization: 'American Journal of Clinical Nutrition',
    reference: 'Wishnofsky M. Caloric equivalents of gained or lost weight. Am J Clin Nutr. 1958;6(5):542-546.',
    year: 1958,
    url: 'https://pubmed.ncbi.nlm.nih.gov/13594881/',
    usedFor: 'Educational timeline only: about 7700 kcal per kg. Not a promise of fat loss or gain.',
  },
  {
    id: 'who-protein-2007',
    category: 'who',
    name: 'WHO/FAO/UNU adult protein safe intake',
    organization: 'World Health Organization / FAO / UNU',
    reference: 'Protein and amino acid requirements in human nutrition. WHO Technical Report Series 935. 2007.',
    year: 2007,
    url: 'https://www.who.int/publications/i/item/9241209356',
    usedFor: 'Educational protein comparison of 0.83 g/kg. Not a medical diet prescription.',
  },
  {
    id: 'ifct-2017',
    category: 'indian',
    name: 'Indian Food Composition Tables',
    organization: 'National Institute of Nutrition, Indian Council of Medical Research',
    reference: 'Longvah T, Ananthan R, Bhaskarachary K, Venkaiah K. Indian Food Composition Tables. NIN, ICMR, Hyderabad, 2017.',
    year: 2017,
    url: 'https://www.nin.res.in/',
    usedFor:
      'Preferred source for Indian-specific foods such as ragi, bajra, sambar, rasam, pongal, lemon rice, vegetable korma, and vegetable fry. Those values are not invented here; catalog items stay unavailable until an official IFCT import is added.',
  },
  {
    id: 'open-food-facts',
    category: 'packaged',
    name: 'Open Food Facts',
    organization: 'Open Food Facts',
    reference:
      'Open Food Facts packaged-food database. Values shown after a barcode scan are copied from that product record when present. Missing nutrients stay blank. This source is not mixed into the USDA catalog used for diary calculations.',
    year: null,
    url: 'https://world.openfoodfacts.org/',
    usedFor: 'Barcode scan of packaged foods only. Homemade meals should be matched to the USDA catalog.',
  },
  {
    id: 'mifflin-1990',
    category: 'equation',
    name: 'Mifflin-St Jeor equation',
    organization: 'American Journal of Clinical Nutrition',
    reference:
      'Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO. A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr. 1990;51(2):241-247.',
    year: 1990,
    url: 'https://pubmed.ncbi.nlm.nih.gov/2305711/',
    usedFor: 'Estimated BMR. Male: 10W + 6.25H − 5A + 5. Female: 10W + 6.25H − 5A − 161.',
  },
  {
    id: 'compendium-2011',
    category: 'activity',
    name: '2011 Compendium of Physical Activities',
    organization: 'Ainsworth et al., Medicine & Science in Sports & Exercise',
    reference:
      'Ainsworth BE, Haskell WL, Herrmann SD, et al. 2011 Compendium of Physical Activities: a second update of codes and MET values. Med Sci Sports Exerc. 2011;43(8):1575-1581.',
    year: 2011,
    url: 'https://pubmed.ncbi.nlm.nih.gov/21681120/',
    usedFor: 'MET values used only for estimated activity energy expenditure: kcal = MET × kg × hours.',
  },
];

export const SAFETY_DISCLAIMER_EN =
  'This app provides educational information and estimates. It is not a substitute for medical diagnosis, treatment, or individualized advice from a qualified healthcare professional.';
