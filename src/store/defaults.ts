import type { FitnessInputs, UserProfile } from '@/src/types/profile';

export const defaultProfile: UserProfile = {
  name: '',
  dateOfBirth: null,
  sex: 'unspecified',
  heightCm: null,
  weightKg: null,
  targetWeightKg: null,
  waistCm: null,
  activityLevel: 'lightly_active',
  goal: 'weight_maintenance',
  unitPreference: {
    mass: 'kg',
    length: 'cm',
    volume: 'ml',
  },
  language: 'en',
  waterGoalMl: 2000,
};

export const defaultFitnessInputs: FitnessInputs = {
  restingHeartRateBpm: null,
  weeklyModerateMinutes: null,
  weeklyVigorousMinutes: null,
  strengthDaysPerWeek: null,
  walkRunMinutesPerWeek: null,
  pushUps: null,
  sitToStandReps: null,
  flexibilitySelfScore: null,
  balanceSelfScore: null,
};
