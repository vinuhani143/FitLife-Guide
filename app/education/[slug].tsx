import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { Card } from '@/src/components/Card';
import { Disclaimer } from '@/src/components/Disclaimer';
import { Screen } from '@/src/components/Screen';
import { EDUCATION_ARTICLES } from '@/src/data/education';
import { SOURCES } from '@/src/data/sources';
import { translate } from '@/src/lib/i18n';
import { useApp } from '@/src/store/AppProvider';

export default function EducationArticleScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { language, colors } = useApp();
  const article = EDUCATION_ARTICLES.find((item) => item.slug === slug);
  const t = (key: string) => translate(language, key);
  if (!article) {
    return <Screen><Text style={{ color: colors.text }}>{t('common.na')}</Text></Screen>;
  }
  const prefix = article.titleKey.replace('.title', '');
  return (
    <Screen>
      <Card title={t(article.titleKey)}>
        <Text style={{ color: colors.primary, fontWeight: '700' }}>{t('education.simple')}</Text>
        <Text style={{ color: colors.text, lineHeight: 22 }}>{t(`${prefix}.simple`)}</Text>
        <Text style={{ color: colors.primary, fontWeight: '700' }}>{t('education.why')}</Text>
        <Text style={{ color: colors.text, lineHeight: 22 }}>{t(`${prefix}.why`)}</Text>
        <Text style={{ color: colors.primary, fontWeight: '700' }}>{t('education.foods')}</Text>
        <Text style={{ color: colors.text, lineHeight: 22 }}>{t(`${prefix}.foods`)}</Text>
        <Text style={{ color: colors.primary, fontWeight: '700' }}>{t('education.evidence')}</Text>
        <Text style={{ color: colors.text, lineHeight: 22 }}>{t(`${prefix}.evidence`)}</Text>
      </Card>
      <Card title={t('common.sources')}>
        {article.sources.map((id) => {
          const source = SOURCES.find((item) => item.id === id);
          return source ? (
            <Text key={id} style={{ color: colors.muted }}>
              {source.name}. {source.reference}
            </Text>
          ) : null;
        })}
      </Card>
      <Disclaimer />
    </Screen>
  );
}
