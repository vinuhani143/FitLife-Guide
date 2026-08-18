import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/src/components/Card';
import { Disclaimer } from '@/src/components/Disclaimer';
import { Screen } from '@/src/components/Screen';
import { StatTile } from '@/src/components/StatTile';
import { HEALTHY_BMI_RANGE } from '@/src/lib/calculations/healthyWeight';
import { MIFFLIN_ST_JEOR_SOURCE } from '@/src/lib/calculations/bmr';
import { TDEE_SOURCE } from '@/src/lib/calculations/tdee';
import { WHO_ADULT_BMI_SOURCE } from '@/src/lib/calculations/bmi';
import { formatKcal, formatNumber } from '@/src/lib/format';
import { translate } from '@/src/lib/i18n';
import { useBodyMetrics } from '@/src/lib/useBodyMetrics';
import { useApp } from '@/src/store/AppProvider';

export default function BodyScreen() {
  const { language, colors, profile } = useApp();
  const { age, lifeStage, bmi, healthy, bmr, tdee, target } = useBodyMetrics();
  const t = (key: string) => translate(language, key);

  return (
    <Screen>
      <Card emoji="🧍" title={t('body.title')}>
        <Text style={{ color: colors.text }}>{profile.name || t('common.profile')}</Text>
        <View style={styles.grid}>
          <StatTile label={t('home.age')} value={age != null ? String(age) : '—'} />
          <StatTile label={t('body.sex')} value={t(`body.sex.${profile.sex}`)} />
          <StatTile label={t('body.height')} value={profile.heightCm ? `${profile.heightCm} cm` : '—'} />
          <StatTile label={t('body.weight')} value={profile.weightKg ? `${profile.weightKg} kg` : '—'} />
          <StatTile label={t('body.waist')} value={profile.waistCm ? `${profile.waistCm} cm` : '—'} />
        </View>
        {lifeStage ? <Text style={{ color: colors.muted }}>{t(`lifestage.${lifeStage}`)}</Text> : null}
        <Link href="/profile" asChild>
          <Pressable><Text style={{ color: colors.primary, fontWeight: '700' }}>{t('body.edit')}</Text></Pressable>
        </Link>
      </Card>

      <Card eyebrow={t('card.bmi')} title={t('home.bmi')}>
        <Text style={[styles.big, { color: colors.text }]}>{bmi ? formatNumber(bmi.bmi, 2) : '—'}</Text>
        {bmi?.interpretable && bmi.category ? (
          <Text style={{ color: colors.text }}>{t(`bmi.${bmi.category}`)}</Text>
        ) : (
          <Text style={{ color: colors.muted }}>{bmi?.reason ?? t('home.setupProfile')}</Text>
        )}
        <Text style={{ color: colors.muted }}>{t('body.bmiNote')}</Text>
        {lifeStage === 'child' || lifeStage === 'adolescent' ? (
          <Text style={{ color: colors.warning }}>{t('body.childBmi')}</Text>
        ) : null}
        <Text style={styles.src}>{WHO_ADULT_BMI_SOURCE.formula}. {WHO_ADULT_BMI_SOURCE.sourceReference}</Text>
      </Card>

      <Card eyebrow={t('card.healthyWeight')} title={t('card.healthyWeight')}>
        <Text style={{ color: colors.text }}>
          {healthy ? `${formatNumber(healthy.minKg, 1)} – ${formatNumber(healthy.maxKg, 1)} kg` : '—'}
        </Text>
        <Text style={{ color: colors.muted }}>
          BMI {HEALTHY_BMI_RANGE.min}–{HEALTHY_BMI_RANGE.max}. {HEALTHY_BMI_RANGE.sourceReference}
        </Text>
      </Card>

      <Card eyebrow={t('card.bmr')} title={t('body.estimatedBmr')}>
        <Text style={[styles.big, { color: colors.text }]}>{formatKcal(bmr?.bmrKcal ?? null)}</Text>
        <Text style={{ color: colors.muted }}>{t('body.formulaUsed')}: {bmr?.formula ?? MIFFLIN_ST_JEOR_SOURCE.maleFormula}</Text>
        <Text style={{ color: colors.muted }}>{MIFFLIN_ST_JEOR_SOURCE.sourceReference}</Text>
        <Text style={{ color: colors.muted }}>{t('body.notExact')}</Text>
      </Card>

      <Card title={t('body.tdeeLabel')}>
        <Text style={[styles.big, { color: colors.text }]}>{formatKcal(tdee)}</Text>
        <Text style={{ color: colors.muted }}>{TDEE_SOURCE.formula}</Text>
        <Text style={{ color: colors.muted }}>{t(`activity.${profile.activityLevel}`)}</Text>
        {target ? (
          <>
            <Text style={{ color: colors.text }}>{t('goal.estimatedTarget')}: {formatKcal(target.targetKcal)}</Text>
            <Text style={{ color: colors.muted }}>{t('goal.varies')}</Text>
            {target.caution ? <Text style={{ color: colors.warning }}>{target.caution}</Text> : null}
          </>
        ) : null}
      </Card>
      <Disclaimer />
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  big: { fontSize: 32, fontWeight: '800' },
  src: { fontSize: 12, color: '#5B6B66' },
});
