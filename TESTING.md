# TESTING.md

## Testing Strategy
Manual testing only for V1.
Test in Chrome first, then APK.

## Test Environments
- Chrome on desktop (dev)
- Android 8 phone (older)
- Android 13 phone (modern)

## Test Cases — Customers
TC-01: Add customer with name only
TC-02: Add customer with name + phone
TC-03: Reject empty name
TC-04: Reject invalid phone (not 10 digits)
TC-05: Edit customer name
TC-06: Delete customer (confirms, removes entries)
TC-07: Search finds by name
TC-08: Search finds by phone
TC-09: Empty search shows all

## Test Cases — Entries
TC-10: Add gave entry (500 rupees)
TC-11: Add got entry (300 rupees)
TC-12: Reject amount 0 or negative
TC-13: Add note to entry
TC-14: Choose past date
TC-15: Delete entry
TC-16: Balance recalculates correctly
TC-17: Total pending updates

## Test Cases — WhatsApp
TC-18: Reminder opens WhatsApp
TC-19: Message pre-filled with name + amount
TC-20: Language matches app setting

## Test Cases — Backup
TC-21: Export creates JSON file
TC-22: File saved to Downloads
TC-23: Restore from backup works
TC-24: Restore overwrites existing (with confirm)

## Test Cases — PIN
TC-25: Set PIN 4 digits
TC-26: App opens PIN screen on restart
TC-27: Wrong PIN rejected
TC-28: Correct PIN unlocks
TC-29: Disable PIN works

## Test Cases — Language
TC-30: Switch to Hindi, all text changes
TC-31: Switch back to English
TC-32: Language persists after restart

## Test Cases — System
TC-33: Back button navigates correctly
TC-34: Theme switch works
TC-35: Works offline (airplane mode)
TC-36: No crash on rapid taps

## Test Cases — Data
TC-37: 100 customers load fast
TC-38: 1000 entries per customer load OK
TC-39: No data loss after restart

## Edge Cases
- Very long customer name (50 chars)
- Large amount (99,99,999)
- Amount with decimals
- Deleting customer with 100 entries
- Special characters in name
- Hindi text rendering

## Regression Tests
After every change, re-test:
- Add customer
- Add entry
- Balance correct
- Backup works

## Before Release Checklist
[ ] All TC pass
[ ] No console errors
[ ] Works on Android 8
[ ] Works on Android 13
[ ] Offline mode tested
[ ] Backup + Restore tested
