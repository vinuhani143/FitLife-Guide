import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useColorScheme } from 'react-native';
import type { ActivityEntry, DiaryEntry, WaterEntry } from '@/src/types/diary';
import type { FitnessInputs, LanguageCode, UserProfile, WaistLog, WeightLog } from '@/src/types/profile';
import { palette, type ThemeColors } from '@/src/theme/colors';
import { defaultFitnessInputs, defaultProfile } from './defaults';
import { storage } from './storage';
import { todayIsoDate } from '@/src/lib/calculations/units';

type AppContextValue = {
  ready: boolean;
  profile: UserProfile;
  fitnessInputs: FitnessInputs;
  diary: DiaryEntry[];
  water: WaterEntry[];
  activities: ActivityEntry[];
  weights: WeightLog[];
  waists: WaistLog[];
  compareIds: string[];
  language: LanguageCode;
  colors: ThemeColors;
  scheme: 'light' | 'dark';
  setProfile: (next: UserProfile) => Promise<void>;
  setFitnessInputs: (next: FitnessInputs) => Promise<void>;
  addDiaryEntry: (entry: Omit<DiaryEntry, 'id' | 'createdAt'>) => Promise<void>;
  removeDiaryEntry: (id: string) => Promise<void>;
  addWater: (amountMl: number, date?: string) => Promise<void>;
  addActivity: (entry: Omit<ActivityEntry, 'id'>) => Promise<void>;
  addWeight: (weightKg: number, date?: string) => Promise<void>;
  addWaist: (waistCm: number, date?: string) => Promise<void>;
  setCompareIds: (ids: string[]) => Promise<void>;
  setLanguage: (language: LanguageCode) => Promise<void>;
};

export const AppContext = createContext<AppContextValue | null>(null);

function id(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const [ready, setReady] = useState(false);
  const [profile, setProfileState] = useState(defaultProfile);
  const [fitnessInputs, setFitnessState] = useState(defaultFitnessInputs);
  const [diary, setDiary] = useState<DiaryEntry[]>([]);
  const [water, setWater] = useState<WaterEntry[]>([]);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [weights, setWeights] = useState<WeightLog[]>([]);
  const [waists, setWaists] = useState<WaistLog[]>([]);
  const [compareIds, setCompareState] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [p, f, d, w, a, wt, ws, c] = await Promise.all([
        storage.readJson(storage.keys.profile, defaultProfile),
        storage.readJson(storage.keys.fitness, defaultFitnessInputs),
        storage.readJson(storage.keys.diary, [] as DiaryEntry[]),
        storage.readJson(storage.keys.water, [] as WaterEntry[]),
        storage.readJson(storage.keys.activity, [] as ActivityEntry[]),
        storage.readJson(storage.keys.weight, [] as WeightLog[]),
        storage.readJson(storage.keys.waist, [] as WaistLog[]),
        storage.readJson(storage.keys.compare, [] as string[]),
      ]);
      if (cancelled) return;
      setProfileState({
        ...defaultProfile,
        ...p,
        dietType: p.dietType === 'non_vegetarian' ? 'non_vegetarian' : 'vegetarian',
      });
      setFitnessState({ ...defaultFitnessInputs, ...f });
      setDiary(d);
      setWater(w);
      setActivities(a);
      setWeights(wt);
      setWaists(ws);
      setCompareState(c);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setProfile = useCallback(async (next: UserProfile) => {
    setProfileState(next);
    await storage.writeJson(storage.keys.profile, next);
  }, []);

  const setFitnessInputs = useCallback(async (next: FitnessInputs) => {
    setFitnessState(next);
    await storage.writeJson(storage.keys.fitness, next);
  }, []);

  const addDiaryEntry = useCallback(async (entry: Omit<DiaryEntry, 'id' | 'createdAt'>) => {
    const next: DiaryEntry = { ...entry, id: id('food'), createdAt: new Date().toISOString() };
    setDiary((prev) => {
      const updated = [...prev, next];
      void storage.writeJson(storage.keys.diary, updated);
      return updated;
    });
  }, []);

  const removeDiaryEntry = useCallback(async (entryId: string) => {
    setDiary((prev) => {
      const updated = prev.filter((item) => item.id !== entryId);
      void storage.writeJson(storage.keys.diary, updated);
      return updated;
    });
  }, []);

  const addWater = useCallback(async (amountMl: number, date = todayIsoDate()) => {
    const next: WaterEntry = { id: id('water'), date, amountMl, createdAt: new Date().toISOString() };
    setWater((prev) => {
      const updated = [...prev, next];
      void storage.writeJson(storage.keys.water, updated);
      return updated;
    });
  }, []);

  const addActivity = useCallback(async (entry: Omit<ActivityEntry, 'id'>) => {
    const next: ActivityEntry = { ...entry, id: id('act') };
    setActivities((prev) => {
      const updated = [...prev, next];
      void storage.writeJson(storage.keys.activity, updated);
      return updated;
    });
  }, []);

  const addWeight = useCallback(async (weightKg: number, date = todayIsoDate()) => {
    const next: WeightLog = { id: id('wt'), date, weightKg };
    setWeights((prev) => {
      const updated = [...prev, next];
      void storage.writeJson(storage.keys.weight, updated);
      return updated;
    });
  }, []);

  const addWaist = useCallback(async (waistCm: number, date = todayIsoDate()) => {
    const next: WaistLog = { id: id('waist'), date, waistCm };
    setWaists((prev) => {
      const updated = [...prev, next];
      void storage.writeJson(storage.keys.waist, updated);
      return updated;
    });
  }, []);

  const setCompareIds = useCallback(async (ids: string[]) => {
    const next = ids.slice(0, 4);
    setCompareState(next);
    await storage.writeJson(storage.keys.compare, next);
  }, []);

  const profileRef = useRef(profile);
  profileRef.current = profile;

  const setLanguage = useCallback(async (language: LanguageCode) => {
    const next = { ...profileRef.current, language };
    await setProfile(next);
  }, [setProfile]);

  const value = useMemo<AppContextValue>(
    () => ({
      ready,
      profile,
      fitnessInputs,
      diary,
      water,
      activities,
      weights,
      waists,
      compareIds,
      language: profile.language,
      colors: palette[scheme],
      scheme,
      setProfile,
      setFitnessInputs,
      addDiaryEntry,
      removeDiaryEntry,
      addWater,
      addActivity,
      addWeight,
      addWaist,
      setCompareIds,
      setLanguage,
    }),
    [
      ready,
      profile,
      fitnessInputs,
      diary,
      water,
      activities,
      weights,
      waists,
      compareIds,
      scheme,
      setProfile,
      setFitnessInputs,
      addDiaryEntry,
      removeDiaryEntry,
      addWater,
      addActivity,
      addWeight,
      addWaist,
      setCompareIds,
      setLanguage,
    ],
  );

  return <AppContext value={value}>{children}</AppContext>;
}

export function useApp(): AppContextValue {
  const ctx = React.use(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
