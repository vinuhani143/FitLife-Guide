import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/src/store/AppProvider';

export function Screen({
  children,
  style,
  scroll = true,
  footer,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  scroll?: boolean;
  footer?: React.ReactNode;
}) {
  const { colors } = useApp();
  const body = <View style={[styles.inner, style]}>{children}</View>;
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        {scroll ? (
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
          >
            {body}
          </ScrollView>
        ) : (
          body
        )}
        {footer}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { paddingBottom: 48, flexGrow: 1 },
  inner: { padding: 16, gap: 12 },
});
