import React from 'react';
import { Text } from 'react-native';
import { Card } from '@/src/components/Card';
import { Disclaimer } from '@/src/components/Disclaimer';
import { Screen } from '@/src/components/Screen';
import { SOURCES } from '@/src/data/sources';
import { foodDatabaseMeta } from '@/src/data/foods';
import { MIFFLIN_ST_JEOR_SOURCE } from '@/src/lib/calculations/bmr';
import { TDEE_SOURCE } from '@/src/lib/calculations/tdee';
import { WHO_ADULT_BMI_SOURCE } from '@/src/lib/calculations/bmi';
import { COMPENDIUM_SOURCE } from '@/src/lib/calculations/fitness';
import { translate } from '@/src/lib/i18n';
import { useApp } from '@/src/store/AppProvider';

const GROUPS = ['who', 'fao', 'usda', 'indian', 'equation', 'activity', 'packaged'] as const;

export default function SourcesScreen() {
  const { language, colors } = useApp();
  const t = (key: string) => translate(language, key);
  return (
    <Screen>
      <Card title={t('sources.title')}>
        <Text style={{ color: colors.muted }}>foodDatabaseVersion {foodDatabaseMeta.version}</Text>
        <Text style={{ color: colors.muted }}>{foodDatabaseMeta.dataset}</Text>
      </Card>
      <Card title={t('sources.formulas')}>
        <Text style={{ color: colors.text }}>BMI: {WHO_ADULT_BMI_SOURCE.formula}</Text>
        <Text style={{ color: colors.text }}>BMR male: {MIFFLIN_ST_JEOR_SOURCE.maleFormula}</Text>
        <Text style={{ color: colors.text }}>BMR female: {MIFFLIN_ST_JEOR_SOURCE.femaleFormula}</Text>
        <Text style={{ color: colors.text }}>TDEE: {TDEE_SOURCE.formula}</Text>
        <Text style={{ color: colors.text }}>{COMPENDIUM_SOURCE.formula}</Text>
      </Card>
      {GROUPS.map((group) => (
        <Card key={group} title={group.toUpperCase()}>
          {SOURCES.filter((item) => item.category === group).map((item) => (
            <Text key={item.id} style={{ color: colors.text, marginBottom: 8 }}>
              {item.name}. {item.organization}. {item.reference} {item.year ? `(${item.year})` : ''}. {item.usedFor}
              {item.url ? ` ${item.url}` : ''}
            </Text>
          ))}
        </Card>
      ))}
      <Disclaimer />
    </Screen>
  );
}
