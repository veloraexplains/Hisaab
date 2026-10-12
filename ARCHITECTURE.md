# ARCHITECTURE.md — Hisaab

## Overview
Multi-page HTML app wrapped in Capacitor.
Each screen = separate HTML file.
State in localStorage. No backend.

## Folder Structure
Hisaab/
  www/
    index.html
    pages/
    css/style.css
    js/
    assets/
  android/
  capacitor.config.json
  package.json

## Layers
1. UI (HTML+CSS)
2. UI Logic (ui/*.js)
3. Services (services/*.js)
4. Data (data/*.js)
5. Storage (localStorage)

## Storage Keys
- hisaab_customers
- hisaab_entries
- hisaab_language
- hisaab_pin
- hisaab_theme

## Routing
Multi-page. Router.go('customer', {id:123})

## Performance
- No frameworks
- SVG icons
- No external requests

## Security
- No internet permission
- App sandbox storage
- PIN lock (client-side)

## Deployment
1. Edit files in www/
2. npx cap sync android
3. ./gradlew assembleDebug
4. Install APK
