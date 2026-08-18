# FitLife Guide

Educational health, nutrition, and fitness information app for Android-first Expo (SDK 54) with English and Telugu.

This app provides educational information and estimates. It is not a substitute for medical diagnosis, treatment, or individualized advice from a qualified healthcare professional.

## What the app is for

FitLife Guide is a **goal + food education** app, not a fitness coach.

1. Enter body measurements, a goal (lose, gain, or maintain weight), and veg or non-veg.
2. See estimated BMI, BMR, daily energy, and a cautious timeline to a target weight.
3. Open the day-to-day list for that many days (veg list or non-veg list).
4. Log what you actually ate, or scan a plate photo and pick Small / Medium / Large for each food, or scan a packaged barcode.

The app does **not** invent nutrition numbers. Everyday items such as idli, dosa, upma, vada, poori, roti, chutney, dal, vegetable curry, chicken curry, biryani, ghee, oats, eggs, cooked fish, prawns, bakery, and snack foods use official USDA FNDDS or SR Legacy records. Homemade recipes vary. Pesarattu, ragi java, sambar, rasam, pongal, lemon rice, vegetable korma, and vegetable fry are listed for search but stay unverified until an official IFCT import exists. Plate scan uses USDA lentil curry as a disclosed stand-in for sambar.

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

Download: [FitLife-Guide-1.1.8.apk](https://github.com/vinuhani143/FitLife-Guide/releases/download/v1.1.8-preview/FitLife-Guide-1.1.8.apk)

Release page: https://github.com/vinuhani143/FitLife-Guide/releases/tag/v1.1.8-preview

Local rebuild for this version (sideload / preview):

```bash
# Requires Android SDK 36, NDK 27.1.12297006, JDK 21
export ANDROID_HOME="$HOME/android-sdk"
yarn apk
```

The APK is written to `dist/FitLife-Guide-1.1.8.apk`.

Install on a phone:

1. Copy the APK to the phone.
2. Allow install from unknown sources for your file app.
3. Open `FitLife-Guide-1.1.8.apk`.
4. Package name: `com.fitlifeguide.app`

This local APK is for preview/sideload. A Play Store upload needs your own release keystore.

Cloud/EAS APK:

```bash
npx eas-cli build --platform android --profile preview
```

## Food database

- Version: `2026.4`
- File: `src/data/foods/usda-sr-legacy-seed.json`
- Import helper: `scripts/import-usda-sr-legacy.py`
- Official USDA download: https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_json_2018-04.zip

## Known limitations

- Indian Food Composition Tables (NIN/ICMR, 2017) are cited but not bundled, so several Indian millets and homemade recipes such as sambar, rasam, pongal, lemon rice, korma, and vegetable fry have no numeric values yet.
- Child BMI-for-age percentile tables are not bundled, so the app refuses adult BMI categories for under-18 users.
- Activity calorie numbers are estimates from published MET values (Ainsworth et al., 2011), not measured expenditure.
- Water tracking uses a personal goal, not a universal medical requirement.
