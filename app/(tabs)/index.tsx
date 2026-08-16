import { Link } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/src/components/Card';
import { Disclaimer } from '@/src/components/Disclaimer';
import { LanguageSwitch } from '@/src/components/LanguageSwitch';
import { ProgressBar } from '@/src/components/ProgressBar';
import { Screen } from '@/src/components/Screen';
import { StatTile } from '@/src/components/StatTile';
import { foods } from '@/src/data/foods';
import { formatKcal, formatNumber } from '@/src/lib/format';
import { translate } from '@/src/lib/i18n';
import { useBodyMetrics } from '@/src/lib/useBodyMetrics';
import { addNutrition, calculateNutrition } from '@/src/lib/calculations/nutrition';
import { todayIsoDate } from '@/src/lib/calculations/units';
import { EMPTY_NUTRITION } from '@/src/data/foods/schema';
import { useApp } from '@/src/store/AppProvider';

export default function HomeScreen() {
  const { language, colors, diary, water, activities, profile } = useApp();
  const { age, bmi, bmr, tdee, target, fitness, healthy } = useBodyMetrics();
  const t = (key: string) => translate(language, key);
  const today = todayIsoDate();

  const todayNutrition = useMemo(() => {
    return diary
      .filter((entry) => entry.date === today)
      .reduce((acc, entry) => {
        const food = foods.find((item) => item.id === entry.foodId);
        if (!food) return acc;
        const scaled = calculateNutrition(food, entry.amountGrams);
        if (!scaled.usedInCalculations) return acc;
        return addNutrition(acc, scaled.values);
      }, { ...EMPTY_NUTRITION });
  }, [diary, today]);

  const waterToday = water.filter((item) => item.date === today).reduce((sum, item) => sum + item.amountMl, 0);
  const weekMinutes = activities
    .filter((item) => item.date >= new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10))
    .reduce((sum, item) => sum + item.durationMinutes, 0);
  const strengthDays = new Set(
    activities
      .filter((item) => item.activityId === 'strength-general' && item.date >= new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10))
      .map((item) => item.date),
  ).size;

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={[styles.app, { color: colors.primary }]}>{t('app.name')}</Text>
          <Text style={[styles.hello, { color: colors.text }]}>{profile.name || t('home.profileSummary')}</Text>
        </View>
        <LanguageSwitch />
      </View>

      <Card eyebrow={t('card.body')} title={t('home.yourBody')}>
        <View style={styles.grid}>
          <StatTile label={t('home.age')} value={age != null ? `${age}` : '—'} hint={t('common.years')} />
          <StatTile label={t('home.height')} value={profile.heightCm ? `${profile.heightCm} cm` : '—'} />
          <StatTile label={t('home.weight')} value={profile.weightKg ? `${profile.weightKg} kg` : '—'} />
          <StatTile label={t('home.bmi')} value={bmi ? formatNumber(bmi.bmi, 1) : '—'} hint={bmi?.category ? t(`bmi.${bmi.category}`) : undefined} />
          <StatTile label={t('home.bmr')} value={formatKcal(bmr?.bmrKcal ?? null)} />
          <StatTile label={t('home.tdee')} value={formatKcal(tdee)} />
        </View>
        <Text style={{ color: colors.muted }}>{t('home.activityLevel')}: {t(`activity.${profile.activityLevel}`)}</Text>
        <Text style={{ color: colors.muted }}>{t('home.goal')}: {t(`goal.${profile.goal}`)}</Text>
        {healthy ? (
          <Text style={{ color: colors.text }}>
            {t('card.healthyWeight')}: {formatNumber(healthy.minKg, 1)}–{formatNumber(healthy.maxKg, 1)} kg
          </Text>
        ) : (
          <Text style={{ color: colors.muted }}>{t('home.setupProfile')}</Text>
        )}
        <Link href="/profile" asChild>
          <Pressable><Text style={{ color: colors.primary, fontWeight: '700' }}>{t('body.edit')}</Text></Pressable>
        </Link>
      </Card>

      <Card eyebrow={t('card.fitness')} title={t('home.yourFitness')}>
        <View style={styles.grid}>
          <StatTile label={t('card.weeklyActivity')} value={`${weekMinutes} min`} />
          <StatTile label={t('card.strength')} value={`${strengthDays}`} />
          <StatTile
            label={t('card.fitnessScore')}
            value={fitness.status === 'estimated' ? String(fitness.score) : '—'}
            hint={fitness.status === 'insufficient' ? t('fitness.notEnough') : fitness.status === 'estimated' ? fitness.band : undefined}
          />
        </View>
      </Card>

      <Card eyebrow={t('card.nutrition')} title={t('home.yourNutrition')}>
        <Text style={{ color: colors.muted }}>{t('home.nutritionSummary')}</Text>
        <Macro label={t('card.calories')} value={todayNutrition.energyKcal} target={target?.targetKcal ?? tdee} />
        <Macro label={t('card.protein')} value={todayNutrition.proteinG} />
        <Macro label={t('card.carbs')} value={todayNutrition.carbohydrateG} />
        <Macro label={t('card.fat')} value={todayNutrition.fatG} />
        <Macro label={t('card.fiber')} value={todayNutrition.fiberG} />
        <Link href="/water" asChild>
          <Pressable>
            <Text style={{ color: colors.text, marginTop: 8 }}>
              {t('home.water')}: {waterToday} ml / {profile.waterGoalMl} ml
            </Text>
            <ProgressBar value={waterToday} max={profile.waterGoalMl} />
          </Pressable>
        </Link>
      </Card>

      <Card eyebrow={t('card.food')} title={t('foods.title')}>
        <View style={styles.links}>
          {[
            ['vegetables', '/(tabs)/foods'],
            ['fruits', '/(tabs)/foods'],
            ['grains', '/(tabs)/foods'],
            ['millets', '/(tabs)/foods'],
            ['proteinFoods', '/(tabs)/foods'],
          ].map(([key, href]) => (
            <Link key={key} href={href as '/(tabs)/foods'} asChild>
              <Pressable style={[styles.chip, { borderColor: colors.border }]}>
                <Text style={{ color: colors.text }}>{t(`card.${key}`)}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </Card>

      <View style={styles.links}>
        <Link href="/education" asChild><Pressable><Text style={styles.link}>{t('common.education')}</Text></Pressable></Link>
        <Link href="/sources" asChild><Pressable><Text style={styles.link}>{t('common.sources')}</Text></Pressable></Link>
        <Link href="/progress" asChild><Pressable><Text style={styles.link}>{t('common.progress')}</Text></Pressable></Link>
      </View>
      <Disclaimer />
    </Screen>
  );
}

function Macro({ label, value, target }: { label: string; value: number | null; target?: number | null }) {
  const { colors } = useApp();
  return (
    <View style={{ gap: 4 }}>
      <Text style={{ color: colors.text }}>
        {label}: {value == null ? '—' : formatNumber(value, 1)}
        {target ? ` / ${formatNumber(target, 0)}` : ''}
      </Text>
      {target ? <ProgressBar value={value ?? 0} max={target} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  app: { fontSize: 14, fontWeight: '800', letterSpacing: 0.4 },
  hello: { fontSize: 24, fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  links: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  link: { fontWeight: '700', color: '#0F766E' },
});
