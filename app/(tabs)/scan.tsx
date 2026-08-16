import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { Link, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card } from '@/src/components/Card';
import { Screen } from '@/src/components/Screen';
import { MACRO_KEYS } from '@/src/lib/calculations/nutrition';
import { todayIsoDate } from '@/src/lib/calculations/units';
import { formatNumber } from '@/src/lib/format';
import { catalogMatchesForScan, fetchOpenFoodFactsProduct, type PackagedProductNutrition } from '@/src/lib/scanNutrition';
import { translate } from '@/src/lib/i18n';
import { useApp } from '@/src/store/AppProvider';
import type { FoodRecord } from '@/src/types/food';

const MACRO_LABELS: Record<string, string> = {
  energyKcal: 'Calories (kcal)',
  proteinG: 'Protein (g)',
  carbohydrateG: 'Carbohydrates (g)',
  fatG: 'Fat (g)',
  fiberG: 'Fiber (g)',
  sugarG: 'Sugar (g)',
};

export default function ScanScreen() {
  const { language, colors, profile, addDiaryEntry } = useApp();
  const router = useRouter();
  const t = (key: string) => translate(language, key);
  const [permission, requestPermission] = useCameraPermissions();
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [packaged, setPackaged] = useState<PackagedProductNutrition | null>(null);
  const [matches, setMatches] = useState<FoodRecord[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [logged, setLogged] = useState<string | null>(null);
  const lastBarcode = useRef<string | null>(null);

  const applyQuery = (text: string) => {
    setQuery(text);
    setMatches(catalogMatchesForScan(text, profile.dietType));
  };

  const onBarcode = async (result: BarcodeScanningResult) => {
    const code = result.data?.trim();
    if (!code || busy || lastBarcode.current === code) return;
    lastBarcode.current = code;
    setBusy(true);
    setMessage(null);
    setLogged(null);
    try {
      const product = await fetchOpenFoodFactsProduct(code);
      setPackaged(product);
      const searchName = product.name ?? code;
      applyQuery(searchName);
      if (!product.found) setMessage(t('scan.barcodeUnknown'));
    } catch {
      setMessage(t('scan.networkError'));
      applyQuery(code);
    } finally {
      setBusy(false);
    }
  };

  const logFood = async (food: FoodRecord) => {
    await addDiaryEntry({
      date: todayIsoDate(),
      meal: 'lunch',
      foodId: food.id,
      amountGrams: food.serving.defaultAmount,
    });
    setLogged(food.id);
  };

  return (
    <Screen>
      <Card title={t('scan.title')}>
        <Text style={{ color: colors.muted }}>{t('scan.intro')}</Text>
        <Text style={{ color: colors.text }}>{t(`diet.${profile.dietType}`)}</Text>
        {Platform.OS === 'web' ? (
          <Text style={{ color: colors.muted }}>{t('scan.webFallback')}</Text>
        ) : !permission?.granted ? (
          <Pressable style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => void requestPermission()}>
            <Text style={styles.buttonText}>{t('scan.grant')}</Text>
          </Pressable>
        ) : (
          <View style={styles.cameraWrap}>
            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'qr'] }}
              onBarcodeScanned={busy ? undefined : onBarcode}
            />
            <Text style={{ color: colors.muted }}>{t('scan.hint')}</Text>
          </View>
        )}
        {busy ? <ActivityIndicator color={colors.primary} /> : null}
        {message ? <Text style={{ color: colors.warning }}>{message}</Text> : null}
      </Card>

      {packaged ? (
        <Card title={t('scan.packaged')}>
          <Text style={{ color: colors.text, fontWeight: '700' }}>{packaged.name ?? packaged.barcode}</Text>
          {packaged.brands ? <Text style={{ color: colors.muted }}>{packaged.brands}</Text> : null}
          <Text style={{ color: colors.muted }}>{packaged.sourceName} · {t('foods.per100')}</Text>
          {packaged.available ? (
            MACRO_KEYS.map((key) => (
              <Text key={key} style={{ color: colors.text }}>
                {MACRO_LABELS[key]}: {formatNumber(packaged.per100g[key], 2)}
              </Text>
            ))
          ) : (
            <Text style={{ color: colors.warning }}>{t('foods.unavailable')}</Text>
          )}
          <Text style={{ color: colors.muted }}>{packaged.sourceUrl}</Text>
          <Text style={{ color: colors.muted }}>{t('scan.offCaution')}</Text>
        </Card>
      ) : null}

      <Card title={t('scan.match')}>
        <TextInput
          value={query}
          onChangeText={applyQuery}
          placeholder={t('foods.search')}
          placeholderTextColor={colors.muted}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        />
        {matches.map((food) => (
          <View key={food.id} style={[styles.match, { borderColor: colors.border }]}>
            <Link href={`/food/${food.id}`} asChild>
              <Pressable>
                <Text style={{ color: colors.text, fontWeight: '700' }}>
                  {language === 'te' ? food.nameTe : food.nameEn}
                </Text>
                <Text style={{ color: colors.muted }}>
                  {food.nutritionAvailable
                    ? `${food.nutrition.energyKcal} kcal / 100 g`
                    : t('foods.unavailable')}
                </Text>
              </Pressable>
            </Link>
            {food.nutritionAvailable ? (
              <Pressable onPress={() => void logFood(food)}>
                <Text style={{ color: colors.primary, fontWeight: '700' }}>
                  {logged === food.id ? t('scan.logged') : t('scan.logDiary')}
                </Text>
              </Pressable>
            ) : null}
          </View>
        ))}
        {query.trim() && matches.length === 0 ? <Text style={{ color: colors.muted }}>{t('scan.noMatch')}</Text> : null}
        <Pressable onPress={() => router.push('/(tabs)/diary')}>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>{t('plan.logToday')}</Text>
        </Pressable>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cameraWrap: { height: 280, borderRadius: 16, overflow: 'hidden', gap: 8 },
  camera: { flex: 1 },
  button: { borderRadius: 12, padding: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  input: { borderWidth: 1, borderRadius: 12, padding: 12 },
  match: { borderWidth: 1, borderRadius: 12, padding: 10, gap: 6 },
});
