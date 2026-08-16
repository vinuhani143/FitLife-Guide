import React from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/src/store/AppProvider';

export function Screen({
  children,
  style,
  scroll = true,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  scroll?: boolean;
}) {
  const { colors } = useApp();
  const body = (
    <View style={[styles.inner, style]}>{children}</View>
  );
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top', 'left', 'right']}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {body}
        </ScrollView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 32 },
  inner: { padding: 16, gap: 12 },
});
