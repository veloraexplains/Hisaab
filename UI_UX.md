# UI_UX.md — Design System

## Philosophy
- Simple for shop owners (all ages)
- Big buttons, clear text
- Hindi + English
- Works in sunlight (high contrast)
- One action per screen

## Colors — Dark Theme
- bg: #0F1A14 (deep green-black)
- card: #1A2921
- border: #2A3B32
- text: #FFFFFF
- muted: #9CA3AF
- primary: #22C55E (green, money in)
- danger: #EF4444 (red, money out)
- warning: #F59E0B

## Colors — Light Theme
- bg: #F5F7F4
- card: #FFFFFF
- text: #0F1A14
- primary: #16A34A
- danger: #DC2626

## Typography
- Font: system (no external)
- Hindi uses Noto Sans Devanagari (bundled)
- Sizes: 32/24/18/16/14/12
- Weights: 400/600/700/900

## Spacing (8px grid)
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

## Radius
- sm: 8px
- md: 14px
- lg: 20px
- full: 999px (pills, avatars)

## Components
- Button: min 48px height, rounded
- Card: rounded 16px, subtle border
- Input: 48px, clear label above
- FAB (Add): bottom-right, 56px
- Customer card: avatar + name + balance

## Icons
- Simple line icons (SVG)
- 24x24 default, 32x32 header
- Green for positive, red for negative

## Screens (V1)
1. Splash + PIN
2. Home (customer list + total)
3. Customer (ledger)
4. Add customer
5. Add entry
6. Settings
7. Backup

## Accessibility
- Minimum 48px tap targets
- WCAG AA contrast (4.5:1)
- Font scale supports 100-150%
- Not color-only information (icons + text)

## Motion
- Transitions: 150-200ms ease-out
- No bouncy animations
- Respect reduce-motion setting

## Empty States
- Big icon + friendly text + action button
- Example: No customers. Add your first →
