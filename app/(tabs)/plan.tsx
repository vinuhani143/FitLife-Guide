import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/src/components/Card';
import { Disclaimer } from '@/src/components/Disclaimer';
import { Screen } from '@/src/components/Screen';
import { formatKcal, formatNumber } from '@/src/lib/format';
import { foodEmoji } from '@/src/lib/foodVisuals';
import { suggestFoodsForGoal } from '@/src/lib/foodSuggestions';
import { translate } from '@/src/lib/i18n';
import { WHO_PROTEIN_SOURCE, WISHNOFSKY_SOURCE } from '@/src/lib/calculations/weightPlan';
import { useBodyMetrics } from '@/src/lib/useBodyMetrics';
import { useApp } from '@/src/store/AppProvider';
import type { DietType } from '@/src/types/profile';

const DIETS: DietType[] = ['vegetarian', 'non_vegetarian'];

export default function PlanScreen() {
  const { language, colors, profile, setProfile } = useApp();
  const { bmi, bmr, tdee, target, plan, proteinTargetG, healthy } = useBodyMetrics();
  const t = (key: string, vars?: Record<string, string | number>) => translate(language, key, vars);
  const suggestions = suggestFoodsForGoal(profile.goal, 8, profile.dietType);
  const dayCount = plan.status === 'estimated' && plan.estimatedDays != null ? plan.estimatedDays : 7;

  return (
    <Screen>
      <Card emoji="🏁" eyebrow={t('plan.eyebrow')} title={t('plan.title')}>
        <Text style={{ color: colors.text }}>{t(`goal.${profile.goal}`)}</Text>
        <Text style={{ color: colors.muted }}>{t('plan.purpose')}</Text>
        <Text style={{ color: colors.muted }}>{t('body.diet')}</Text>
        <View style={styles.wrap}>
          {DIETS.map((diet) => (
            <Pressable
              key={diet}
              onPress={() => void setProfile({ ...profile, dietType: diet })}
              style={[styles.chip, { borderColor: colors.border, backgroundColor: profile.dietType === diet ? colors.primarySoft : 'transparent' }]}
            >
              <Text style={{ color: colors.text }}>{t(`diet.${diet}`)}</Text>
            </Pressable>
          ))}
        </View>
        <Link href="/profile" asChild>
          <Pressable><Text style={styles.link}>{t('body.edit')}</Text></Pressable>
        </Link>
      </Card>

      <Card title={t('plan.yourNumbers')}>
        <Row label={t('body.weight')} value={profile.weightKg ? `${profile.weightKg} kg` : '—'} />
        <Row label={t('body.targetWeight')} value={profile.targetWeightKg ? `${profile.targetWeightKg} kg` : '—'} />
        <Row label={t('home.bmi')} value={bmi ? formatNumber(bmi.bmi, 1) : '—'} />
        <Row label={t('home.bmr')} value={formatKcal(bmr?.bmrKcal ?? null)} />
        <Row label={t('home.tdee')} value={formatKcal(tdee)} />
        <Row label={t('goal.estimatedTarget')} value={formatKcal(target?.targetKcal ?? null)} />
        <Row label={t('plan.proteinTarget')} value={proteinTargetG != null ? `${formatNumber(proteinTargetG, 1)} g` : '—'} />
        {healthy ? (
          <Text style={{ color: colors.muted }}>
            {t('card.healthyWeight')}: {formatNumber(healthy.minKg, 1)}–{formatNumber(healthy.maxKg, 1)} kg
          </Text>
        ) : null}
      </Card>

      <Card title={t('plan.timeline')}>
        {plan.status === 'estimated' && plan.estimatedDays != null && plan.weeklyKg != null ? (
          <>
            <Text style={[styles.big, { color: colors.text }]}>
              {t('plan.aboutDays', { days: plan.estimatedDays })}
            </Text>
            <Text style={{ color: colors.text }}>
              {t('plan.weeklyRate')}: {formatNumber(plan.weeklyKg, 2)} kg / {t('plan.week')}
            </Text>
            <Text style={{ color: colors.muted }}>
              {profile.weightKg} kg → {profile.targetWeightKg} kg
            </Text>
            {target ? (
              <Text style={{ color: colors.muted }}>
                {t('plan.dailyEnergy')}: {formatKcal(target.targetKcal)} ({target.adjustmentKcal > 0 ? '+' : ''}
                {formatNumber(target.adjustmentKcal, 0)} kcal)
              </Text>
            ) : null}
          </>
        ) : (
          <Text style={{ color: colors.text }}>{t(`plan.status.${plan.status}`)}</Text>
        )}
        <Text style={{ color: colors.muted }}>{plan.caution}</Text>
        <Text style={styles.src}>{WISHNOFSKY_SOURCE.sourceReference}</Text>
        {target?.caution ? <Text style={{ color: colors.warning }}>{target.caution}</Text> : null}
        <Link href="/plan-days" asChild>
          <Pressable style={[styles.cta, { backgroundColor: colors.primary }]}>
            <Text style={styles.ctaText}>
              {plan.status === 'estimated'
                ? t('plan.openDaysCount', { days: dayCount, diet: t(`diet.${profile.dietType}`) })
                : t('plan.openSampleDays', { diet: t(`diet.${profile.dietType}`) })}
            </Text>
          </Pressable>
        </Link>
      </Card>

      <Card emoji="🥗" title={t('plan.whatToEat')}>
        <Text style={{ color: colors.muted }}>{t('plan.suggestIntro')}</Text>
        <Text style={{ color: colors.text, fontWeight: '700' }}>{t(`diet.${profile.dietType}`)}</Text>
        {suggestions.length === 0 ? (
          <Text style={{ color: colors.muted }}>{t('plan.suggestEmpty')}</Text>
        ) : (
          suggestions.map((item) => (
          <Link key={item.food.id} href={`/food/${item.food.id}`} asChild>
            <Pressable style={[styles.food, { borderColor: colors.border }]}>
              <Text style={{ fontSize: 24 }}>{foodEmoji(item.food)}</Text>
              <Text style={{ color: colors.text, fontWeight: '800' }}>
                {language === 'te' ? item.food.nameTe : item.food.nameEn}
              </Text>
              <Text style={{ color: colors.muted }}>
                {formatNumber(item.energyPer100, 0)} kcal / 100 g
                {item.proteinPer100 != null ? ` · ${formatNumber(item.proteinPer100, 1)} g ${t('card.protein')}` : ''}
              </Text>
              <Text style={{ color: colors.muted }}>{t(item.reasonKey)}</Text>
            </Pressable>
          </Link>
          ))
        )}
        <Text style={styles.src}>{WHO_PROTEIN_SOURCE.sourceReference}</Text>
        <Link href="/(tabs)/diary" asChild>
          <Pressable><Text style={styles.link}>{t('plan.logToday')}</Text></Pressable>
        </Link>
        <Link href="/(tabs)/scan" asChild>
          <Pressable><Text style={styles.link}>{t('scan.open')}</Text></Pressable>
        </Link>
      </Card>
      <Disclaimer />
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  const { colors } = useApp();
  return (
    <View style={styles.row}>
      <Text style={{ color: colors.muted }}>{label}</Text>
      <Text style={{ color: colors.text, fontWeight: '700' }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  big: { fontSize: 28, fontWeight: '800' },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  food: { borderWidth: 1, borderRadius: 16, padding: 10, gap: 4 },
  link: { color: '#0F766E', fontWeight: '700' },
  src: { fontSize: 12, color: '#5B6B66' },
  cta: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 12, alignItems: 'center' },
  ctaText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
});
