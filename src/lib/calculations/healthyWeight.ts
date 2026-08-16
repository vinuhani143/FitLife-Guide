import { cmToMeters } from './units';

export const HEALTHY_BMI_RANGE = {
  min: 18.5,
  max: 24.9,
  sourceName: 'WHO adult healthy BMI range',
  sourceReference: 'WHO Technical Report Series 894 (2000). Adult BMI 18.5–24.9 is the standard normal range used for screening.',
  sourceYear: 2000,
};

export type HealthyWeightRange = {
  minKg: number;
  maxKg: number;
  bmiMin: number;
  bmiMax: number;
};

export function calculateHealthyWeightRange(heightCm: number): HealthyWeightRange {
  if (heightCm <= 0) {
    throw new Error('Height must be positive.');
  }
  const heightM = cmToMeters(heightCm);
  const area = heightM * heightM;
  return {
    minKg: HEALTHY_BMI_RANGE.min * area,
    maxKg: HEALTHY_BMI_RANGE.max * area,
    bmiMin: HEALTHY_BMI_RANGE.min,
    bmiMax: HEALTHY_BMI_RANGE.max,
  };
}
