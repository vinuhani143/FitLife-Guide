import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { FoodRecord } from '@/src/types/food';
import { translate } from '@/src/lib/i18n';
import { useApp } from '@/src/store/AppProvider';

export function SourceBadge({ food }: { food: FoodRecord }) {
  const { colors, language } = useApp();
  return (
    <View style={styles.wrap}>
      <Text style={[styles.line, { color: colors.muted }]}>
        {translate(language, 'foods.source')}: {food.source.organization}
      </Text>
      <Text style={[styles.line, { color: colors.muted }]}>
        {food.source.database}. {food.source.reference}
      </Text>
      <Text style={[styles.line, { color: colors.muted }]}>
        {translate(language, 'foods.dataBasis')}: {food.source.dataBasis}
      </Text>
      <Text style={[styles.line, { color: colors.muted }]}>
        {translate(language, 'foods.lastVerified')}: {food.source.verifiedDate ?? translate(language, 'common.na')}
      </Text>
      <Text style={[styles.line, { color: colors.muted }]}>
        {translate(language, 'foods.confidence')}: {translate(language, `foods.${food.confidence.toLowerCase()}`)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  line: { fontSize: 12, lineHeight: 17 },
});
