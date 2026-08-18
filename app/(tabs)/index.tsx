import { Link, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/src/components/Card';
import { Disclaimer } from '@/src/components/Disclaimer';
import { EnergyMeter } from '@/src/components/EnergyMeter';
import { FoodTile } from '@/src/components/FoodTile';
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
import { foodEmoji } from '@/src/lib/foodVisuals';
import { commonMealFoods, suggestFoodsForGoal } from '@/src/lib/foodSuggestions';
import { translate } from '@/src/lib/i18n';
import { useBodyMetrics } from '@/src/lib/useBodyMetrics';
import { useApp } from '@/src/store/AppProvider';

export default function HomeScreen() {
  const { language, colors, diary, water, profile } = useApp();
  const { age, bmi, bmr, tdee, target, plan, proteinTargetG, healthy } = useBodyMetrics();
  const router = useRouter();
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
  const energyTone = coach.energyBand === 'on_track' ? 'ok' : coach.energyBand === 'a_bit_over' || coach.energyBand === 'much_over' ? 'warn' : 'primary';
  const hello = profile.name ? t('home.helloKid', { name: profile.name }) : t('home.helloKidAnon');

  return (
    <Screen>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.app, { color: colors.primary }]}>🌿 {t('app.name')}</Text>
          <Text style={[styles.hello, { color: colors.text }]}>{hello}</Text>
        </View>
        <LanguageSwitch />
      </View>

      <Card emoji="🧍" eyebrow={t('card.body')} title={t('home.yourBody')}>
        <View style={styles.grid}>
          <StatTile label={`🎂 ${t('home.age')}`} value={age != null ? `${age}` : '—'} hint={t('common.years')} />
          <StatTile label={`⚖️ ${t('home.weight')}`} value={profile.weightKg ? `${profile.weightKg} kg` : '—'} />
          <StatTile label={`🎯 ${t('body.targetWeight')}`} value={profile.targetWeightKg ? `${profile.targetWeightKg} kg` : '—'} />
          <StatTile label={`📏 ${t('home.bmi')}`} value={bmi ? formatNumber(bmi.bmi, 1) : '—'} hint={bmi?.category ? t(`bmi.${bmi.category}`) : undefined} />
          <StatTile label={`🔥 ${t('home.bmr')}`} value={formatKcal(bmr?.bmrKcal ?? null)} />
          <StatTile label={`⚡ ${t('home.tdeeShort')}`} value={formatKcal(tdee)} />
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

      <Card emoji="🏁" eyebrow={t('plan.eyebrow')} title={t(`goal.${profile.goal}`)}>
        {plan.status === 'estimated' && plan.estimatedDays != null ? (
          <Text style={{ color: colors.text, fontWeight: '800', fontSize: 18 }}>
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

      <Card emoji="⚡" eyebrow={t('card.nutrition')} title={t('home.todayVsNeed')}>
        <EnergyMeter
          label={t('diary.energyFill')}
          emoji="⚡"
          value={todayNutrition.energyKcal ?? 0}
          max={energyTarget}
          unit="kcal"
          message={t(coach.energyMessageKey)}
          tone={energyTone}
        />
        <Text style={{ color: colors.muted, lineHeight: 20 }}>{t(coach.nextStepKey)}</Text>
        <Link href="/water" asChild>
          <Pressable style={{ gap: 8 }}>
            <Text style={{ color: colors.text, fontWeight: '800' }}>
              💧 {t('home.water')}: {waterToday} ml / {profile.waterGoalMl} ml
            </Text>
            <ProgressBar value={waterToday} max={profile.waterGoalMl} height={14} />
          </Pressable>
        </Link>
        <Link href="/(tabs)/diary" asChild>
          <Pressable style={[styles.cta, { backgroundColor: colors.primary }]}>
            <Text style={styles.ctaText}>{t('diary.addBig')}</Text>
          </Pressable>
        </Link>
      </Card>

      <Card emoji="🍽️" title={t('home.commonFoods')}>
        <Text style={{ color: colors.muted }}>{t('home.commonFoodsHint')}</Text>
        <View style={styles.grid}>
          {common.slice(0, 9).map((food) => (
            <FoodTile key={food.id} food={food} onPress={() => router.push(`/food/${food.id}`)} />
          ))}
        </View>
      </Card>

      <Card emoji="🥗" title={t('plan.whatToEat')}>
        {suggestions.map((item) => (
          <Link key={item.food.id} href={`/food/${item.food.id}`} asChild>
            <Pressable style={[styles.suggest, { borderColor: colors.border }]}>
              <Text style={{ fontSize: 24 }}>{foodEmoji(item.food)}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: '800' }}>
                  {language === 'te' ? item.food.nameTe : item.food.nameEn}
                </Text>
                <Text style={{ color: colors.muted }}>
                  {formatNumber(item.energyPer100, 0)} kcal / 100 g
                </Text>
              </View>
            </Pressable>
          </Link>
        ))}
      </Card>

      <View style={styles.links}>
        <Link href="/education" asChild><Pressable><Text style={styles.link}>📚 {t('common.education')}</Text></Pressable></Link>
        <Link href="/sources" asChild><Pressable><Text style={styles.link}>🔎 {t('common.sources')}</Text></Pressable></Link>
        <Link href="/progress" asChild><Pressable><Text style={styles.link}>📈 {t('common.progress')}</Text></Pressable></Link>
      </View>
      <Disclaimer />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  app: { fontSize: 14, fontWeight: '800', letterSpacing: 0.4 },
  hello: { fontSize: 24, fontWeight: '800', lineHeight: 30 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  links: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  link: { fontWeight: '800', color: '#0F766E', fontSize: 15 },
  suggest: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 16, padding: 10 },
  cta: { borderRadius: 16, padding: 14, alignItems: 'center' },
  ctaText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
