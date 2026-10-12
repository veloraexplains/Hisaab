# OFFLINE.md — Offline Strategy

## Core Principle
Hisaab works 100% offline. No exceptions.

## Why This Matters
- Shop owners often have poor internet
- Reliable beats fancy
- No login = no internet dependency
- Privacy: nothing leaves phone

## What Requires Internet
- Nothing in V1
- WhatsApp reminder uses external app (system)

## What Works Offline
- Add customer
- Add entry
- View ledger
- Balance calculation
- Search
- Backup to local file
- Restore from file
- PIN lock
- Theme switch
- Language switch

## Storage
- localStorage (app sandbox)
- Limit: ~5 MB per origin
- Capacity: ~10,000 entries

## Backup Strategy
- Manual export to phone storage
- JSON file: hisaab-backup-YYYY-MM-DD.json
- User controls when and where
- Auto-reminder if no backup in 30 days

## Restore Process
1. Open Settings → Backup
2. Tap Restore
3. Pick file from Downloads
4. Confirm overwrite
5. Data restored

## No Internet Permission
- AndroidManifest.xml will NOT include INTERNET
- App literally cannot connect
- Play Store shows as No Permissions

## Confirmation UI
- Settings shows: Fully Offline
- Builds user trust
