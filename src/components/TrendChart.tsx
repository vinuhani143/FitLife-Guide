import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '@/src/store/AppProvider';

export function TrendChart({
  title,
  points,
  suffix,
}: {
  title: string;
  points: { label: string; value: number }[];
  suffix?: string;
}) {
  const { colors } = useApp();
  if (points.length === 0) {
    return (
      <View>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={{ color: colors.muted }}>—</Text>
      </View>
    );
  }
  const max = Math.max(...points.map((p) => p.value), 1);
  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <View style={styles.bars}>
        {points.slice(-8).map((point) => (
          <View key={point.label} style={styles.col}>
            <View style={[styles.barTrack, { backgroundColor: colors.primarySoft }]}>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${Math.max(8, (point.value / max) * 100)}%`,
                    backgroundColor: colors.chart,
                  },
                ]}
              />
            </View>
            <Text style={[styles.cap, { color: colors.muted }]}>{point.label.slice(5)}</Text>
            <Text style={[styles.val, { color: colors.text }]}>
              {point.value.toFixed(0)}
              {suffix ?? ''}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  title: { fontWeight: '700' },
  bars: { flexDirection: 'row', gap: 8, alignItems: 'flex-end', minHeight: 120 },
  col: { flex: 1, alignItems: 'center', gap: 4 },
  barTrack: { width: '100%', height: 90, borderRadius: 8, justifyContent: 'flex-end', overflow: 'hidden' },
  bar: { width: '100%', borderRadius: 8 },
  cap: { fontSize: 10 },
  val: { fontSize: 10, fontWeight: '600' },
});
