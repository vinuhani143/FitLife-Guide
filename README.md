# FitLife Guide

Educational health, nutrition, and fitness information app for Android-first Expo (SDK 54) with English and Telugu.

This app provides educational information and estimates. It is not a substitute for medical diagnosis, treatment, or individualized advice from a qualified healthcare professional.

## Principles

- Nutritional values are never invented.
- Seed foods with numbers come from USDA FoodData Central, SR Legacy (April 2018 release file).
- Indian-specific foods such as ragi, bajra, foxtail / little / kodo / barnyard millet, paneer, and mutton are catalogued for search, but show **Verified nutritional data not available** until an official IFCT import is added.
- Raw and cooked foods are separate records.
- `0` is only used when the source reported zero. Unknown values are `null`.
- BMI is a screening measure, not a diagnosis. Adult WHO categories are not applied to children or adolescents.
- BMR is labeled **Estimated BMR** (Mifflin-St Jeor). TDEE is labeled **Estimated daily energy requirement**.
- There is no fake “fitness age” from BMI.

## Stack

- Expo SDK 54, React Native 0.81, React 19.1, TypeScript, Expo Router, Yarn
- Local-first: bundled food database + AsyncStorage for profile, diary, water, activity, and progress
- Offline: BMI, BMR, TDEE, food calculations, diary, and education articles work without internet

## Commands

```bash
yarn install
yarn test
yarn typecheck
yarn start
yarn android
yarn web
```

## Android APK

Local release APK (sideload / preview):

```bash
# Requires Android SDK 36, NDK 27.1.12297006, JDK 21
export ANDROID_HOME="$HOME/android-sdk"
yarn apk
```

The APK is written to `dist/FitLife-Guide-1.0.0.apk`.

Install on a phone:

1. Copy the APK to the phone.
2. Allow install from unknown sources for your file app.
3. Open `FitLife-Guide-1.0.0.apk`.
4. Package name: `com.fitlifeguide.app`

This local APK is for preview/sideload. A Play Store upload needs your own release keystore.

Cloud/EAS APK:

```bash
npx eas-cli build --platform android --profile preview
```

## Food database

- Version: `2026.1`
- File: `src/data/foods/usda-sr-legacy-seed.json`
- Import helper: `scripts/import-usda-sr-legacy.py`
- Official USDA download: https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_json_2018-04.zip

## Known limitations

- Indian Food Composition Tables (NIN/ICMR, 2017) are cited but not bundled, so several Indian millets have no numeric values yet.
- Child BMI-for-age percentile tables are not bundled, so the app refuses adult BMI categories for under-18 users.
- Activity calorie numbers are estimates from published MET values (Ainsworth et al., 2011), not measured expenditure.
- Water tracking uses a personal goal, not a universal medical requirement.
