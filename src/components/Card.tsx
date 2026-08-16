import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useApp } from '@/src/store/AppProvider';

export function Card({
  title,
  eyebrow,
  children,
  style,
}: {
  title?: string;
  eyebrow?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
}) {
  const { colors } = useApp();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, style]}>
      {eyebrow ? (
        <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow}</Text>
      ) : null}
      {title ? <Text style={[styles.title, { color: colors.text }]}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
});
