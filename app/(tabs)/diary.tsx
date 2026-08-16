import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card } from '@/src/components/Card';
import { Disclaimer } from '@/src/components/Disclaimer';
import { EnergyMeter } from '@/src/components/EnergyMeter';
import { FoodTile } from '@/src/components/FoodTile';
import { Screen } from '@/src/components/Screen';
import { StepHeader } from '@/src/components/StepHeader';
import { EMPTY_NUTRITION } from '@/src/data/foods/schema';
import { foods, getFoodById, searchFoods } from '@/src/data/foods';
import { addNutrition, calculateNutrition } from '@/src/lib/calculations/nutrition';
import { compareIntakeToNeed } from '@/src/lib/calculations/intakeCoach';
import { todayIsoDate } from '@/src/lib/calculations/units';
import { formatNumber } from '@/src/lib/format';
import { foodEmoji, mealTint, MEAL_ORDER, MEAL_VISUAL, sizeEmoji } from '@/src/lib/foodVisuals';
import { commonMealFoods, nonVegDiaryFoods } from '@/src/lib/foodSuggestions';
import { translate } from '@/src/lib/i18n';
import { gramsForSize, sizeOptionsForFood, type SizeKey } from '@/src/lib/plateScan';
import { useBodyMetrics } from '@/src/lib/useBodyMetrics';
import { useApp } from '@/src/store/AppProvider';
import type { MealSlot } from '@/src/types/diary';
import type { DietType } from '@/src/types/profile';

const DIETS: DietType[] = ['vegetarian', 'non_vegetarian'];

export default function DiaryScreen() {
  const { language, colors, diary, addDiaryEntry, removeDiaryEntry, profile, setProfile, scheme } = useApp();
  const { target, tdee, proteinTargetG } = useBodyMetrics();
  const router = useRouter();
  const t = (key: string, vars?: Record<string, string | number>) => translate(language, key, vars);
  const today = todayIsoDate();
  const dark = scheme === 'dark';
  const [meal, setMeal] = useState<MealSlot>('breakfast');
  const [query, setQuery] = useState('');
  const [grams, setGrams] = useState('100');
  const [foodId, setFoodId] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const results = query.trim() ? searchFoods(query).slice(0, 9) : [];
  const energyTarget = target?.targetKcal ?? tdee;
  const selected = foodId ? getFoodById(foodId) ?? null : null;
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
  const energyTone = coach.energyBand === 'on_track' ? 'ok' : coach.energyBand === 'a_bit_over' || coach.energyBand === 'much_over' ? 'warn' : 'primary';

  const chooseFood = (id: string) => {
    const food = getFoodById(id);
    setFoodId(id);
    setQuery('');
    setJustAdded(null);
    if (food) setGrams(String(food.serving.defaultAmount));
  };

  const addGrams = (amountGrams: number) => {
    if (!foodId || !Number.isFinite(amountGrams) || amountGrams <= 0) return;
    void addDiaryEntry({ date: today, meal, foodId, amountGrams });
    setJustAdded(foodId);
    setFoodId(null);
    setQuery('');
  };

  const addSize = (size: SizeKey) => {
    if (!foodId) return;
    addGrams(gramsForSize(foodId, size));
  };

  const hello = profile.name
    ? t('diary.hello', { name: profile.name })
    : t('diary.helloAnon');

  return (
    <Screen>
      <Card emoji="📖" title={t('diary.title')}>
        <Text style={[styles.hello, { color: colors.text }]}>{hello}</Text>
        <Text style={{ color: colors.muted, lineHeight: 20 }}>{t('diary.howTo')}</Text>
      </Card>

      <Card emoji="☀️" title={t('diary.totals')}>
        <EnergyMeter
          label={t('diary.energyFill')}
          emoji="⚡"
          value={totals.values.energyKcal ?? 0}
          max={energyTarget}
          unit="kcal"
          message={t(coach.energyMessageKey)}
          tone={energyTone}
        />
        <EnergyMeter
          label={t('diary.strength')}
          emoji="💪"
          value={totals.values.proteinG ?? 0}
          max={proteinTargetG}
          unit="g"
          message={t(coach.proteinMessageKey)}
        />
        <View style={styles.macroRow}>
          <MacroBubble emoji="🍞" label={t('card.carbs')} value={`${formatNumber(totals.values.carbohydrateG, 0)} g`} colors={colors} />
          <MacroBubble emoji="🧈" label={t('card.fat')} value={`${formatNumber(totals.values.fatG, 0)} g`} colors={colors} />
          <MacroBubble emoji="🌿" label={t('card.fiber')} value={`${formatNumber(totals.values.fiberG, 0)} g`} colors={colors} />
        </View>
        {totals.skipped > 0 ? <Text style={{ color: colors.warning }}>{t('foods.unavailable')} ({totals.skipped})</Text> : null}
        <Text style={{ color: colors.muted, lineHeight: 20 }}>{t(coach.nextStepKey)}</Text>
      </Card>

      <Card title={t('diary.todayMeals')}>
        <View style={styles.mealStrip}>
          {MEAL_ORDER.map((slot) => {
            const count = todays.filter((entry) => entry.meal === slot).length;
            const on = meal === slot;
            const visual = MEAL_VISUAL[slot];
            return (
              <Pressable
                key={slot}
                onPress={() => setMeal(slot)}
                style={[
                  styles.mealCard,
                  {
                    backgroundColor: mealTint(slot, dark),
                    borderColor: on ? visual.accent : colors.border,
                    borderWidth: on ? 3 : 1,
                  },
                ]}
              >
                <Text style={styles.mealEmoji}>{visual.emoji}</Text>
                <Text style={[styles.mealName, { color: colors.text }]}>{t(`diary.mealShort.${slot}`)}</Text>
                <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '700' }}>
                  {count ? t('diary.foodsCount', { n: count }) : t('diary.noFoods')}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card>
        <StepHeader step={1} title={t('diary.stepWhen')} hint={t('diary.pickMeal')} />
        <View style={styles.wrap}>
          {MEAL_ORDER.map((slot) => {
            const on = meal === slot;
            return (
              <Pressable
                key={slot}
                onPress={() => setMeal(slot)}
                style={[
                  styles.whenChip,
                  {
                    backgroundColor: on ? mealTint(slot, dark) : colors.card,
                    borderColor: on ? MEAL_VISUAL[slot].accent : colors.border,
                  },
                ]}
              >
                <Text style={styles.whenEmoji}>{MEAL_VISUAL[slot].emoji}</Text>
                <Text style={{ color: colors.text, fontWeight: '800' }}>{t(`diary.${slot}`)}</Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card>
        <StepHeader step={2} title={t('diary.stepWhat')} hint={t('diary.pickFood')} />
        <Text style={{ color: colors.muted }}>{t('diary.dietHint')}</Text>
        <View style={styles.wrap}>
          {DIETS.map((diet) => (
            <Pressable
              key={diet}
              onPress={() => void setProfile({ ...profile, dietType: diet })}
              style={[
                styles.dietChip,
                {
                  borderColor: profile.dietType === diet ? colors.primary : colors.border,
                  backgroundColor: profile.dietType === diet ? colors.primarySoft : 'transparent',
                },
              ]}
            >
              <Text style={styles.whenEmoji}>{diet === 'vegetarian' ? '🥬' : '🍗'}</Text>
              <Text style={{ color: colors.text, fontWeight: '800' }}>{t(`diet.${diet}`)}</Text>
            </Pressable>
          ))}
        </View>
        {nonVegList.length > 0 ? (
          <>
            <Text style={[styles.section, { color: colors.text }]}>{t('diary.nonVegList')}</Text>
            <View style={styles.grid}>
              {nonVegList.map((food) => (
                <FoodTile key={`nv-${food.id}`} food={food} selected={foodId === food.id} onPress={() => chooseFood(food.id)} />
              ))}
            </View>
          </>
        ) : null}
        <Text style={[styles.section, { color: colors.text }]}>{t(commonHintKey)}</Text>
        <View style={styles.grid}>
          {common.map((food) => (
            <FoodTile key={food.id} food={food} selected={foodId === food.id} onPress={() => chooseFood(food.id)} />
          ))}
        </View>
        <TextInput
          value={query}
          onChangeText={(value) => {
            setQuery(value);
            setJustAdded(null);
          }}
          placeholder={t('diary.searchBox')}
          placeholderTextColor={colors.muted}
          style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
        />
        {query.trim() ? (
          <View style={styles.grid}>
            {results.map((food) => (
              <FoodTile key={`q-${food.id}`} food={food} selected={foodId === food.id} onPress={() => chooseFood(food.id)} />
            ))}
          </View>
        ) : null}
        {query.trim() && results.length === 0 ? (
          <Text style={{ color: colors.warning }}>{t('scan.customNone')}</Text>
        ) : null}
      </Card>

      <Card>
        <StepHeader step={3} title={t('diary.stepHowMuch')} hint={selected ? t('diary.sizeHint') : t('diary.needFoodFirst')} />
        {selected ? (
          <>
            <View style={[styles.picked, { backgroundColor: colors.primarySoft, borderColor: colors.primary }]}>
              <Text style={{ fontSize: 28 }}>{foodEmoji(selected)}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.muted, fontWeight: '700' }}>{t('diary.selected')}</Text>
                <Text style={{ color: colors.text, fontWeight: '800', fontSize: 18 }}>
                  {language === 'te' ? selected.nameTe : selected.nameEn}
                </Text>
              </View>
            </View>
            <View style={styles.sizeRow}>
              {sizeOptionsForFood(selected.id).map((option) => (
                <Pressable
                  key={option.key}
                  onPress={() => addSize(option.key)}
                  style={[styles.sizeCard, { borderColor: colors.border, backgroundColor: mealTint(meal, dark) }]}
                >
                  <Text style={{ fontSize: 28 }}>{sizeEmoji(option.key)}</Text>
                  <Text style={{ color: colors.text, fontWeight: '800' }}>{t(`scan.size.${option.key}`)}</Text>
                  <Text style={{ color: colors.muted, fontWeight: '700' }}>{option.grams} g</Text>
                </Pressable>
              ))}
            </View>
            <Text style={{ color: colors.muted }}>{t('diary.gramsHint')}</Text>
            <TextInput
              value={grams}
              onChangeText={setGrams}
              keyboardType="numeric"
              placeholder={t('diary.exactGrams')}
              placeholderTextColor={colors.muted}
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            />
            <Pressable style={[styles.save, { backgroundColor: colors.primary }]} onPress={() => addGrams(Number(grams))}>
              <Text style={styles.saveText}>{t('diary.addBig')}</Text>
            </Pressable>
          </>
        ) : (
          <Text style={{ color: colors.muted }}>{t('diary.needFoodFirst')}</Text>
        )}
        {justAdded ? (
          <Text style={{ color: colors.success, fontWeight: '800', fontSize: 16 }}>
            {t('diary.added', { food: language === 'te' ? getFoodById(justAdded)?.nameTe ?? '' : getFoodById(justAdded)?.nameEn ?? '' })}
          </Text>
        ) : null}
        <Pressable style={[styles.cameraBtn, { borderColor: colors.primary }]} onPress={() => router.push('/(tabs)/scan')}>
          <Text style={{ fontSize: 20 }}>📷</Text>
          <Text style={{ color: colors.primary, fontWeight: '800' }}>{t('diary.cameraHelp')}</Text>
        </Pressable>
      </Card>

      {MEAL_ORDER.map((slot) => {
        const items = todays.filter((entry) => entry.meal === slot);
        const visual = MEAL_VISUAL[slot];
        return (
          <Card key={slot} emoji={visual.emoji} title={t(`diary.${slot}`)} style={{ backgroundColor: mealTint(slot, dark) }}>
            {items.length === 0 ? (
              <Pressable onPress={() => setMeal(slot)}>
                <Text style={{ color: colors.muted }}>{t('diary.emptyMeal')}</Text>
              </Pressable>
            ) : (
              items.map((entry) => {
                const food = getFoodById(entry.foodId);
                const scaled = food ? calculateNutrition(food, entry.amountGrams) : null;
                return (
                  <View key={entry.id} style={[styles.entry, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Pressable onPress={() => router.push(`/food/${entry.foodId}`)} style={styles.entryBody}>
                      <Text style={{ fontSize: 26 }}>{food ? foodEmoji(food) : '🍽️'}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.text, fontWeight: '800' }}>
                          {food ? (language === 'te' ? food.nameTe : food.nameEn) : entry.foodId}
                        </Text>
                        <Text style={{ color: colors.muted, fontWeight: '600' }}>
                          {entry.amountGrams} g
                          {scaled?.available ? ` · ${formatNumber(scaled.values.energyKcal, 0)} kcal` : ` · ${t('foods.unavailable')}`}
                        </Text>
                      </View>
                    </Pressable>
                    <Pressable onPress={() => void removeDiaryEntry(entry.id)} style={styles.remove}>
                      <Text style={{ color: colors.danger, fontWeight: '800' }}>{t('diary.remove')}</Text>
                    </Pressable>
                  </View>
                );
              })
            )}
          </Card>
        );
      })}
      <Disclaimer />
    </Screen>
  );
}

function MacroBubble({
  emoji,
  label,
  value,
  colors,
}: {
  emoji: string;
  label: string;
  value: string;
  colors: { card: string; border: string; text: string; muted: string };
}) {
  return (
    <View style={[styles.bubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={{ fontSize: 18 }}>{emoji}</Text>
      <Text style={{ color: colors.muted, fontSize: 11, fontWeight: '700' }}>{label}</Text>
      <Text style={{ color: colors.text, fontWeight: '800' }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hello: { fontSize: 22, fontWeight: '800', lineHeight: 28 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  mealStrip: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  mealCard: { width: '31%', flexGrow: 1, minWidth: 96, borderRadius: 18, padding: 10, alignItems: 'center', gap: 4 },
  mealEmoji: { fontSize: 26, lineHeight: 32 },
  mealName: { fontWeight: '800', fontSize: 13, textAlign: 'center' },
  whenChip: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 2, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10 },
  whenEmoji: { fontSize: 20 },
  dietChip: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 2, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, flexGrow: 1 },
  section: { fontWeight: '800', fontSize: 15 },
  input: { borderWidth: 2, borderRadius: 16, padding: 12, fontSize: 16 },
  picked: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 2, borderRadius: 16, padding: 12 },
  sizeRow: { flexDirection: 'row', gap: 8 },
  sizeCard: { flex: 1, borderWidth: 2, borderRadius: 18, paddingVertical: 14, alignItems: 'center', gap: 4 },
  save: { borderRadius: 16, padding: 14, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  cameraBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 2, borderRadius: 16, padding: 12 },
  entry: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 16, padding: 10 },
  entryBody: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  remove: { paddingHorizontal: 8, paddingVertical: 6 },
  macroRow: { flexDirection: 'row', gap: 8 },
  bubble: { flex: 1, borderWidth: 1, borderRadius: 16, padding: 10, alignItems: 'center', gap: 2 },
});
