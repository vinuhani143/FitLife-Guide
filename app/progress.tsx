import React, { useMemo } from 'react';
import { Text } from 'react-native';
import { Card } from '@/src/components/Card';
import { Disclaimer } from '@/src/components/Disclaimer';
import { Screen } from '@/src/components/Screen';
import { TrendChart } from '@/src/components/TrendChart';
import { foods } from '@/src/data/foods';
import { interpretBmi } from '@/src/lib/calculations/bmi';
import { calculateNutrition } from '@/src/lib/calculations/nutrition';
import { ageFromDateOfBirth } from '@/src/lib/calculations/units';
import { translate } from '@/src/lib/i18n';
import { useApp } from '@/src/store/AppProvider';

export default function ProgressScreen() {
  const { language, colors, weights, activities, diary, profile } = useApp();
  const t = (key: string) => translate(language, key);
  const age = profile.dateOfBirth ? ageFromDateOfBirth(profile.dateOfBirth) : null;

  const bmiPoints = useMemo(() => {
    if (!profile.heightCm) return [];
    return weights.map((item) => ({
      label: item.date,
      value: interpretBmi(item.weightKg, profile.heightCm!, age).bmi,
    }));
  }, [weights, profile.heightCm, age]);

  const activityPoints = useMemo(() => {
    const byDate = new Map<string, number>();
    for (const item of activities) {
      byDate.set(item.date, (byDate.get(item.date) ?? 0) + item.durationMinutes);
    }
    return [...byDate.entries()].map(([label, value]) => ({ label, value }));
  }, [activities]);

  const nutritionPoints = useMemo(() => {
    const byDate = new Map<string, { kcal: number; protein: number }>();
    for (const entry of diary) {
      const food = foods.find((item) => item.id === entry.foodId);
      if (!food) continue;
      const scaled = calculateNutrition(food, entry.amountGrams);
      if (!scaled.usedInCalculations) continue;
      const current = byDate.get(entry.date) ?? { kcal: 0, protein: 0 };
      current.kcal += scaled.values.energyKcal ?? 0;
      current.protein += scaled.values.proteinG ?? 0;
      byDate.set(entry.date, current);
    }
    return [...byDate.entries()].map(([label, value]) => ({ label, ...value }));
  }, [diary]);

  return (
    <Screen>
      <Card title={t('progress.title')}>
        <Text style={{ color: colors.muted }}>{t('progress.fluctuation')}</Text>
      </Card>
      <Card>
        <TrendChart title={t('progress.weight')} points={weights.map((item) => ({ label: item.date, value: item.weightKg }))} suffix="kg" />
      </Card>
      <Card>
        <TrendChart title={t('progress.bmi')} points={bmiPoints} />
      </Card>
      <Card>
        <TrendChart title={t('progress.activity')} points={activityPoints} suffix="m" />
      </Card>
      <Card>
        <TrendChart title={t('progress.calories')} points={nutritionPoints.map((item) => ({ label: item.label, value: item.kcal }))} />
      </Card>
      <Card>
        <TrendChart title={t('progress.protein')} points={nutritionPoints.map((item) => ({ label: item.label, value: item.protein }))} suffix="g" />
      </Card>
      <Disclaimer />
    </Screen>
  );
}
