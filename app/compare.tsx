import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Card } from '@/src/components/Card';
import { Screen } from '@/src/components/Screen';
import { getFoodById } from '@/src/data/foods';
import { MACRO_KEYS, VITAMIN_KEYS, calculateNutrition } from '@/src/lib/calculations/nutrition';
import { formatNumber } from '@/src/lib/format';
import { translate } from '@/src/lib/i18n';
import { useApp } from '@/src/store/AppProvider';

const FIELDS = [...MACRO_KEYS, 'calciumMg', 'ironMg', 'potassiumMg', ...VITAMIN_KEYS] as const;

export default function CompareScreen() {
  const { language, colors, compareIds, setCompareIds } = useApp();
  const t = (key: string) => translate(language, key);
  const selected = compareIds.map((id) => getFoodById(id)).filter(Boolean);

  return (
    <Screen scroll={false}>
      <ScrollView horizontal>
        <View style={{ padding: 16, gap: 12 }}>
          <Text style={{ color: colors.text, fontWeight: '700', fontSize: 20 }}>{t('foods.compare')}</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ width: 140 }}>
              <Text style={{ color: colors.muted, fontWeight: '700' }}> / 100 g</Text>
              {FIELDS.map((key) => (
                <Text key={key} style={{ color: colors.text, paddingVertical: 6 }}>{key}</Text>
              ))}
            </View>
            {selected.map((food) => {
              if (!food) return null;
              const values = calculateNutrition(food, 100).values;
              return (
                <View key={food.id} style={{ width: 130 }}>
                  <Text style={{ color: colors.text, fontWeight: '700' }}>{language === 'te' ? food.nameTe : food.nameEn}</Text>
                  <Text style={{ color: colors.muted, fontSize: 11 }}>{food.state}</Text>
                  {FIELDS.map((key) => (
                    <Text key={key} style={{ color: colors.text, paddingVertical: 6 }}>
                      {food.nutritionAvailable ? formatNumber(values[key], 2) : t('foods.unavailable')}
                    </Text>
                  ))}
                  <Pressable onPress={() => void setCompareIds(compareIds.filter((id) => id !== food.id))}>
                    <Text style={{ color: colors.danger }}>✕</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
          {selected.length < 2 ? <Text style={{ color: colors.muted }}>{t('foods.addToCompare')}</Text> : null}
          <Card title={t('foods.source')}>
            {selected.map((food) =>
              food ? (
                <Text key={food.id} style={{ color: colors.muted }}>
                  {food.nameEn}: {food.source.database}, {food.source.reference}
                </Text>
              ) : null,
            )}
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}
