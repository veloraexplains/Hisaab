# RELEASE.md

## Release Channels
1. Internal (debug APK) — for testing
2. Alpha (signed APK) — closed testers
3. Beta (Play Store internal) — wider testers
4. Production (Play Store public) — everyone

## Keystore (One-Time Setup)
Run once to create signing key:
keytool -genkey -v -keystore hisaab-release.keystore -alias hisaab -keyalg RSA -keysize 2048 -validity 10000

IMPORTANT: Never lose this file.
If lost, you cannot update the app on Play Store.
Backup to multiple locations.

## Configure Signing
Create android/key.properties:
storePassword=YOUR_PASSWORD
keyPassword=YOUR_PASSWORD
keyAlias=hisaab
storeFile=../../hisaab-release.keystore

## Update android/app/build.gradle
Add signingConfigs block for release.
Add buildTypes.release with signingConfig.

## Build Release AAB
cd android
./gradlew bundleRelease

Output: android/app/build/outputs/bundle/release/app-release.aab

## Play Store Upload Checklist
[ ] AAB built and signed
[ ] versionCode incremented
[ ] versionName updated
[ ] CHANGELOG.md updated
[ ] App icon 512x512 PNG ready
[ ] Feature graphic 1024x500 ready
[ ] Screenshots (2-8) ready
[ ] Short description (80 chars)
[ ] Full description (4000 chars)
[ ] Privacy Policy URL ready
[ ] Content rating completed
[ ] Data safety form completed
[ ] Target API level set to 34+

## Play Store Metadata
Title: Hisaab - Digital Khata Book
Short: Free offline ledger for small shops
Category: Business
Content Rating: Everyone
Price: Free

## Rollout Strategy
Week 1: 5% rollout
Week 2: 25%
Week 3: 50%
Week 4: 100%

## Version Numbering
- 1.0.0 — First public release
- 1.0.1 — Bug fixes
- 1.1.0 — New features
- 2.0.0 — Major redesign

## Rollback Plan
If critical bug found:
1. Halt rollout
2. Fix bug
3. Bump versionCode
4. Release hotfix
5. Resume rollout at 5%
