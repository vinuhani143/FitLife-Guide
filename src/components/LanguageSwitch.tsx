import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { translate } from '@/src/lib/i18n';
import { useApp } from '@/src/store/AppProvider';
import type { LanguageCode } from '@/src/types/profile';

export function LanguageSwitch({
  value,
  onChange,
}: {
  value?: LanguageCode;
  onChange?: (language: LanguageCode) => void;
}) {
  const { colors, language, setLanguage } = useApp();
  const current = value ?? language;
  return (
    <View style={[styles.row, { borderColor: colors.border }]}>
      {(['en', 'te'] as const).map((code) => {
        const active = current === code;
        return (
          <Pressable
            key={code}
            onPress={() => {
              if (onChange) onChange(code);
              else void setLanguage(code);
            }}
            style={[styles.btn, active && { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.label, { color: active ? '#fff' : colors.text }]}>
              {translate(current, `lang.${code}`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', borderWidth: 1, borderRadius: 999, overflow: 'hidden', alignSelf: 'flex-start' },
  btn: { paddingHorizontal: 14, paddingVertical: 8 },
  label: { fontWeight: '700', fontSize: 13 },
});
