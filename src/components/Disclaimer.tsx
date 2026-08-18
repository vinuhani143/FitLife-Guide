import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SAFETY_DISCLAIMER_EN } from '@/src/data/sources';
import { translate } from '@/src/lib/i18n';
import { useApp } from '@/src/store/AppProvider';

export function Disclaimer() {
  const { colors, language } = useApp();
  return (
    <View style={[styles.box, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <Text style={[styles.text, { color: colors.muted }]}>
        {translate(language, 'app.disclaimer') || SAFETY_DISCLAIMER_EN}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderWidth: 1, borderRadius: 16, padding: 12 },
  text: { fontSize: 12, lineHeight: 18 },
});
