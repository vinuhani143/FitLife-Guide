import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AppProvider, useApp } from '@/src/store/AppProvider';

function NavigationTree() {
  const { scheme, colors } = useApp();
  const theme = scheme === 'dark'
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, background: colors.bg, card: colors.card, text: colors.text, border: colors.border, primary: colors.primary } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.bg, card: colors.card, text: colors.text, border: colors.border, primary: colors.primary } };

  return (
    <ThemeProvider value={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="food/[id]" options={{ title: 'Food' }} />
        <Stack.Screen name="compare" options={{ title: 'Compare' }} />
        <Stack.Screen name="education/index" options={{ title: 'Education' }} />
        <Stack.Screen name="education/[slug]" options={{ title: 'Article' }} />
        <Stack.Screen name="sources" options={{ title: 'Sources' }} />
        <Stack.Screen name="profile" options={{ title: 'Profile' }} />
        <Stack.Screen name="plan-days" options={{ title: 'Day list' }} />
        <Stack.Screen name="progress" options={{ title: 'Progress' }} />
        <Stack.Screen name="water" options={{ title: 'Water' }} />
        <Stack.Screen name="search" options={{ title: 'Search' }} />
        <Stack.Screen name="activity" options={{ title: 'Activity' }} />
      </Stack>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <NavigationTree />
    </AppProvider>
  );
}
