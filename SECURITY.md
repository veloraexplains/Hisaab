# SECURITY.md

## Security Model
Hisaab is a private, offline-first app.
All data stays on user's device.
No accounts, no servers, no tracking.

## Data Storage
- Data in WebView localStorage
- Sandboxed per-app by Android
- Other apps cannot read it
- User can delete from Settings

## PIN Lock
- Optional 4-digit PIN
- Stored as hash (SHA-256) not plaintext
- Prevents casual access
- NOT encryption (data is still readable if device rooted)

## No Internet
- No INTERNET permission in manifest
- Cannot phone home even if code wanted to
- Play Store will show: No special permissions

## No Analytics
- No Google Analytics
- No Firebase
- No crash reporting
- No usage tracking

## Backup Files
- Plain JSON (human-readable)
- User controls location
- V2 will add encryption option

## Permissions
Required:
- WRITE_EXTERNAL_STORAGE (only for backup export)

NOT requested:
- INTERNET
- CAMERA
- CONTACTS
- LOCATION
- PHONE_STATE

## Whatsapp Reminder
- Uses Android intent (opens WhatsApp app)
- Does NOT access WhatsApp messages
- User sees the message before sending

## Data Ownership
- User owns 100% of their data
- Can export anytime
- Can delete anytime
- Never sold, never shared

## Play Store Compliance
- Data Safety: 'No data collected'
- Permissions: Minimal
- Privacy Policy: Simple, honest

## Future Considerations
- V2: Optional cloud backup with end-to-end encryption
- V3: Multi-user with secure PIN per user
