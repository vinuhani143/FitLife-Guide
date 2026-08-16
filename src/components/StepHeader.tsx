import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '@/src/store/AppProvider';

export function StepHeader({ step, title, hint }: { step: number; title: string; hint?: string }) {
  const { colors } = useApp();
  return (
    <View style={styles.wrap}>
      <View style={[styles.badge, { backgroundColor: colors.primary }]}>
        <Text style={styles.num}>{step}</Text>
      </View>
      <View style={styles.text}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {hint ? <Text style={[styles.hint, { color: colors.muted }]}>{hint}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  badge: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  num: { color: '#fff', fontWeight: '800', fontSize: 16 },
  text: { flex: 1, gap: 2 },
  title: { fontSize: 17, fontWeight: '800' },
  hint: { fontSize: 13, lineHeight: 18 },
});
