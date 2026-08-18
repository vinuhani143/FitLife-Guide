import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { foodEmoji } from '@/src/lib/foodVisuals';
import { useApp } from '@/src/store/AppProvider';
import type { FoodRecord } from '@/src/types/food';

export function FoodTile({
  food,
  selected,
  onPress,
}: {
  food: FoodRecord;
  selected?: boolean;
  onPress: () => void;
}) {
  const { colors, language } = useApp();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tile,
        {
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: selected ? colors.primarySoft : colors.card,
        },
      ]}
    >
      <Text style={styles.emoji}>{foodEmoji(food)}</Text>
      <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
        {language === 'te' ? food.nameTe : food.nameEn}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '31%',
    minWidth: 96,
    flexGrow: 1,
    borderWidth: 2,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 6,
  },
  emoji: { fontSize: 28, lineHeight: 34 },
  name: { fontSize: 13, fontWeight: '700', textAlign: 'center' },
});
