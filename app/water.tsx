import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { Card } from '@/src/components/Card';
import { Disclaimer } from '@/src/components/Disclaimer';
import { ProgressBar } from '@/src/components/ProgressBar';
import { Screen } from '@/src/components/Screen';
import { translate } from '@/src/lib/i18n';
import { todayIsoDate } from '@/src/lib/calculations/units';
import { useApp } from '@/src/store/AppProvider';

export default function WaterScreen() {
  const { language, colors, water, addWater, profile } = useApp();
  const t = (key: string) => translate(language, key);
  const [amount, setAmount] = useState('250');
  const today = todayIsoDate();
  const total = useMemo(
    () => water.filter((item) => item.date === today).reduce((sum, item) => sum + item.amountMl, 0),
    [water, today],
  );

  return (
    <Screen>
      <Card title={t('water.title')}>
        <Text style={{ color: colors.muted }}>{t('water.guidance')}</Text>
        <Text style={{ color: colors.text }}>{total} ml / {profile.waterGoalMl} ml</Text>
        <Text style={{ color: colors.muted }}>{(total / 1000).toFixed(2)} L</Text>
        <ProgressBar value={total} max={profile.waterGoalMl} />
        <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" style={[styles.input, { color: colors.text, borderColor: colors.border }]} />
        <Pressable
          style={[styles.save, { backgroundColor: colors.primary }]}
          onPress={() => {
            const ml = Number(amount);
            if (ml > 0) void addWater(ml);
          }}
        >
          <Text style={styles.saveText}>{t('water.add')} (ml)</Text>
        </Pressable>
      </Card>
      <Disclaimer />
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 10, padding: 10 },
  save: { borderRadius: 12, padding: 12, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '700' },
});
