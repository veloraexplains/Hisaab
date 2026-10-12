# DATA_MODEL.md — Data Structures

## Storage Keys (prefix hisaab_)
- hisaab_customers — Array of Customer
- hisaab_entries — Array of Entry
- hisaab_language — hi or en
- hisaab_theme — dark or light
- hisaab_pin — 4 digits or null
- hisaab_install_date — timestamp
- hisaab_version — number

## Customer
Fields:
- id: string (c_timestamp)
- name: string (1-50 chars) required
- phone: string (10 digits) optional
- createdAt: number
- note: string (max 200) optional

## Entry
Fields:
- id: string (e_timestamp)
- customerId: string (refers to Customer)
- type: gave or got
- amount: number (greater than 0)
- note: string (max 100) optional
- date: number (transaction date)
- createdAt: number

## Balance Formula
balance = SUM(gave) - SUM(got)
- Positive = customer owes you (RED)
- Negative = you owe customer (GREEN)
- Zero = settled (GRAY)

Total pending = SUM of all positive balances

## Validation Rules
Customer: name required, phone optional 10 digits
Entry: customerId must exist, amount greater than 0

## Limits
- Customers: 500 max
- Entries per customer: 1000 max
- Total: around 10000 entries

## Backup Format
version, exportedAt, appVersion, data
Filename: hisaab-backup-YYYY-MM-DD.json

## Deletion
- Delete customer: also delete their entries
- Delete entry: allowed
- Clear all: from settings

## Privacy
Everything on device. No sync. No upload. No tracking.
