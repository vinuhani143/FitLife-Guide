import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  profile: 'fitlife.profile.v1',
  fitness: 'fitlife.fitness.v1',
  diary: 'fitlife.diary.v1',
  water: 'fitlife.water.v1',
  activity: 'fitlife.activity.v1',
  weight: 'fitlife.weight.v1',
  waist: 'fitlife.waist.v1',
  compare: 'fitlife.compare.v1',
} as const;

async function readJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  keys: KEYS,
  readJson,
  writeJson,
};
