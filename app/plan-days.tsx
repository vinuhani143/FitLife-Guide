import { Link } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/src/components/Card';
import { Screen } from '@/src/components/Screen';
import { getFoodById } from '@/src/data/foods';
import { buildTimelineMealPlan, MEAL_ORDER, type PlannedDay } from '@/src/lib/calculations/dayMealPlan';
import { todayIsoDate } from '@/src/lib/calculations/units';
import { formatKcal, formatNumber } from '@/src/lib/format';
import { translate } from '@/src/lib/i18n';
import { useBodyMetrics } from '@/src/lib/useBodyMetrics';
import { useApp } from '@/src/store/AppProvider';

export default function PlanDaysScreen() {
  const { language, colors, profile } = useApp();
  const { target, tdee, plan } = useBodyMetrics();
  const t = (key: string, vars?: Record<string, string | number>) => translate(language, key, vars);
  const energyTarget = target?.targetKcal ?? tdee;
  const estimatedDays = plan.status === 'estimated' && plan.estimatedDays != null ? plan.estimatedDays : 7;
  const isTimeline = plan.status === 'estimated' && plan.estimatedDays != null;

  const days = useMemo(() => {
    if (energyTarget == null || energyTarget <= 0) return [];
    return buildTimelineMealPlan({
      estimatedDays,
      dietType: profile.dietType,
      targetKcal: energyTarget,
      startDateIso: todayIsoDate(),
    });
  }, [estimatedDays, energyTarget, profile.dietType]);

  return (
    <Screen scroll={false} style={styles.screen}>
      <FlatList
        data={days}
        keyExtractor={(item) => String(item.dayNumber)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Card title={t('plan.dayListTitle')}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{t(`diet.${profile.dietType}`)}</Text>
            <Text style={{ color: colors.muted }}>
              {isTimeline
                ? t('plan.dayListIntro', { days: estimatedDays })
                : t('plan.sampleIntro')}
            </Text>
            <Text style={{ color: colors.muted }}>{t('plan.dayListCaution')}</Text>
            <Text style={{ color: colors.text }}>{t('plan.dailyEnergy')}: {formatKcal(energyTarget)}</Text>
            {energyTarget == null ? <Text style={{ color: colors.warning }}>{t('plan.status.need_energy')}</Text> : null}
          </Card>
        }
        renderItem={({ item }) => <DayCard day={item} />}
      />
    </Screen>
  );
}

function DayCard({ day }: { day: PlannedDay }) {
  const { language, colors } = useApp();
  const t = (key: string, vars?: Record<string, string | number>) => translate(language, key, vars);
  const meals = MEAL_ORDER.filter((meal) => day.items.some((item) => item.meal === meal));
  return (
    <Card title={t('plan.dayN', { n: day.dayNumber, date: day.dateIso })}>
      <Text style={{ color: colors.text, fontWeight: '700' }}>
        {t('plan.dayTotal')}: {formatNumber(day.totalEnergyKcal, 0)} / {formatNumber(day.targetKcal, 0)} kcal
      </Text>
      {meals.map((meal) => (
        <View key={meal} style={styles.meal}>
          <Text style={{ color: colors.muted, fontWeight: '700' }}>{t(`diary.${meal}`)}</Text>
          {day.items
            .filter((item) => item.meal === meal)
            .map((item) => {
              const food = getFoodById(item.foodId);
              const name = food ? (language === 'te' ? food.nameTe : food.nameEn) : item.foodId;
              return (
                <Link key={`${item.meal}-${item.foodId}`} href={`/food/${item.foodId}`} asChild>
                  <Pressable>
                    <Text style={{ color: colors.text }}>
                      {name} · {item.grams} g · {formatNumber(item.energyKcal, 0)} kcal
                    </Text>
                  </Pressable>
                </Link>
              );
            })}
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 0 },
  list: { padding: 16, gap: 12, paddingBottom: 48 },
  meal: { gap: 4, marginTop: 8 },
});
