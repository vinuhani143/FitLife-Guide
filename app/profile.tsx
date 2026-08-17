import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card } from '@/src/components/Card';
import { Disclaimer } from '@/src/components/Disclaimer';
import { LanguageSwitch } from '@/src/components/LanguageSwitch';
import { Screen } from '@/src/components/Screen';
import { translate } from '@/src/lib/i18n';
import { buildProfileFromForm, profileToFormState, type ProfileFormState } from '@/src/lib/profileForm';
import { useApp } from '@/src/store/AppProvider';
import type { ActivityLevel, DietType, Goal, Sex } from '@/src/types/profile';

const SEXES: Sex[] = ['female', 'male', 'unspecified'];
const ACTIVITIES: ActivityLevel[] = ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'];
const GOALS: Goal[] = ['weight_loss', 'weight_gain', 'weight_maintenance'];
const DIETS: DietType[] = ['vegetarian', 'non_vegetarian'];

export default function ProfileScreen() {
  const { language, colors, profile, setProfile, addWeight, addWaist, ready } = useApp();
  const [form, setForm] = useState<ProfileFormState>(() => profileToFormState(profile));
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const uiLanguage = form.language || language;
  const t = (key: string) => translate(uiLanguage, key);
  const profileRef = useRef(profile);
  profileRef.current = profile;

  useFocusEffect(
    useCallback(() => {
      if (ready) setForm(profileToFormState(profileRef.current));
    }, [ready]),
  );

  const setField = <K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSave = async () => {
    if (saving) return;
    const result = buildProfileFromForm(form, profile);
    if (!result.ok) {
      Alert.alert(t('body.saveErrorTitle'), t(result.errorKey));
      return;
    }

    setSaving(true);
    try {
      await setProfile(result.profile);
      if (result.profile.weightKg) await addWeight(result.profile.weightKg);
      if (result.profile.waistCm) await addWaist(result.profile.waistCm);
      Alert.alert(t('body.savedTitle'), t('body.savedMessage'), [
        { text: t('common.ok'), onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert(t('body.saveErrorTitle'), t('body.saveErrorMessage'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen
      footer={
        <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.bg }]}>
          <Pressable
            accessibilityRole="button"
            disabled={saving}
            hitSlop={8}
            style={[styles.save, { backgroundColor: colors.primary, opacity: saving ? 0.7 : 1 }]}
            onPress={() => {
              void onSave();
            }}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>{t('body.save')}</Text>
            )}
          </Pressable>
        </View>
      }
    >
      <Card title={t('body.edit')}>
        <LanguageSwitch value={form.language} onChange={(next) => setField('language', next)} />
        <Label text={t('body.name')} />
        <TextInput value={form.name} onChangeText={(name) => setField('name', name)} style={input(colors)} />
        <Label text={t('body.dob')} />
        <TextInput
          value={form.dateOfBirth}
          onChangeText={(dateOfBirth) => setField('dateOfBirth', dateOfBirth)}
          placeholder={t('body.dobHint')}
          placeholderTextColor={colors.muted}
          style={input(colors)}
        />
        <Label text={t('body.sex')} />
        <Chips values={SEXES} selected={form.sex} onSelect={(sex) => setField('sex', sex)} label={(v) => t(`body.sex.${v}`)} />
        {form.sex === 'unspecified' ? <Text style={{ color: colors.muted, fontSize: 12 }}>{t('body.sexHint')}</Text> : null}
        <Label text={`${t('body.height')} (cm)`} />
        <TextInput value={form.heightCm} onChangeText={(v) => setField('heightCm', v)} keyboardType="decimal-pad" style={input(colors)} />
        <Label text={`${t('body.weight')} (kg)`} />
        <TextInput value={form.weightKg} onChangeText={(v) => setField('weightKg', v)} keyboardType="decimal-pad" style={input(colors)} />
        <Label text={`${t('body.targetWeight')} (kg)`} />
        <TextInput value={form.targetWeightKg} onChangeText={(v) => setField('targetWeightKg', v)} keyboardType="decimal-pad" style={input(colors)} />
        <Label text={`${t('body.waist')} (cm)`} />
        <TextInput value={form.waistCm} onChangeText={(v) => setField('waistCm', v)} keyboardType="decimal-pad" style={input(colors)} />
        <Label text={t('body.activity')} />
        <Chips values={ACTIVITIES} selected={form.activityLevel} onSelect={(activityLevel) => setField('activityLevel', activityLevel)} label={(v) => t(`activity.${v}`)} />
        <Label text={t('body.goal')} />
        <Chips values={GOALS} selected={form.goal} onSelect={(goal) => setField('goal', goal)} label={(v) => t(`goal.${v}`)} />
        <Label text={t('body.diet')} />
        <Chips values={DIETS} selected={form.dietType} onSelect={(dietType) => setField('dietType', dietType)} label={(v) => t(`diet.${v}`)} />
        <Label text={`${t('water.goal')} (ml)`} />
        <TextInput value={form.waterGoalMl} onChangeText={(v) => setField('waterGoalMl', v)} keyboardType="number-pad" style={input(colors)} />
      </Card>
      <Text style={{ color: colors.muted }}>{t('app.medicalCaution')}</Text>
      <Disclaimer />
    </Screen>
  );
}

function Label({ text }: { text: string }) {
  const { colors } = useApp();
  return <Text style={{ color: colors.muted, fontSize: 12 }}>{text}</Text>;
}

function Chips<T extends string>({
  values,
  selected,
  onSelect,
  label,
}: {
  values: T[];
  selected: T;
  onSelect: (value: T) => void;
  label: (value: T) => string;
}) {
  const { colors } = useApp();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {values.map((value) => (
        <Pressable
          key={value}
          onPress={() => onSelect(value)}
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 6,
            backgroundColor: value === selected ? colors.primarySoft : 'transparent',
          }}
        >
          <Text style={{ color: colors.text }}>{label(value)}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function input(colors: { text: string; border: string }) {
  return { borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 10, color: colors.text };
}

const styles = StyleSheet.create({
  footer: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4, borderTopWidth: 1 },
  save: { borderRadius: 12, minHeight: 52, alignItems: 'center', justifyContent: 'center' },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
