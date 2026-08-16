import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { Link, useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card } from '@/src/components/Card';
import { Screen } from '@/src/components/Screen';
import { getFoodById, searchFoods } from '@/src/data/foods';
import { MACRO_KEYS } from '@/src/lib/calculations/nutrition';
import { todayIsoDate } from '@/src/lib/calculations/units';
import { formatNumber } from '@/src/lib/format';
import { catalogMatchesForScan, fetchOpenFoodFactsProduct, type PackagedProductNutrition } from '@/src/lib/scanNutrition';
import {
  defaultPlateFoodIds,
  gramsForSize,
  nutritionSourceFoodId,
  plateCandidateIds,
  plateItemNutrition,
  plateTotals,
  sizeOptionsForFood,
  standInFor,
  type SizeKey,
} from '@/src/lib/plateScan';
import { translate } from '@/src/lib/i18n';
import { useApp } from '@/src/store/AppProvider';
import type { DietType } from '@/src/types/profile';

const DIETS: DietType[] = ['vegetarian', 'non_vegetarian'];

const MACRO_LABELS: Record<string, string> = {
  energyKcal: 'Calories (kcal)',
  proteinG: 'Protein (g)',
  carbohydrateG: 'Carbohydrates (g)',
  fatG: 'Fat (g)',
  fiberG: 'Fiber (g)',
  sugarG: 'Sugar (g)',
};

export default function ScanScreen() {
  const { language, colors, profile, setProfile, addDiaryEntry } = useApp();
  const router = useRouter();
  const t = (key: string, vars?: Record<string, string | number>) => translate(language, key, vars);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [busy, setBusy] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [barcodeOn, setBarcodeOn] = useState(true);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultPlateFoodIds(profile.dietType));
  const [sizes, setSizes] = useState<Record<string, SizeKey | null>>({});
  const [packaged, setPackaged] = useState<PackagedProductNutrition | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [logged, setLogged] = useState(false);
  const [query, setQuery] = useState('');
  const lastBarcode = useRef<string | null>(null);

  const candidates = plateCandidateIds(profile.dietType);
  const chipIds = [...candidates, ...selectedIds.filter((id) => !candidates.includes(id))];
  const visibleIds = selectedIds.filter((foodId) => Boolean(getFoodById(foodId)));
  const searchHits = query.trim() ? searchFoods(query).slice(0, 8) : [];
  const totals = useMemo(
    () => plateTotals(visibleIds.map((foodId) => ({ foodId, size: sizes[foodId] ?? null }))),
    [selectedIds, sizes, profile.dietType],
  );

  const capturePlate = async () => {
    if (busy) return;
    setBusy(true);
    setBarcodeOn(false);
    setMessage(null);
    setLogged(false);
    setSelectedIds(defaultPlateFoodIds(profile.dietType));
    setSizes({});
    setPackaged(null);
    try {
      if (!cameraRef.current || !cameraReady) {
        setMessage(t('scan.captureError'));
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 300));
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      if (photo?.uri) {
        setPhotoUri(photo.uri);
      } else {
        setMessage(t('scan.captureError'));
        setBarcodeOn(true);
      }
    } catch {
      setMessage(t('scan.captureError'));
      setBarcodeOn(true);
    } finally {
      setBusy(false);
    }
  };

  const onBarcode = async (result: BarcodeScanningResult) => {
    const code = result.data?.trim();
    if (!code || busy || lastBarcode.current === code || photoUri) return;
    lastBarcode.current = code;
    setBusy(true);
    setMessage(null);
    try {
      const product = await fetchOpenFoodFactsProduct(code);
      setPackaged(product);
      if (!product.found) setMessage(t('scan.barcodeUnknown'));
      const matches = catalogMatchesForScan(product.name ?? code, profile.dietType);
      if (matches[0]) {
        setSelectedIds((prev) => (prev.includes(matches[0].id) ? prev : [...prev, matches[0].id]));
      }
    } catch {
      setMessage(t('scan.networkError'));
    } finally {
      setBusy(false);
    }
  };

  const addCustom = (foodId: string) => {
    setSelectedIds((prev) => (prev.includes(foodId) ? prev : [...prev, foodId]));
    setQuery('');
    setLogged(false);
  };

  const toggleItem = (foodId: string) => {
    setSelectedIds((prev) => (prev.includes(foodId) ? prev.filter((id) => id !== foodId) : [...prev, foodId]));
    setLogged(false);
  };

  const chooseSize = (foodId: string, size: SizeKey) => {
    setSizes((prev) => ({ ...prev, [foodId]: size }));
    setLogged(false);
  };

  const logPlate = async () => {
    const ready = visibleIds.filter((id) => sizes[id]);
    if (ready.length === 0) return;
    for (const foodId of ready) {
      const size = sizes[foodId]!;
      await addDiaryEntry({
        date: todayIsoDate(),
        meal: 'breakfast',
        foodId: nutritionSourceFoodId(foodId),
        amountGrams: gramsForSize(foodId, size),
      });
    }
    setLogged(true);
  };

  const resetScan = () => {
    setPhotoUri(null);
    setPackaged(null);
    setLogged(false);
    setCameraReady(false);
    setBarcodeOn(true);
    lastBarcode.current = null;
  };

  return (
    <Screen>
      <Card title={t('scan.title')}>
        <Text style={{ color: colors.muted }}>{t('scan.plateIntro')}</Text>
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
        {Platform.OS === 'web' ? (
          <Text style={{ color: colors.muted }}>{t('scan.webFallback')}</Text>
        ) : !permission?.granted ? (
          <Pressable style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => void requestPermission()}>
            <Text style={styles.buttonText}>{t('scan.grant')}</Text>
          </Pressable>
        ) : photoUri ? (
          <View style={styles.previewBox}>
            <Image source={{ uri: photoUri }} style={styles.camera} />
            <Pressable onPress={resetScan}>
              <Text style={{ color: colors.primary, fontWeight: '700' }}>{t('scan.again')}</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.previewBox}>
              <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="back"
                mode="picture"
                barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'qr'] }}
                onCameraReady={() => setCameraReady(true)}
                onBarcodeScanned={barcodeOn && !busy ? onBarcode : undefined}
              />
            </View>
            <Pressable
              style={[styles.button, { backgroundColor: colors.primary, opacity: cameraReady && !busy ? 1 : 0.6 }]}
              onPress={() => void capturePlate()}
            >
              <Text style={styles.buttonText}>{t('scan.capturePlate')}</Text>
            </Pressable>
            <Text style={{ color: colors.muted }}>{t('scan.hint')}</Text>
          </>
        )}
        {busy ? <ActivityIndicator color={colors.primary} /> : null}
        {message ? <Text style={{ color: colors.warning }}>{message}</Text> : null}
      </Card>

      {packaged ? (
        <Card title={t('scan.packaged')}>
          <Text style={{ color: colors.text, fontWeight: '700' }}>{packaged.name ?? packaged.barcode}</Text>
          {packaged.available
            ? MACRO_KEYS.map((key) => (
                <Text key={key} style={{ color: colors.text }}>
                  {MACRO_LABELS[key]}: {formatNumber(packaged.per100g[key], 2)}
                </Text>
              ))
            : <Text style={{ color: colors.warning }}>{t('foods.unavailable')}</Text>}
          <Text style={{ color: colors.muted }}>{t('scan.offCaution')}</Text>
        </Card>
      ) : null}

      <Card title={t('scan.plateItems')}>
        <Text style={{ color: colors.muted }}>{t('scan.plateItemsHint')}</Text>
        <View style={styles.wrap}>
          {chipIds.map((foodId) => {
            const food = getFoodById(foodId);
            if (!food) return null;
            const on = visibleIds.includes(foodId);
            return (
              <Pressable
                key={foodId}
                onPress={() => toggleItem(foodId)}
                style={[styles.chip, { borderColor: colors.border, backgroundColor: on ? colors.primarySoft : 'transparent' }]}
              >
                <Text style={{ color: colors.text }}>{language === 'te' ? food.nameTe : food.nameEn}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={{ color: colors.muted }}>{t('scan.customSearch')}</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('foods.search')}
          placeholderTextColor={colors.muted}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        />
        {query.trim() && searchHits.length === 0 ? (
          <Text style={{ color: colors.warning }}>{t('scan.customNone')}</Text>
        ) : null}
        {searchHits.map((food) => (
          <Pressable key={`search-${food.id}`} onPress={() => addCustom(food.id)}>
            <Text style={{ color: visibleIds.includes(food.id) ? colors.primary : colors.text, fontWeight: visibleIds.includes(food.id) ? '700' : '400' }}>
              {language === 'te' ? food.nameTe : food.nameEn}
              {food.nutritionAvailable ? ` · ${food.nutrition.energyKcal} kcal/100 g` : ` · ${t('foods.unavailable')}`}
            </Text>
          </Pressable>
        ))}
        <Text style={{ color: colors.muted }}>{t('scan.customHint')}</Text>
      </Card>

      {visibleIds.map((foodId) => {
        const food = getFoodById(foodId);
        if (!food) return null;
        const size = sizes[foodId] ?? null;
        const grams = size ? gramsForSize(foodId, size) : null;
        const nutrition = grams ? plateItemNutrition(foodId, grams) : null;
        const standIn = standInFor(foodId);
        return (
          <Card key={foodId} title={language === 'te' ? food.nameTe : food.nameEn}>
            {standIn ? <Text style={{ color: colors.warning }}>{t(standIn.noteKey)}</Text> : null}
            <Text style={{ color: colors.muted }}>{t('scan.pickSize')}</Text>
            <View style={styles.wrap}>
              {sizeOptionsForFood(foodId).map((option) => (
                <Pressable
                  key={option.key}
                  onPress={() => chooseSize(foodId, option.key)}
                  style={[styles.chip, { borderColor: colors.border, backgroundColor: size === option.key ? colors.primarySoft : 'transparent' }]}
                >
                  <Text style={{ color: colors.text, fontWeight: '700' }}>{t(`scan.size.${option.key}`)}</Text>
                  <Text style={{ color: colors.muted }}>{option.grams} g</Text>
                </Pressable>
              ))}
            </View>
            {size && nutrition?.available ? (
              MACRO_KEYS.map((key) => (
                <Text key={key} style={{ color: colors.text }}>
                  {MACRO_LABELS[key]}: {formatNumber(nutrition.values[key], 2)}
                </Text>
              ))
            ) : size && nutrition && !nutrition.available ? (
              <Text style={{ color: colors.warning }}>{t('foods.unavailable')}</Text>
            ) : (
              <Text style={{ color: colors.muted }}>{t('scan.pickSizeHint')}</Text>
            )}
            {size ? (
              <Link href={`/food/${nutritionSourceFoodId(foodId)}`} asChild>
                <Pressable><Text style={{ color: colors.primary }}>{t('scan.openFood')}</Text></Pressable>
              </Link>
            ) : null}
          </Card>
        );
      })}

      <Card title={t('scan.plateTotal')}>
        <Text style={{ color: colors.muted }}>{t('scan.plateTotalHint', { n: totals.counted })}</Text>
        {totals.counted > 0 ? (
          MACRO_KEYS.map((key) => (
            <Text key={key} style={{ color: colors.text, fontWeight: key === 'energyKcal' ? '700' : '400' }}>
              {MACRO_LABELS[key]}: {formatNumber(totals.values[key], 2)}
            </Text>
          ))
        ) : (
          <Text style={{ color: colors.muted }}>{t('scan.needSizes')}</Text>
        )}
        {totals.skipped > 0 ? <Text style={{ color: colors.warning }}>{t('foods.unavailable')} ({totals.skipped})</Text> : null}
        <Pressable
          style={[styles.button, { backgroundColor: colors.primary, opacity: totals.counted ? 1 : 0.5 }]}
          onPress={() => void logPlate()}
        >
          <Text style={styles.buttonText}>{logged ? t('scan.logged') : t('scan.logPlate')}</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/(tabs)/diary')}>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>{t('plan.logToday')}</Text>
        </Pressable>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  previewBox: { height: 240, borderRadius: 16, overflow: 'hidden' },
  camera: { flex: 1, minHeight: 240 },
  button: { borderRadius: 12, padding: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8, minWidth: 96 },
  input: { borderWidth: 1, borderRadius: 10, padding: 10 },
});
