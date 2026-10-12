# TECH_STACK.md — Technology Stack

## Philosophy
- Simple beats clever — plain HTML/CSS/JS, no frameworks
- Offline-first — no backend, no API, no internet
- Small APK — target under 10 MB
- Fast — cold start under 2 seconds
- Free forever — no server costs

## Core Stack
| Layer | Tech | Version | Why |
|-------|------|---------|-----|
| Language | HTML5 + CSS3 + JS ES6 | — | Simple, no build |
| UI Framework | None (vanilla) | — | Fast, tiny |
| Styling | Custom CSS | — | Full control |
| Routing | Multi-page HTML | — | Works offline |
| State | localStorage | — | Built-in |
| Container | Capacitor | 6.x | HTML to Android |
| Android | SDK 34 | — | Stable |
| Build | Gradle | 8.x | Standard |
| Java | OpenJDK | 21 | Required |

## Capacitor Plugins (Pinned)
| Plugin | Version | Purpose |
|--------|---------|---------|
| @capacitor/core | 6.2.2 | Core |
| @capacitor/cli | 6.x | Dev |
| @capacitor/android | 6.x | Android |
| @capacitor/app | 6.x | Back button |
| @capacitor/haptics | 6.x | Vibration |
| @capacitor/share | 6.x | Share backup |
| @capacitor/filesystem | 6.x | Save files |

## NOT Using
| Tech | Why Not |
|------|---------|
| React/Vue | Overkill, bloats |
| Tailwind | Build step |
| Bootstrap | 200KB unused |
| Firebase | Needs internet |
| Google Fonts | Not offline |

## File Format
- HTML: 6 pages max
- CSS: 1 file
- JS: 4 files
- Storage: localStorage JSON

## Localization
- Hindi (primary), English (secondary)
- No external i18n library

## Compatibility
- Min: Android 6.0 (API 23)
- Full: Android 7-15

## Performance Targets
- APK: <10 MB
- Cold start: <2s
- Transitions: <200ms

## Security
- No internet permission
- App sandbox storage
- PIN lock (client-side)

## Cost
- Development: Free
- Play Store: $25 one-time
- Server: $0
- Total: $25
