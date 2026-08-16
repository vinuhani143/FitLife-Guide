import React from 'react';
import { Text } from 'react-native';
import { Card } from '@/src/components/Card';
import { Screen } from '@/src/components/Screen';
import { ACTIVITIES } from '@/src/data/activities';
import { translate } from '@/src/lib/i18n';
import { useApp } from '@/src/store/AppProvider';

export default function ActivityHistoryScreen() {
  const { language, colors, activities } = useApp();
  return (
    <Screen>
      <Card title={translate(language, 'fitness.logActivity')}>
        {activities.slice().reverse().map((item) => {
          const def = ACTIVITIES.find((a) => a.id === item.activityId);
          return (
            <Text key={item.id} style={{ color: colors.text }}>
              {item.date} · {def ? (language === 'te' ? def.nameTe : def.nameEn) : item.activityId} · {item.durationMinutes} min · {item.intensity}
            </Text>
          );
        })}
      </Card>
    </Screen>
  );
}
