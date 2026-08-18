import { normalizeDateOfBirth, parseLocaleNumber } from '@/src/lib/calculations/units';
import type { UserProfile } from '@/src/types/profile';

export type ProfileFormState = {
  name: string;
  dateOfBirth: string;
  sex: UserProfile['sex'];
  heightCm: string;
  weightKg: string;
  targetWeightKg: string;
  waistCm: string;
  activityLevel: UserProfile['activityLevel'];
  goal: UserProfile['goal'];
  dietType: UserProfile['dietType'];
  waterGoalMl: string;
  language: UserProfile['language'];
};

export type ProfileFormResult =
  | { ok: true; profile: UserProfile }
  | { ok: false; errorKey: string };

export function profileToFormState(profile: UserProfile): ProfileFormState {
  return {
    name: profile.name,
    dateOfBirth: profile.dateOfBirth ?? '',
    sex: profile.sex,
    heightCm: profile.heightCm == null ? '' : String(profile.heightCm),
    weightKg: profile.weightKg == null ? '' : String(profile.weightKg),
    targetWeightKg: profile.targetWeightKg == null ? '' : String(profile.targetWeightKg),
    waistCm: profile.waistCm == null ? '' : String(profile.waistCm),
    activityLevel: profile.activityLevel,
    goal: profile.goal,
    dietType: profile.dietType ?? 'vegetarian',
    waterGoalMl: String(profile.waterGoalMl),
    language: profile.language,
  };
}

function optionalMeasure(text: string, min: number, max: number, errorKey: string): { value: number | null; errorKey?: string } {
  if (!text.trim()) return { value: null };
  const parsed = parseLocaleNumber(text);
  if (parsed == null || parsed < min || parsed > max) {
    return { value: null, errorKey };
  }
  return { value: parsed };
}

export function buildProfileFromForm(form: ProfileFormState, base: UserProfile): ProfileFormResult {
  let dateOfBirth: string | null = null;
  if (form.dateOfBirth.trim()) {
    dateOfBirth = normalizeDateOfBirth(form.dateOfBirth);
    if (!dateOfBirth) {
      return { ok: false, errorKey: 'body.dobInvalid' };
    }
  }

  const height = optionalMeasure(form.heightCm, 50, 250, 'body.heightInvalid');
  if (height.errorKey) return { ok: false, errorKey: height.errorKey };

  const weight = optionalMeasure(form.weightKg, 10, 400, 'body.weightInvalid');
  if (weight.errorKey) return { ok: false, errorKey: weight.errorKey };

  const targetWeight = optionalMeasure(form.targetWeightKg, 10, 400, 'body.targetWeightInvalid');
  if (targetWeight.errorKey) return { ok: false, errorKey: targetWeight.errorKey };

  const waist = optionalMeasure(form.waistCm, 30, 300, 'body.waistInvalid');
  if (waist.errorKey) return { ok: false, errorKey: waist.errorKey };

  const water = parseLocaleNumber(form.waterGoalMl);
  const waterGoalMl = water != null && water >= 250 && water <= 8000 ? Math.round(water) : 2000;

  return {
    ok: true,
    profile: {
      ...base,
      name: form.name.trim(),
      dateOfBirth,
      sex: form.sex,
      heightCm: height.value,
      weightKg: weight.value,
      targetWeightKg: targetWeight.value,
      waistCm: waist.value,
      activityLevel: form.activityLevel,
      goal: form.goal,
      dietType: form.dietType,
      language: form.language,
      waterGoalMl,
    },
  };
}
