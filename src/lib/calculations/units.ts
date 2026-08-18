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

function isValidYmd(year: number, month: number, day: number): boolean {
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }
  const dt = new Date(Date.UTC(year, month - 1, day));
  return dt.getUTCFullYear() === year && dt.getUTCMonth() === month - 1 && dt.getUTCDate() === day;
}

function padYmd(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Accepts YYYY-MM-DD, YYYY/MM/DD, DD-MM-YYYY, or DD/MM/YYYY. */
export function normalizeDateOfBirth(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const iso = trimmed.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]);
    const day = Number(iso[3]);
    return isValidYmd(year, month, day) ? padYmd(year, month, day) : null;
  }

  const dmy = trimmed.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmy) {
    const day = Number(dmy[1]);
    const month = Number(dmy[2]);
    const year = Number(dmy[3]);
    return isValidYmd(year, month, day) ? padYmd(year, month, day) : null;
  }

  return null;
}

export function parseLocaleNumber(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^-?\d+,\d{1,2}$/.test(trimmed)) {
    return Number(trimmed.replace(',', '.'));
  }
  const normalized = trimmed.replace(/,/g, '');
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

export function ageFromDateOfBirth(dateOfBirth: string, onDate = new Date()): number | null {
  const normalized = normalizeDateOfBirth(dateOfBirth);
  if (!normalized) return null;
  const [year, month, day] = normalized.split('-').map(Number);
  let age = onDate.getFullYear() - year;
  const monthDiff = onDate.getMonth() + 1 - month;
  if (monthDiff < 0 || (monthDiff === 0 && onDate.getDate() < day)) {
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

export function addDaysIso(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
