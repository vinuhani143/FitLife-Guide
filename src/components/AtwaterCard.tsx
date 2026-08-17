import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatNumber } from '@/src/lib/format';
import { atwaterBreakdown } from '@/src/lib/calculations/atwater';
import { translate } from '@/src/lib/i18n';
import { useApp } from '@/src/store/AppProvider';
import type { NutritionValues } from '@/src/types/food';

export function AtwaterCard({
  values,
  usdaKcal,
  title,
}: {
  values: NutritionValues;
  usdaKcal: number | null;
  title?: string;
}) {
  const { colors, language } = useApp();
  const t = (key: string, vars?: Record<string, string | number>) => translate(language, key, vars);
  const math = atwaterBreakdown(values);
  if (!math) {
    return (
      <View style={[styles.box, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>{title ?? t('atwater.title')}</Text>
        <Text style={{ color: colors.muted, lineHeight: 20 }}>{t('atwater.needMacros')}</Text>
      </View>
    );
  }

  const row = (emoji: string, label: string, detail: string) => (
    <View style={styles.row}>
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontWeight: '700' }}>{label}</Text>
        <Text style={{ color: colors.muted }}>{detail}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.box, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title ?? t('atwater.title')}</Text>
      <Text style={{ color: colors.muted, lineHeight: 20 }}>{t('atwater.rule')}</Text>
      {row('💪', t('atwater.protein'), t('atwater.line', { g: formatNumber(math.proteinG, 2), factor: 4, kcal: formatNumber(math.proteinKcal, 1) }))}
      {row(
        '🍞',
        t('atwater.carbs'),
        t('atwater.carbLine', {
          total: formatNumber(math.carbohydrateG, 2),
          fiber: formatNumber(math.fiberG, 2),
          available: formatNumber(math.availableCarbG, 2),
          kcal: formatNumber(math.availableCarbKcal, 1),
        }),
      )}
      {row('🧈', t('atwater.fat'), t('atwater.line', { g: formatNumber(math.fatG, 2), factor: 9, kcal: formatNumber(math.fatKcal, 1) }))}
      {row('🌿', t('atwater.fiber'), t('atwater.zeroLine', { g: formatNumber(math.fiberG, 2) }))}
      {row('💧', t('atwater.water'), t('atwater.waterLine'))}
      <Text style={[styles.total, { color: colors.text }]}>
        {t('atwater.textbookTotal', { kcal: formatNumber(math.textbookKcal, 0) })}
      </Text>
      <Text style={[styles.total, { color: colors.primary }]}>
        {t('atwater.usdaTotal', { kcal: usdaKcal != null ? formatNumber(usdaKcal, 0) : '—' })}
      </Text>
      <Text style={{ color: colors.muted, lineHeight: 20 }}>{t('atwater.whyDifferent')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderWidth: 1, borderRadius: 22, padding: 16, gap: 8 },
  title: { fontSize: 18, fontWeight: '800' },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  emoji: { fontSize: 22, lineHeight: 28 },
  total: { fontSize: 16, fontWeight: '800' },
});
