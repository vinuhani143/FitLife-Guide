import { Link, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card } from '@/src/components/Card';
import { Screen } from '@/src/components/Screen';
import { explorerGroups, foods, searchFoods } from '@/src/data/foods';
import { translate } from '@/src/lib/i18n';
import { useApp } from '@/src/store/AppProvider';
import type { FoodCategory } from '@/src/types/food';

export default function FoodsScreen() {
  const { language, colors, compareIds, setCompareIds } = useApp();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<string>('vegetables');
  const t = (key: string) => translate(language, key);

  const visible = useMemo(() => {
    const searched = searchFoods(query);
    if (query.trim()) return searched;
    const selected = explorerGroups.find((item) => item.key === group);
    if (!selected) return searched;
    return searched.filter((food) => selected.categories.includes(food.category as FoodCategory));
  }, [query, group]);

  return (
    <Screen>
      <Card title={t('foods.title')}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('foods.search')}
          placeholderTextColor={colors.muted}
          style={[styles.search, { borderColor: colors.border, color: colors.text }]}
        />
        <View style={styles.wrap}>
          {explorerGroups.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => setGroup(item.key)}
              style={[styles.chip, { borderColor: colors.border, backgroundColor: group === item.key ? colors.primarySoft : 'transparent' }]}
            >
              <Text style={{ color: colors.text }}>{t(`foods.${item.key === 'oils' ? 'oils' : item.key}`)}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable onPress={() => router.push('/compare')}>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>{t('foods.compare')} ({compareIds.length})</Text>
        </Pressable>
      </Card>
      {visible.map((food) => (
        <Link key={food.id} href={`/food/${food.id}`} asChild>
          <Pressable>
            <Card>
              <Text style={{ color: colors.text, fontWeight: '700' }}>{language === 'te' ? food.nameTe : food.nameEn}</Text>
              <Text style={{ color: colors.muted }}>{language === 'te' ? food.nameEn : food.nameTe}</Text>
              <Text style={{ color: colors.muted }}>{food.state} · {food.category}</Text>
              <Text style={{ color: colors.muted }}>
                {food.nutritionAvailable
                  ? `${food.nutrition.energyKcal ?? '—'} kcal / 100 g`
                  : t('foods.unavailable')}
              </Text>
              <Pressable
                onPress={(event) => {
                  event.stopPropagation?.();
                  const next = compareIds.includes(food.id)
                    ? compareIds.filter((id) => id !== food.id)
                    : [...compareIds, food.id].slice(0, 4);
                  void setCompareIds(next);
                }}
              >
                <Text style={{ color: colors.primary }}>{t('foods.addToCompare')}</Text>
              </Pressable>
            </Card>
          </Pressable>
        </Link>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: { borderWidth: 1, borderRadius: 12, padding: 12 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
});
