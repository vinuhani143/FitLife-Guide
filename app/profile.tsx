import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card } from '@/src/components/Card';
import { Disclaimer } from '@/src/components/Disclaimer';
import { LanguageSwitch } from '@/src/components/LanguageSwitch';
import { Screen } from '@/src/components/Screen';
import { translate } from '@/src/lib/i18n';
import { useApp } from '@/src/store/AppProvider';
import type { ActivityLevel, Goal, Sex } from '@/src/types/profile';

const SEXES: Sex[] = ['female', 'male', 'unspecified'];
const ACTIVITIES: ActivityLevel[] = ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'];
const GOALS: Goal[] = ['weight_loss', 'weight_maintenance', 'weight_gain', 'muscle_strength', 'general_fitness'];

export default function ProfileScreen() {
  const { language, colors, profile, setProfile, addWeight, addWaist } = useApp();
  const [draft, setDraft] = useState(profile);
  const t = (key: string) => translate(language, key);

  return (
    <Screen>
      <Card title={t('body.edit')}>
        <LanguageSwitch />
        <Label text={t('body.name')} />
        <TextInput value={draft.name} onChangeText={(name) => setDraft({ ...draft, name })} style={input(colors)} />
        <Label text={t('body.dob')} />
        <TextInput value={draft.dateOfBirth ?? ''} onChangeText={(dateOfBirth) => setDraft({ ...draft, dateOfBirth: dateOfBirth || null })} placeholder="YYYY-MM-DD" placeholderTextColor={colors.muted} style={input(colors)} />
        <Label text={t('body.sex')} />
        <Chips values={SEXES} selected={draft.sex} onSelect={(sex) => setDraft({ ...draft, sex })} label={(v) => t(`body.sex.${v}`)} />
        <Label text={`${t('body.height')} (cm)`} />
        <TextInput value={draft.heightCm == null ? '' : String(draft.heightCm)} onChangeText={(v) => setDraft({ ...draft, heightCm: v ? Number(v) : null })} keyboardType="numeric" style={input(colors)} />
        <Label text={`${t('body.weight')} (kg)`} />
        <TextInput value={draft.weightKg == null ? '' : String(draft.weightKg)} onChangeText={(v) => setDraft({ ...draft, weightKg: v ? Number(v) : null })} keyboardType="numeric" style={input(colors)} />
        <Label text={`${t('body.waist')} (cm)`} />
        <TextInput value={draft.waistCm == null ? '' : String(draft.waistCm)} onChangeText={(v) => setDraft({ ...draft, waistCm: v ? Number(v) : null })} keyboardType="numeric" style={input(colors)} />
        <Label text={t('body.activity')} />
        <Chips values={ACTIVITIES} selected={draft.activityLevel} onSelect={(activityLevel) => setDraft({ ...draft, activityLevel })} label={(v) => t(`activity.${v}`)} />
        <Label text={t('body.goal')} />
        <Chips values={GOALS} selected={draft.goal} onSelect={(goal) => setDraft({ ...draft, goal })} label={(v) => t(`goal.${v}`)} />
        <Label text={`${t('water.goal')} (ml)`} />
        <TextInput value={String(draft.waterGoalMl)} onChangeText={(v) => setDraft({ ...draft, waterGoalMl: Number(v) || 2000 })} keyboardType="numeric" style={input(colors)} />
        <Pressable
          style={[styles.save, { backgroundColor: colors.primary }]}
          onPress={() => {
            void setProfile(draft);
            if (draft.weightKg) void addWeight(draft.weightKg);
            if (draft.waistCm) void addWaist(draft.waistCm);
          }}
        >
          <Text style={styles.saveText}>{t('body.save')}</Text>
        </Pressable>
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
          style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: value === selected ? colors.primarySoft : 'transparent' }}
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
  save: { borderRadius: 12, padding: 12, alignItems: 'center', marginTop: 8 },
  saveText: { color: '#fff', fontWeight: '700' },
});
