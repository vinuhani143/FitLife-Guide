import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '@/src/store/AppProvider';

export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  const { colors } = useApp();
  return (
    <View style={[styles.tile, { backgroundColor: colors.primarySoft }]}>
      <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      {hint ? <Text style={[styles.hint, { color: colors.muted }]}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, minWidth: '45%', borderRadius: 18, padding: 14, gap: 4 },
  label: { fontSize: 12, fontWeight: '600' },
  value: { fontSize: 20, fontWeight: '700' },
  hint: { fontSize: 11 },
});
