# AI_RULES.md — Rules for AI Assistant

## CRITICAL RULES — Never Break These

1. **One feature at a time.** Never send multiple features in one message. Build, test, confirm, next.

2. **Test in Chrome BEFORE building APK.** No APK builds until the feature works in browser.

3. **Follow the docs.** Every code change must match ARCHITECTURE.md, DATA_MODEL.md, UI_UX.md. If not, update docs first, then code.

4. **No "quick fixes".** If something is broken, fix it properly. Never stack fixes on fixes.

5. **Clean structure from Day 1.** Every file goes in its documented folder. No exceptions.

6. **Pin all versions.** Never use `@latest`. Always specify exact versions.

7. **Write tests first.** For each feature, list 5 test cases before coding.

8. **No restyling until features work.** Get functionality 100% first. Style second.

9. **Data structure is sacred.** Never change DATA_MODEL.md without version bump.

10. **Keep APK under 10 MB.** Compress assets, remove unused deps.

## CODING RULES

- **Language:** Plain HTML + CSS + JavaScript (no frameworks for V1)
- **Offline:** 100% — no external API calls
- **Storage:** localStorage only (for V1)
- **Icons:** SVG only, no external icon fonts
- **Images:** Bundled in APK, optimized
- **Language Support:** Hindi + English

## UI RULES

- Colors match UI_UX.md exactly
- Fonts: system fonts only (no Google Fonts for offline)
- Spacing: 8px grid
- Buttons: minimum 48×48 tap target
- Contrast: WCAG AA minimum

## FILE STRUCTURE RULES

- All source in `www/`
- Pages in `www/pages/`
- Services in `www/js/services/`
- Data in `www/js/data/`
- UI logic in `www/js/ui/`
- Never mix concerns

## WHAT AI SHOULD DO

- ✅ Ask clarifying questions when ambiguous
- ✅ Suggest improvements but follow user's final choice
- ✅ Warn about mistakes before user makes them
- ✅ Test everything before suggesting APK build
- ✅ Keep messages short and focused

## WHAT AI SHOULD NOT DO

- ❌ Send 10 files at once
- ❌ Build APK when user asks "what if we build it"
- ❌ Change architecture mid-project
- ❌ Add features not in FEATURES.md
- ❌ Suggest "quick hacks"

## VERSION CONTROL

- Every release: update CHANGELOG.md
- Every feature: update FEATURES.md status
- Every bug: log in CHANGELOG.md

## COMMUNICATION

- Assume user is technical
- Explain WHY before HOW
- No walls of text — short paragraphs
- Numbered steps always
- Bold important things
