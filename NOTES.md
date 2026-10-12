# Hisaab — Release Notes (2026-09-30)

## Status: READY FOR PLAY STORE ✅

## Built files
- AAB (Play Store): ~/storage/downloads/hisaab-release.aab (8.27 MB)
- APK (testing): ~/storage/downloads/hisaab-release.apk (8.42 MB)
- Keystore: hisaab-release.keystore (BACKUP saved to Downloads)

## Credentials
- Keystore alias: hisaab
- Keystore password: (stored in android/key.properties)
- Package ID: com.hisaab.app

## Testing before publish
- [ ] Install release APK
- [ ] Test all screens
- [ ] Backup works
- [ ] Restore works
- [ ] No crashes

## Play Store materials needed
- [ ] App icon 512x512 (have: icon-preview.png)
- [ ] Feature graphic 1024x500
- [ ] Screenshots (2-8)
- [ ] Short description (80 chars)
- [ ] Full description
- [ ] Privacy policy

## Commands
# Build AAB:
cd ~/Hisaab/android && ./gradlew bundleRelease

# Build APK:
cd ~/Hisaab/android && ./gradlew assembleRelease
