import { Link } from 'expo-router';
import React from 'react';
import { Pressable, Text } from 'react-native';
import { Card } from '@/src/components/Card';
import { Screen } from '@/src/components/Screen';
import { EDUCATION_ARTICLES } from '@/src/data/education';
import { translate } from '@/src/lib/i18n';
import { useApp } from '@/src/store/AppProvider';

export default function EducationIndex() {
  const { language, colors } = useApp();
  return (
    <Screen>
      <Card title={translate(language, 'education.title')} />
      {EDUCATION_ARTICLES.map((article) => (
        <Link key={article.slug} href={`/education/${article.slug}`} asChild>
          <Pressable>
            <Card>
              <Text style={{ color: colors.text, fontWeight: '700' }}>{translate(language, article.titleKey)}</Text>
            </Card>
          </Pressable>
        </Link>
      ))}
    </Screen>
  );
}
