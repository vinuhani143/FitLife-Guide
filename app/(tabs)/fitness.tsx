import { Link } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ACTIVITIES } from '@/src/data/activities';
import { WHO_ACTIVITY_SOURCE, estimateActivityKcal, estimateFitnessProfile } from '@/src/lib/calculations/fitness';
import { Card } from '@/src/components/Card';
import { Disclaimer } from '@/src/components/Disclaimer';
import { Screen } from '@/src/components/Screen';
import { translate } from '@/src/lib/i18n';
import { useBodyMetrics } from '@/src/lib/useBodyMetrics';
import { todayIsoDate } from '@/src/lib/calculations/units';
import { useApp } from '@/src/store/AppProvider';
import type { FitnessInputs } from '@/src/types/profile';

export default function FitnessScreen() {
  const { language, colors, fitnessInputs, setFitnessInputs, activities, addActivity, profile } = useApp();
  const { age } = useBodyMetrics();
  const fitness = estimateFitnessProfile(fitnessInputs, age);
  const t = (key: string) => translate(language, key);
  const [draft, setDraft] = useState<FitnessInputs>(fitnessInputs);
  const [duration, setDuration] = useState('30');
  const [activityId, setActivityId] = useState(ACTIVITIES[0].id);

  const week = useMemo(() => {
    const start = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
    return activities.filter((item) => item.date >= start);
  }, [activities]);

  const selected = ACTIVITIES.find((item) => item.id === activityId) ?? ACTIVITIES[0];
  const minutes = Number(duration);
  const kcal =
    selected.met && profile.weightKg && minutes > 0
      ? estimateActivityKcal(selected.met, profile.weightKg, minutes)
      : null;

  return (
    <Screen>
      <Card title={t('fitness.profile')}>
        <Text style={{ color: colors.muted }}>{t('fitness.noFakeAge')}</Text>
        {fitness.status === 'insufficient' ? (
          <Text style={{ color: colors.text }}>{t('fitness.notEnough')}</Text>
        ) : (
          <>
            <Text style={[styles.big, { color: colors.text }]}>{fitness.score}</Text>
            <Text style={{ color: colors.primary }}>{fitness.band}</Text>
            {fitness.notes.map((note) => (
              <Text key={note} style={{ color: colors.muted, fontSize: 12 }}>{note}</Text>
            ))}
          </>
        )}
        {age != null && age < 18 ? <Text style={{ color: colors.warning }}>{t(`lifestage.${age < 10 ? 'child' : 'adolescent'}`)}</Text> : null}
      </Card>

      <Card title={t('fitness.title')}>
        <Field label={t('fitness.rhr')} value={draft.restingHeartRateBpm} onChange={(n) => setDraft({ ...draft, restingHeartRateBpm: n })} />
        <Field label={t('fitness.moderateMin')} value={draft.weeklyModerateMinutes} onChange={(n) => setDraft({ ...draft, weeklyModerateMinutes: n })} />
        <Field label={t('fitness.vigorousMin')} value={draft.weeklyVigorousMinutes} onChange={(n) => setDraft({ ...draft, weeklyVigorousMinutes: n })} />
        <Field label={t('fitness.strengthDays')} value={draft.strengthDaysPerWeek} onChange={(n) => setDraft({ ...draft, strengthDaysPerWeek: n })} />
        <Field label={t('fitness.walkRun')} value={draft.walkRunMinutesPerWeek} onChange={(n) => setDraft({ ...draft, walkRunMinutesPerWeek: n })} />
        <Field label={t('fitness.pushups')} value={draft.pushUps} onChange={(n) => setDraft({ ...draft, pushUps: n })} />
        <Field label={t('fitness.sitToStand')} value={draft.sitToStandReps} onChange={(n) => setDraft({ ...draft, sitToStandReps: n })} />
        <Field label={t('fitness.flexibility')} value={draft.flexibilitySelfScore} onChange={(n) => setDraft({ ...draft, flexibilitySelfScore: n })} />
        <Field label={t('fitness.balance')} value={draft.balanceSelfScore} onChange={(n) => setDraft({ ...draft, balanceSelfScore: n })} />
        <Pressable
          style={[styles.save, { backgroundColor: colors.primary }]}
          onPress={() => {
            void (async () => {
              try {
                await setFitnessInputs(draft);
                Alert.alert(t('body.savedTitle'), t('fitness.savedMessage'));
              } catch {
                Alert.alert(t('body.saveErrorTitle'), t('body.saveErrorMessage'));
              }
            })();
          }}
        >
          <Text style={styles.saveText}>{t('common.save')}</Text>
        </Pressable>
      </Card>

      <Card title={t('fitness.logActivity')}>
        <Text style={{ color: colors.muted }}>{t('fitness.whoAerobic')}</Text>
        <Text style={{ color: colors.muted }}>{t('fitness.whoStrength')}</Text>
        <Text style={styles.src}>{WHO_ACTIVITY_SOURCE.sourceReference}</Text>
        <View style={styles.wrap}>
          {ACTIVITIES.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => setActivityId(item.id)}
              style={[styles.chip, { borderColor: colors.border, backgroundColor: item.id === activityId ? colors.primarySoft : 'transparent' }]}
            >
              <Text style={{ color: colors.text }}>{language === 'te' ? item.nameTe : item.nameEn}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={{ color: colors.muted }}>{selected.metLabel}. {selected.sourceReference}</Text>
        <TextInput
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          placeholder={t('fitness.duration')}
          placeholderTextColor={colors.muted}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        />
        <Text style={{ color: colors.text }}>
          {t('fitness.estimatedKcal')} {kcal != null ? `${kcal.toFixed(1)} kcal` : t('common.na')}
        </Text>
        <Pressable
          style={[styles.save, { backgroundColor: colors.primary }]}
          onPress={() => {
            if (!Number.isFinite(minutes) || minutes <= 0) return;
            void addActivity({
              date: todayIsoDate(),
              activityId: selected.id,
              intensity: selected.defaultIntensity,
              durationMinutes: minutes,
            });
          }}
        >
          <Text style={styles.saveText}>{t('fitness.logActivity')}</Text>
        </Pressable>
        {week.map((item) => {
          const def = ACTIVITIES.find((a) => a.id === item.activityId);
          return (
            <Text key={item.id} style={{ color: colors.muted }}>
              {item.date} · {def ? (language === 'te' ? def.nameTe : def.nameEn) : item.activityId} · {item.durationMinutes} min
            </Text>
          );
        })}
        <Link href="/activity" asChild>
          <Pressable><Text style={{ color: colors.primary }}>{t('common.progress')}</Text></Pressable>
        </Link>
      </Card>
      <Disclaimer />
    </Screen>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (n: number | null) => void;
}) {
  const { colors } = useApp();
  return (
    <View style={{ gap: 4 }}>
      <Text style={{ color: colors.muted, fontSize: 12 }}>{label}</Text>
      <TextInput
        value={value == null ? '' : String(value)}
        onChangeText={(text) => onChange(text.trim() === '' ? null : Number(text))}
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 10, color: colors.text }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  big: { fontSize: 40, fontWeight: '800' },
  src: { fontSize: 12, color: '#5B6B66' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8 },
  input: { borderWidth: 1, borderRadius: 10, padding: 10 },
  save: { borderRadius: 12, padding: 12, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '700' },
});
