# BUILD.md

## Prerequisites
- Node.js 20 LTS
- Java 17 or 21
- Android SDK 34
- Termux or Linux/macOS

## First-Time Setup
1. cd ~/Hisaab
2. npm install
3. npx cap sync android

## Development Flow
1. Edit files in www/
2. Test in Chrome: python3 -m http.server 8080
3. Open http://localhost:8080
4. When ready: npx cap sync android

## Debug Build
cd android
./gradlew assembleDebug

Output: android/app/build/outputs/apk/debug/app-debug.apk

## Copy APK to Phone
cp android/app/build/outputs/apk/debug/app-debug.apk /sdcard/Download/Hisaab-debug.apk

## Release Build
cd android
./gradlew bundleRelease

Output: android/app/build/outputs/bundle/release/app-release.aab

## Clean Build
cd android
./gradlew clean

## Common Issues

Problem: SDK location not found
Fix: echo 'sdk.dir=~/android-sdk' > android/local.properties

Problem: Java not found
Fix: export JAVA_HOME=(path to java)

Problem: Gradle out of memory
Fix: Add to gradle.properties: org.gradle.jvmargs=-Xmx2048m

Problem: Licenses not accepted
Fix: yes | sdkmanager --licenses

## Build Time Expectations
- First debug build: 2-5 minutes
- Subsequent builds: 30-60 seconds
- Release build: 1-3 minutes

## Version Bumping
Edit android/app/build.gradle:
- versionCode: increment (1, 2, 3...)
- versionName: semantic (1.0.0, 1.0.1...)
