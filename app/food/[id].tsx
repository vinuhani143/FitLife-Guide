import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Text, TextInput } from 'react-native';
import { Card } from '@/src/components/Card';
import { Screen } from '@/src/components/Screen';
import { SourceBadge } from '@/src/components/SourceBadge';
import { AtwaterCard } from '@/src/components/AtwaterCard';
import { getFoodById } from '@/src/data/foods';
import { MACRO_KEYS, MINERAL_KEYS, VITAMIN_KEYS, calculateNutrition } from '@/src/lib/calculations/nutrition';
import { formatNumber } from '@/src/lib/format';
import { translate } from '@/src/lib/i18n';
import { useApp } from '@/src/store/AppProvider';

const LABELS: Record<string, string> = {
  energyKcal: 'Calories (kcal)',
  proteinG: 'Protein (g)',
  carbohydrateG: 'Carbohydrates (g)',
  fatG: 'Fat (g)',
  fiberG: 'Fiber (g)',
  sugarG: 'Sugar (g)',
  calciumMg: 'Calcium (mg)',
  ironMg: 'Iron (mg)',
  magnesiumMg: 'Magnesium (mg)',
  phosphorusMg: 'Phosphorus (mg)',
  potassiumMg: 'Potassium (mg)',
  sodiumMg: 'Sodium (mg)',
  zincMg: 'Zinc (mg)',
  vitaminAMcg: 'Vitamin A (mcg)',
  vitaminCMg: 'Vitamin C (mg)',
  vitaminDMcg: 'Vitamin D (mcg)',
  vitaminEMg: 'Vitamin E (mg)',
  vitaminKMcg: 'Vitamin K (mcg)',
  thiaminMg: 'Thiamin (mg)',
  riboflavinMg: 'Riboflavin (mg)',
  niacinMg: 'Niacin (mg)',
  vitaminB6Mg: 'Vitamin B6 (mg)',
  folateMcg: 'Folate (mcg)',
  vitaminB12Mcg: 'Vitamin B12 (mcg)',
};

export default function FoodDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { language, colors } = useApp();
  const food = getFoodById(String(id));
  const t = (key: string) => translate(language, key);
  const [grams, setGrams] = useState(food ? String(food.serving.defaultAmount) : '100');
  const amount = Number(grams);
  const scaled = useMemo(() => {
    if (!food || !Number.isFinite(amount) || amount <= 0) return null;
    return calculateNutrition(food, amount);
  }, [food, amount]);

  if (!food) {
    return (
      <Screen>
        <Text style={{ color: colors.text }}>{t('common.na')}</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Card title={language === 'te' ? food.nameTe : food.nameEn}>
        <Text style={{ color: colors.muted }}>{language === 'te' ? food.nameEn : food.nameTe}</Text>
        <Text style={{ color: colors.muted }}>{food.category} · {t('foods.state')}: {food.state}</Text>
        {food.usdaDescription ? <Text style={{ color: colors.muted }}>{food.usdaDescription}</Text> : null}
      </Card>

      <Card title={t('foods.per100')}>
        {!food.nutritionAvailable ? (
          <Text style={{ color: colors.warning }}>{t('foods.unavailable')}</Text>
        ) : (
          [...MACRO_KEYS, ...MINERAL_KEYS, ...VITAMIN_KEYS].map((key) => (
            <Text key={key} style={{ color: colors.text }}>
              {LABELS[key]}: {formatNumber(food.nutrition[key], 3)}
            </Text>
          ))
        )}
      </Card>

      <Card title={t('foods.commonServing')}>
        {food.portions.length === 0 ? (
          <Text style={{ color: colors.muted }}>100 g</Text>
        ) : (
          food.portions.map((portion) => (
            <Text key={portion.labelEn} style={{ color: colors.text }}>
              {portion.labelEn} = {portion.grams} g
            </Text>
          ))
        )}
        <TextInput
          value={grams}
          onChangeText={setGrams}
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 10, color: colors.text, marginTop: 8 }}
        />
        <Text style={{ color: colors.muted }}>{t('foods.howCalculated')}</Text>
        <Text style={{ color: colors.text }}>{scaled?.calculationNote}</Text>
        {scaled?.available
          ? MACRO_KEYS.map((key) => (
              <Text key={key} style={{ color: colors.text }}>
                {LABELS[key]} @ {amount} g: {formatNumber(scaled.values[key], 3)}
              </Text>
            ))
          : null}
      </Card>

      {scaled?.available ? (
        <AtwaterCard values={scaled.values} usdaKcal={scaled.values.energyKcal} />
      ) : null}

      <Card title={t('foods.source')}>
        <SourceBadge food={food} />
        {food.source.importStatus ? <Text style={{ color: colors.warning }}>{food.source.importStatus}</Text> : null}
        {food.source.url ? <Text style={{ color: colors.muted }}>{food.source.url}</Text> : null}
      </Card>
    </Screen>
  );
}
