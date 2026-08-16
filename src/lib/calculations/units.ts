export function kgToLb(kg: number): number {
  return kg * 2.2046226218;
}

export function lbToKg(lb: number): number {
  return lb / 2.2046226218;
}

export function cmToInches(cm: number): number {
  return cm / 2.54;
}

export function inchesToCm(inches: number): number {
  return inches * 2.54;
}

export function cmToMeters(cm: number): number {
  return cm / 100;
}

export function feetInchesToCm(feet: number, inches: number): number {
  return inchesToCm(feet * 12 + inches);
}

export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cmToInches(cm);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches - feet * 12;
  return { feet, inches };
}

export function mlToLitres(ml: number): number {
  return ml / 1000;
}

export function litresToMl(litres: number): number {
  return litres * 1000;
}

export function ageFromDateOfBirth(dateOfBirth: string, onDate = new Date()): number | null {
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;
  let age = onDate.getFullYear() - dob.getFullYear();
  const monthDiff = onDate.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && onDate.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age >= 0 && age < 130 ? age : null;
}

export function lifeStageFromAge(age: number): 'child' | 'adolescent' | 'adult' | 'older_adult' {
  if (age < 10) return 'child';
  if (age < 18) return 'adolescent';
  if (age >= 65) return 'older_adult';
  return 'adult';
}

export function todayIsoDate(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
