import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useApp } from '@/src/store/AppProvider';

export function ProgressBar({
  value,
  max,
  color,
  height = 12,
}: {
  value: number;
  max: number;
  color?: string;
  height?: number;
}) {
  const { colors } = useApp();
  const ratio = max <= 0 ? 0 : Math.max(0, Math.min(1, value / max));
  return (
    <View style={[styles.track, { backgroundColor: colors.primarySoft, height, borderRadius: 999 }]}>
      <View
        style={[
          styles.fill,
          { width: `${ratio * 100}%`, backgroundColor: color ?? colors.primary, borderRadius: 999 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { overflow: 'hidden' },
  fill: { height: '100%' },
});
