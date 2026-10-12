# PRD.md — Product Requirements Document

## 1. Overview

**Product:** Hisaab — Digital Khata Book
**Platform:** Android (Capacitor WebView)
**Users:** Indian small business owners (kirana, chai, tailor, mechanic, etc.)

## 2. User Personas

### Persona A: Ramesh — Kirana Store Owner
- Age 45, Tier-3 city, Maharashtra
- Uses WhatsApp, watches YouTube
- Gives credit to 40 regular customers
- Currently uses paper notebook
- Pain: forgets debts, notebook gets wet, customers argue

### Persona B: Sunita — Chai Stall Owner
- Age 32, small town UP
- Gives credit to 15 daily customers
- Uses basic smartphone
- Pain: small amounts add up, can't remember who owes what

### Persona C: Arjun — Tailor
- Age 28, Delhi
- Customers pay advance + balance later
- 30-50 active orders
- Pain: loses track of partial payments

## 3. User Stories

### US-1: Add Customer
As a shop owner, I want to add a new customer with name and phone, so I can track their khata.

**Acceptance:**
- Can enter name (required)
- Can enter phone (optional, validated as 10 digits)
- Customer saved locally
- Appears in customer list

### US-2: Add Entry
As a shop owner, I want to add a "gave" or "got" entry for a customer, so I can track money flow.

**Acceptance:**
- Choose customer
- Select "You Gave" (red) or "You Got" (green)
- Enter amount (₹)
- Optional note
- Optional date (default today)
- Entry saved and shown in ledger

### US-3: View Ledger
As a shop owner, I want to see one customer's full history, so I can settle disputes.

**Acceptance:**
- Tap customer → see all entries
- Newest first
- Show running balance
- Show date, amount, note per entry

### US-4: Total Balance
As a shop owner, I want to see total money owed to me, so I know my position.

**Acceptance:**
- Home shows total pending ₹
- Each customer card shows their balance
- Color: red (they owe), green (you owe)

### US-5: Send Reminder
As a shop owner, I want to send a WhatsApp reminder, so I can ask for payment politely.

**Acceptance:**
- Button on customer page
- Opens WhatsApp with pre-filled message
- Message includes name + amount + polite tone
- Works in Hindi or English based on app language

### US-6: Search
As a shop owner, I want to search customers by name or phone, so I can find them fast.

**Acceptance:**
- Search bar on customer list
- Filters as you type
- Shows matching customers
- Empty state if none found

### US-7: Backup
As a shop owner, I want to export all data to a file, so I don't lose it if phone breaks.

**Acceptance:**
- Settings → Backup
- Saves JSON file to phone storage
- Can restore from file
- Shows confirmation

### US-8: PIN Lock
As a shop owner, I want a 4-digit PIN, so others can't see my khata.

**Acceptance:**
- Settings → Enable PIN
- Set 4-digit PIN
- On app open, asks for PIN
- Can disable

### US-9: Language
As a shop owner, I want to switch between Hindi and English, so I can use my preferred language.

**Acceptance:**
- Settings → Language
- Switch instantly
- All text changes
- Persists across restarts

### US-10: Offline
As a shop owner with poor internet, I want the app to work without internet, so I can use it anywhere.

**Acceptance:**
- App never calls internet
- All features work offline
- No "network error" messages
- No ads, no tracking

## 4. Non-Functional Requirements

- **Performance:** Cold start <2s, tap response <100ms
- **Size:** APK <10 MB
- **Battery:** <2% per hour of use
- **Storage:** <20 MB for 1000 entries
- **Accessibility:** 48px buttons, WCAG AA contrast
- **Privacy:** No analytics, no ads, no telemetry
- **Security:** PIN lock, data stays on device

## 5. Design Requirements

- Dark + Light themes
- Big buttons (small shop users may have older phones)
- Hindi-friendly fonts (Devanagari)
- Simple icons (not abstract)
- No clutter — one action per screen

## 6. Out of Scope (V1)

- Cloud sync
- Multi-user
- Reports
- GST invoicing
- Inventory
- Payment collection
- Online backup

## 7. Dependencies

- None (fully offline)

## 8. Release Plan

- V1: Core features (customers, entries, ledger, backup, PIN, language)
- V1.1: Bug fixes
- V2: Cloud backup (optional, paid)
- V3: Reports, charts
- V4: iOS version
