# PROJECT.md — Hisaab

## Mission
Build the simplest, fastest, offline-first digital khata book for Indian small businesses — replacing paper ledgers with something reliable, private, and free.

## Vision (2 years)
- 1 million installs on Play Store
- Default khata app for small shops in Tier 2/3 Indian cities
- Multi-language: Hindi, English, Tamil, Telugu, Marathi, Bengali
- Optional cloud sync (paid, but app stays free offline)
- Android + iOS

## Scope (V1)

### IN SCOPE
- Add/edit/delete customers
- Add credit/debit entries per customer
- View total balance per customer + overall
- Send WhatsApp/SMS reminder
- Backup/restore to phone storage
- PIN lock
- Hindi + English
- Search customers
- 100% offline

### OUT OF SCOPE (V1)
- Cloud sync
- Multi-user / staff accounts
- GST invoicing
- Inventory management
- Payments collection
- Reports/charts
- Multi-device sync

## Success Metrics (V1)

- APK size under 10 MB
- Cold start under 2 seconds
- Works fully offline
- 100 customers supported without lag
- Hindi + English both fully working
- Zero crashes

## Timeline

- **Week 1:** Docs (this file + 17 others)
- **Week 2:** Core UI + data layer
- **Week 3:** Features + testing
- **Week 4:** Build, sign, release to Play Store

## Constraints

- Built on Android (Termux)
- No internet-dependent features
- No user accounts (V1)
- No ads (forever, for trust)
- Small APK (mobile data users)

## Assumptions

- User has Android phone (6.0+)
- User knows Hindi or English
- User gives credit to regular customers
- User needs WhatsApp reminder feature

## Risks

- Users may not trust digital khata (mitigate: offline + no login)
- Data loss if phone breaks (mitigate: backup feature)
- Play Store policy issues (mitigate: follow guidelines)

## Stakeholders

- **Owner:** You
- **Developer:** You (with AI assistant)
- **End Users:** Indian small business owners
- **Reviewers:** Play Store team (at release)
