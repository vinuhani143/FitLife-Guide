#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export ANDROID_HOME="${ANDROID_HOME:-$HOME/android-sdk}"
export ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT:-$ANDROID_HOME}"
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"
export JAVA_HOME="${JAVA_HOME:-/usr/lib/jvm/java-21-openjdk-amd64}"

if [[ ! -d "$ANDROID_HOME/platforms/android-36" ]]; then
  echo "Android SDK platform 36 is missing at $ANDROID_HOME"
  exit 1
fi

if [[ ! -d android ]]; then
  CI=1 npx expo prebuild --platform android
fi

printf 'sdk.dir=%s\n' "$ANDROID_HOME" > android/local.properties

cd android
./gradlew :app:assembleRelease --no-daemon

APK="$(find app/build/outputs/apk/release -name '*.apk' | head -n 1)"
if [[ -z "$APK" ]]; then
  echo "APK not found"
  exit 1
fi

VERSION="$(node -p "require('./package.json').version")"
DEST_DIR="${FITLIFE_APK_OUT:-/opt/cursor/artifacts}"
mkdir -p "$DEST_DIR" "$ROOT/dist"
OUT="$DEST_DIR/FitLife-Guide-$VERSION.apk"
cp "$APK" "$OUT"
cp "$APK" "$ROOT/dist/FitLife-Guide-$VERSION.apk"
echo "APK ready: $OUT"
ls -lh "$OUT" "$ROOT/dist/FitLife-Guide-$VERSION.apk"
