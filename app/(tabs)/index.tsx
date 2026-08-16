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
import { EMPTY_NUTRITION } from '@/src/data/foods/schema';
import { addNutrition, calculateNutrition } from '@/src/lib/calculations/nutrition';
import { compareIntakeToNeed } from '@/src/lib/calculations/intakeCoach';
import { todayIsoDate } from '@/src/lib/calculations/units';
import { formatKcal, formatNumber } from '@/src/lib/format';
import { commonMealFoods, suggestFoodsForGoal } from '@/src/lib/foodSuggestions';
import { translate } from '@/src/lib/i18n';
import { useBodyMetrics } from '@/src/lib/useBodyMetrics';
import { useApp } from '@/src/store/AppProvider';

export default function HomeScreen() {
  const { language, colors, diary, water, profile } = useApp();
  const { age, bmi, bmr, tdee, target, plan, proteinTargetG, healthy } = useBodyMetrics();
  const t = (key: string, vars?: Record<string, string | number>) => translate(language, key, vars);
  const today = todayIsoDate();
  const energyTarget = target?.targetKcal ?? tdee;
  const suggestions = suggestFoodsForGoal(profile.goal, 4, profile.dietType);
  const common = commonMealFoods(undefined, profile.dietType).filter((food) => food.nutritionAvailable);

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

  const coach = compareIntakeToNeed({
    logged: todayNutrition,
    energyTargetKcal: energyTarget,
    proteinTargetG,
    goal: profile.goal,
  });
  const waterToday = water.filter((item) => item.date === today).reduce((sum, item) => sum + item.amountMl, 0);

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
          <StatTile label={t('home.weight')} value={profile.weightKg ? `${profile.weightKg} kg` : '—'} />
          <StatTile label={t('body.targetWeight')} value={profile.targetWeightKg ? `${profile.targetWeightKg} kg` : '—'} />
          <StatTile label={t('home.bmi')} value={bmi ? formatNumber(bmi.bmi, 1) : '—'} hint={bmi?.category ? t(`bmi.${bmi.category}`) : undefined} />
          <StatTile label={t('home.bmr')} value={formatKcal(bmr?.bmrKcal ?? null)} />
          <StatTile label={t('home.tdee')} value={formatKcal(tdee)} />
        </View>
        {healthy ? (
          <Text style={{ color: colors.text }}>
            {t('card.healthyWeight')}: {formatNumber(healthy.minKg, 1)}–{formatNumber(healthy.maxKg, 1)} kg
          </Text>
        ) : (
          <Text style={{ color: colors.muted }}>{t('home.setupProfile')}</Text>
        )}
        <Link href="/profile" asChild>
          <Pressable><Text style={styles.link}>{t('body.edit')}</Text></Pressable>
        </Link>
      </Card>

      <Card eyebrow={t('plan.eyebrow')} title={t(`goal.${profile.goal}`)}>
        {plan.status === 'estimated' && plan.estimatedDays != null ? (
          <Text style={{ color: colors.text, fontWeight: '700' }}>
            {t('plan.aboutDays', { days: plan.estimatedDays })}
          </Text>
        ) : (
          <Text style={{ color: colors.text }}>{t(`plan.status.${plan.status}`)}</Text>
        )}
        <Text style={{ color: colors.muted }}>{t('goal.estimatedTarget')}: {formatKcal(energyTarget)}</Text>
        <Link href="/plan-days" asChild>
          <Pressable><Text style={styles.link}>{t('plan.openDays')}</Text></Pressable>
        </Link>
        <Link href="/(tabs)/plan" asChild>
          <Pressable><Text style={styles.link}>{t('plan.open')}</Text></Pressable>
        </Link>
      </Card>

      <Card eyebrow={t('card.nutrition')} title={t('home.todayVsNeed')}>
        <Text style={{ color: colors.text }}>
          {t('card.calories')}: {formatNumber(todayNutrition.energyKcal, 0)} / {energyTarget ? formatNumber(energyTarget, 0) : '—'}
        </Text>
        {energyTarget ? <ProgressBar value={todayNutrition.energyKcal ?? 0} max={energyTarget} /> : null}
        <Text style={{ color: colors.text }}>
          {t('card.protein')}: {formatNumber(todayNutrition.proteinG, 1)} g
          {proteinTargetG != null ? ` / ${formatNumber(proteinTargetG, 1)} g` : ''}
        </Text>
        <Text style={{ color: colors.text }}>{t(coach.energyMessageKey)}</Text>
        <Text style={{ color: colors.muted }}>{t(coach.nextStepKey)}</Text>
        <Link href="/water" asChild>
          <Pressable>
            <Text style={{ color: colors.text, marginTop: 8 }}>
              {t('home.water')}: {waterToday} ml / {profile.waterGoalMl} ml
            </Text>
            <ProgressBar value={waterToday} max={profile.waterGoalMl} />
          </Pressable>
        </Link>
      </Card>

      <Card title={t('home.commonFoods')}>
        <Text style={{ color: colors.muted }}>{t('home.commonFoodsHint')}</Text>
        <View style={styles.links}>
          {common.map((food) => (
            <Link key={food.id} href={`/food/${food.id}`} asChild>
              <Pressable style={[styles.chip, { borderColor: colors.border }]}>
                <Text style={{ color: colors.text }}>{language === 'te' ? food.nameTe : food.nameEn}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
        <Link href="/(tabs)/diary" asChild>
          <Pressable><Text style={styles.link}>{t('diary.add')}</Text></Pressable>
        </Link>
      </Card>

      <Card title={t('plan.whatToEat')}>
        {suggestions.map((item) => (
          <Text key={item.food.id} style={{ color: colors.text }}>
            {language === 'te' ? item.food.nameTe : item.food.nameEn}
            {' · '}
            {formatNumber(item.energyPer100, 0)} kcal / 100 g
          </Text>
        ))}
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

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  app: { fontSize: 14, fontWeight: '800', letterSpacing: 0.4 },
  hello: { fontSize: 24, fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  links: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  link: { fontWeight: '700', color: '#0F766E' },
});
