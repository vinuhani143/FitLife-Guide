import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';
import { translate } from '@/src/lib/i18n';
import { useApp } from '@/src/store/AppProvider';

function TabIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={22} style={{ marginBottom: -2 }} {...props} />;
}

export default function TabLayout() {
  const { colors, language } = useApp();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tab,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: translate(language, 'tabs.home'), tabBarIcon: ({ color }) => <TabIcon name="home" color={color} /> }}
      />
      <Tabs.Screen
        name="body"
        options={{ title: translate(language, 'tabs.body'), tabBarIcon: ({ color }) => <TabIcon name="user" color={color} /> }}
      />
      <Tabs.Screen
        name="plan"
        options={{ title: translate(language, 'tabs.plan'), tabBarIcon: ({ color }) => <TabIcon name="flag" color={color} /> }}
      />
      <Tabs.Screen
        name="fitness"
        options={{ href: null, title: translate(language, 'tabs.fitness') }}
      />
      <Tabs.Screen
        name="foods"
        options={{ title: translate(language, 'tabs.foods'), tabBarIcon: ({ color }) => <TabIcon name="leaf" color={color} /> }}
      />
      <Tabs.Screen
        name="diary"
        options={{ title: translate(language, 'tabs.diary'), tabBarIcon: ({ color }) => <TabIcon name="book" color={color} /> }}
      />
    </Tabs>
  );
}
