import { cmToMeters, lifeStageFromAge, roundTo } from './units';

export type AdultBmiCategory =
  | 'underweight'
  | 'normal'
  | 'overweight'
  | 'obesity_class_i'
  | 'obesity_class_ii'
  | 'obesity_class_iii';

export type BmiResult = {
  bmi: number;
  category: AdultBmiCategory | null;
  interpretable: boolean;
  reason: string;
  sourceName: string;
  sourceReference: string;
  sourceYear: number;
};

/**
 * Adult BMI categories from WHO.
 * Source: WHO Technical Report Series 894, 2000.
 * BMI is a screening measure, not a diagnosis and not a direct body-fat test.
 */
export const WHO_ADULT_BMI_SOURCE = {
  sourceName: 'WHO adult BMI classification',
  sourceOrganization: 'World Health Organization',
  sourceReference: 'Obesity: preventing and managing the global epidemic. WHO Technical Report Series 894.',
  sourceYear: 2000,
  formula: 'BMI = weightKg / (heightMeters * heightMeters)',
};

export function calculateBMI(weightKg: number, heightCm: number): number {
  if (weightKg <= 0 || heightCm <= 0) {
    throw new Error('Weight and height must be positive.');
  }
  const heightM = cmToMeters(heightCm);
  return weightKg / (heightM * heightM);
}

export function classifyAdultBmi(bmi: number): AdultBmiCategory {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  if (bmi < 35) return 'obesity_class_i';
  if (bmi < 40) return 'obesity_class_ii';
  return 'obesity_class_iii';
}

export function interpretBmi(weightKg: number, heightCm: number, age: number | null): BmiResult {
  const bmi = roundTo(calculateBMI(weightKg, heightCm), 2);
  if (age == null) {
    return {
      bmi,
      category: null,
      interpretable: false,
      reason: 'Age is required before an adult BMI category can be shown.',
      sourceName: WHO_ADULT_BMI_SOURCE.sourceName,
      sourceReference: WHO_ADULT_BMI_SOURCE.sourceReference,
      sourceYear: WHO_ADULT_BMI_SOURCE.sourceYear,
    };
  }
  const stage = lifeStageFromAge(age);
  if (stage === 'child' || stage === 'adolescent') {
    return {
      bmi,
      category: null,
      interpretable: false,
      reason:
        'Child/adolescent BMI interpretation requires age- and sex-specific reference standards. Adult WHO BMI categories are not applied.',
      sourceName: 'WHO child growth standards / BMI-for-age',
      sourceReference:
        'WHO. Growth reference data for 5–19 years and Child Growth Standards. Adult BMI cut-offs are not used for children or adolescents in this app.',
      sourceYear: 2007,
    };
  }
  return {
    bmi,
    category: classifyAdultBmi(bmi),
    interpretable: true,
    reason: 'Adult WHO BMI category. BMI does not directly measure body fat.',
    sourceName: WHO_ADULT_BMI_SOURCE.sourceName,
    sourceReference: WHO_ADULT_BMI_SOURCE.sourceReference,
    sourceYear: WHO_ADULT_BMI_SOURCE.sourceYear,
  };
}
