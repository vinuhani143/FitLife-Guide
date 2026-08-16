import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useApp } from '@/src/store/AppProvider';

export function ProgressBar({ value, max }: { value: number; max: number }) {
  const { colors } = useApp();
  const ratio = max <= 0 ? 0 : Math.max(0, Math.min(1, value / max));
  return (
    <View style={[styles.track, { backgroundColor: colors.primarySoft }]}>
      <View style={[styles.fill, { width: `${ratio * 100}%`, backgroundColor: colors.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 10, borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
});
