export type Sex = 'female' | 'male' | 'unspecified';

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extra_active';

export type Goal =
  | 'weight_loss'
  | 'weight_maintenance'
  | 'weight_gain'
  | 'muscle_strength'
  | 'general_fitness';

export type UnitPreference = {
  mass: 'kg' | 'lb';
  length: 'cm' | 'ft_in';
  volume: 'ml' | 'l';
};

export type LanguageCode = 'en' | 'te';

export type DietType = 'vegetarian' | 'non_vegetarian';

export type LifeStage = 'child' | 'adolescent' | 'adult' | 'older_adult';

export type UserProfile = {
  name: string;
  dateOfBirth: string | null;
  sex: Sex;
  heightCm: number | null;
  weightKg: number | null;
  targetWeightKg: number | null;
  waistCm: number | null;
  activityLevel: ActivityLevel;
  goal: Goal;
  dietType: DietType;
  unitPreference: UnitPreference;
  language: LanguageCode;
  waterGoalMl: number;
};

export type FitnessInputs = {
  restingHeartRateBpm: number | null;
  weeklyModerateMinutes: number | null;
  weeklyVigorousMinutes: number | null;
  strengthDaysPerWeek: number | null;
  walkRunMinutesPerWeek: number | null;
  pushUps: number | null;
  sitToStandReps: number | null;
  flexibilitySelfScore: number | null;
  balanceSelfScore: number | null;
};

export type WeightLog = {
  id: string;
  date: string;
  weightKg: number;
};

export type WaistLog = {
  id: string;
  date: string;
  waistCm: number;
};
