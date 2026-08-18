import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProgressBar } from '@/src/components/ProgressBar';
import { formatNumber } from '@/src/lib/format';
import { useApp } from '@/src/store/AppProvider';

export function EnergyMeter({
  label,
  emoji,
  value,
  max,
  unit,
  message,
  tone = 'primary',
}: {
  label: string;
  emoji: string;
  value: number;
  max: number | null;
  unit: string;
  message?: string;
  tone?: 'primary' | 'ok' | 'warn';
}) {
  const { colors } = useApp();
  const fill = tone === 'ok' ? colors.success : tone === 'warn' ? colors.warning : colors.primary;
  return (
    <View style={styles.block}>
      <View style={styles.row}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {formatNumber(value, 0)}
            {max != null ? ` / ${formatNumber(max, 0)}` : ''} {unit}
          </Text>
        </View>
      </View>
      {max != null && max > 0 ? <ProgressBar value={value} max={max} color={fill} height={16} /> : null}
      {message ? <Text style={[styles.msg, { color: colors.text }]}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  emoji: { fontSize: 32, lineHeight: 38 },
  label: { fontSize: 13, fontWeight: '700' },
  value: { fontSize: 22, fontWeight: '800' },
  msg: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
});
