import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card } from '@/src/components/Card';
import { Disclaimer } from '@/src/components/Disclaimer';
import { ProgressBar } from '@/src/components/ProgressBar';
import { Screen } from '@/src/components/Screen';
import { EMPTY_NUTRITION } from '@/src/data/foods/schema';
import { foods, searchFoods } from '@/src/data/foods';
import { addNutrition, calculateNutrition } from '@/src/lib/calculations/nutrition';
import { compareIntakeToNeed } from '@/src/lib/calculations/intakeCoach';
import { todayIsoDate } from '@/src/lib/calculations/units';
import { formatNumber } from '@/src/lib/format';
import { commonMealFoods, nonVegDiaryFoods } from '@/src/lib/foodSuggestions';
import { translate } from '@/src/lib/i18n';
import { useBodyMetrics } from '@/src/lib/useBodyMetrics';
import { useApp } from '@/src/store/AppProvider';
import type { MealSlot } from '@/src/types/diary';
import type { DietType } from '@/src/types/profile';

const MEALS: MealSlot[] = ['breakfast', 'morning_snack', 'lunch', 'evening_snack', 'dinner'];
const DIETS: DietType[] = ['vegetarian', 'non_vegetarian'];

export default function DiaryScreen() {
  const { language, colors, diary, addDiaryEntry, removeDiaryEntry, profile, setProfile } = useApp();
  const { target, tdee, proteinTargetG } = useBodyMetrics();
  const router = useRouter();
  const t = (key: string) => translate(language, key);
  const today = todayIsoDate();
  const [meal, setMeal] = useState<MealSlot>('breakfast');
  const [query, setQuery] = useState('');
  const [grams, setGrams] = useState('100');
  const [foodId, setFoodId] = useState<string | null>(null);
  const results = searchFoods(query).slice(0, 8);
  const energyTarget = target?.targetKcal ?? tdee;
  const selected = foods.find((item) => item.id === foodId) ?? null;
  const nonVegList = profile.dietType === 'non_vegetarian' ? nonVegDiaryFoods() : [];
  const nonVegIds = new Set(nonVegList.map((food) => food.id));
  const common = commonMealFoods(meal, profile.dietType).filter((food) => !nonVegIds.has(food.id));
  const commonHintKey =
    meal === 'breakfast'
      ? 'diary.commonHint.breakfast'
      : meal === 'lunch' || meal === 'dinner'
        ? 'diary.commonHint.lunch'
        : 'diary.commonHint.snack';

  const todays = diary.filter((entry) => entry.date === today);
  const totals = useMemo(() => {
    return todays.reduce((acc, entry) => {
      const food = foods.find((item) => item.id === entry.foodId);
      if (!food) return acc;
      const scaled = calculateNutrition(food, entry.amountGrams);
      if (!scaled.usedInCalculations) {
        return { ...acc, skipped: acc.skipped + 1 };
      }
      return { values: addNutrition(acc.values, scaled.values), skipped: acc.skipped };
    }, { values: { ...EMPTY_NUTRITION }, skipped: 0 });
  }, [todays]);

  const coach = compareIntakeToNeed({
    logged: totals.values,
    energyTargetKcal: energyTarget,
    proteinTargetG,
    goal: profile.goal,
  });

  const chooseFood = (id: string) => {
    const food = foods.find((item) => item.id === id);
    setFoodId(id);
    setQuery(food ? (language === 'te' ? food.nameTe : food.nameEn) : id);
    if (food) setGrams(String(food.serving.defaultAmount));
  };

  const addSelected = (amountGrams?: number) => {
    const amount = amountGrams ?? Number(grams);
    if (!foodId || !Number.isFinite(amount) || amount <= 0) return;
    void addDiaryEntry({ date: today, meal, foodId, amountGrams: amount });
    setQuery('');
  };

  return (
    <Screen>
      <Card title={t('diary.title')}>
        <Text style={{ color: colors.muted }}>{t('diary.howTo')}</Text>
        <Text style={{ color: colors.muted }}>{t('diary.dietHint')}</Text>
        <View style={styles.wrap}>
          {DIETS.map((diet) => (
            <Pressable
              key={diet}
              onPress={() => void setProfile({ ...profile, dietType: diet })}
              style={[styles.chip, { borderColor: colors.border, backgroundColor: profile.dietType === diet ? colors.primarySoft : 'transparent' }]}
            >
              <Text style={{ color: colors.text }}>{t(`diet.${diet}`)}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.wrap}>
          {MEALS.map((slot) => (
            <Pressable key={slot} onPress={() => setMeal(slot)} style={[styles.chip, { borderColor: colors.border, backgroundColor: meal === slot ? colors.primarySoft : 'transparent' }]}>
              <Text style={{ color: colors.text }}>{t(`diary.${slot}`)}</Text>
            </Pressable>
          ))}
        </View>
        {nonVegList.length > 0 ? (
          <>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{t('diary.nonVegList')}</Text>
            <Text style={{ color: colors.muted }}>{t('diary.nonVegHint')}</Text>
            <View style={styles.wrap}>
              {nonVegList.map((food) => (
                <Pressable
                  key={`nonveg-${food.id}`}
                  onPress={() => chooseFood(food.id)}
                  style={[styles.chip, { borderColor: colors.border, backgroundColor: foodId === food.id ? colors.primarySoft : 'transparent' }]}
                >
                  <Text style={{ color: colors.text }}>{language === 'te' ? food.nameTe : food.nameEn}</Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : null}
        <Text style={{ color: colors.muted }}>{t(commonHintKey)}</Text>
        <View style={styles.wrap}>
          {common.map((food) => (
            <Pressable
              key={food.id}
              onPress={() => chooseFood(food.id)}
              style={[styles.chip, { borderColor: colors.border, backgroundColor: foodId === food.id ? colors.primarySoft : 'transparent' }]}
            >
              <Text style={{ color: colors.text }}>{language === 'te' ? food.nameTe : food.nameEn}</Text>
            </Pressable>
          ))}
        </View>
        <TextInput value={query} onChangeText={setQuery} placeholder={t('foods.search')} placeholderTextColor={colors.muted} style={[styles.input, { color: colors.text, borderColor: colors.border }]} />
        {results.map((food) => (
          <Pressable key={food.id} onPress={() => chooseFood(food.id)}>
            <Text style={{ color: foodId === food.id ? colors.primary : colors.text, fontWeight: foodId === food.id ? '700' : '400' }}>
              {language === 'te' ? food.nameTe : food.nameEn} · {food.state}
              {food.nutritionAvailable ? ` · ${food.nutrition.energyKcal} kcal/100 g` : ` · ${t('foods.unavailable')}`}
            </Text>
          </Pressable>
        ))}
        {selected ? (
          <View style={styles.wrap}>
            <Pressable style={[styles.chip, { borderColor: colors.border }]} onPress={() => addSelected(selected.serving.defaultAmount)}>
              <Text style={{ color: colors.text }}>
                {selected.serving.commonLabelEn} ({selected.serving.defaultAmount} g)
              </Text>
            </Pressable>
            {selected.portions.slice(0, 3).map((portion) => (
              <Pressable key={portion.labelEn} style={[styles.chip, { borderColor: colors.border }]} onPress={() => addSelected(portion.grams)}>
                <Text style={{ color: colors.text }}>{portion.labelEn} ({portion.grams} g)</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
        <TextInput value={grams} onChangeText={setGrams} keyboardType="numeric" placeholder={t('diary.amount')} placeholderTextColor={colors.muted} style={[styles.input, { color: colors.text, borderColor: colors.border }]} />
        <Pressable style={[styles.save, { backgroundColor: colors.primary }]} onPress={() => addSelected()}>
          <Text style={styles.saveText}>{t('diary.add')}</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/(tabs)/scan')}>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>{t('scan.open')}</Text>
        </Pressable>
      </Card>

      <Card title={t('diary.totals')}>
        <Text style={{ color: colors.text }}>{t('card.calories')}: {formatNumber(totals.values.energyKcal, 0)} / {energyTarget ? formatNumber(energyTarget, 0) : '—'}</Text>
        {energyTarget ? <ProgressBar value={totals.values.energyKcal ?? 0} max={energyTarget} /> : null}
        <Text style={{ color: colors.text }}>
          {t('card.protein')}: {formatNumber(totals.values.proteinG, 1)} g
          {proteinTargetG != null ? ` / ${formatNumber(proteinTargetG, 1)} g` : ''}
        </Text>
        <Text style={{ color: colors.text }}>{t('card.carbs')}: {formatNumber(totals.values.carbohydrateG, 1)} g</Text>
        <Text style={{ color: colors.text }}>{t('card.fat')}: {formatNumber(totals.values.fatG, 1)} g</Text>
        <Text style={{ color: colors.text }}>{t('card.fiber')}: {formatNumber(totals.values.fiberG, 1)} g</Text>
        {totals.skipped > 0 ? <Text style={{ color: colors.warning }}>{t('foods.unavailable')} ({totals.skipped})</Text> : null}
        <Text style={{ color: colors.text }}>{t(coach.energyMessageKey)}</Text>
        <Text style={{ color: colors.text }}>{t(coach.proteinMessageKey)}</Text>
        <Text style={{ color: colors.muted }}>{t(coach.nextStepKey)}</Text>
      </Card>

      {MEALS.map((slot) => (
        <Card key={slot} title={t(`diary.${slot}`)}>
          {todays.filter((entry) => entry.meal === slot).map((entry) => {
            const food = foods.find((item) => item.id === entry.foodId);
            const scaled = food ? calculateNutrition(food, entry.amountGrams) : null;
            return (
              <View key={entry.id} style={styles.row}>
                <Pressable onPress={() => router.push(`/food/${entry.foodId}`)} style={{ flex: 1 }}>
                  <Text style={{ color: colors.text }}>{food ? (language === 'te' ? food.nameTe : food.nameEn) : entry.foodId}</Text>
                  <Text style={{ color: colors.muted }}>
                    {entry.amountGrams} g · {scaled?.available ? `${formatNumber(scaled.values.energyKcal, 0)} kcal` : t('foods.unavailable')}
                  </Text>
                </Pressable>
                <Pressable onPress={() => void removeDiaryEntry(entry.id)}>
                  <Text style={{ color: colors.danger }}>✕</Text>
                </Pressable>
              </View>
            );
          })}
        </Card>
      ))}
      <Disclaimer />
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  input: { borderWidth: 1, borderRadius: 10, padding: 10 },
  save: { borderRadius: 12, padding: 12, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
