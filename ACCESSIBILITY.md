# ACCESSIBILITY.md

## Principle
Small shop owners have all ages.
App must work for everyone.

## Text Size
- Default: 15px body
- Minimum: 14px never smaller
- Respects Android font scale
- Line height: 1.5 minimum

## Contrast
- Text on dark bg: white #FFF
- Muted text: #9CA3AF on #0F1A14 (5.1:1 ratio)
- Meets WCAG AA (4.5:1)

## Touch Targets
- Minimum: 48x48 px
- Buttons: 48px height
- FAB (floating button): 56x56 px
- Spacing between: 8px minimum

## Icons
- Always paired with text or label
- Never icon-only for critical actions
- aria-label for screen readers
- 24px minimum size

## Color + Text
- Never color-only information
- Balance: red OR green + amount + label
- Example: '₹500 pending' (red + text)

## Screen Reader
- aria-label on icon buttons
- role=button where needed
- Alt text on meaningful images
- Logical heading order (h1 > h2)

## Language Support
- Hindi Devanagari fully supported
- Font: Noto Sans Devanagari bundled
- English fallback always available

## Motion
- No auto-playing animations
- Transitions: 150-200ms max
- Respect reduce-motion preference

## Testing With Users
- Test with older users (50+)
- Test in bright sunlight
- Test with Hindi font
- Test with one-hand use

## Checklist
[ ] All buttons over 48px
[ ] All text over 14px
[ ] Contrast passes WCAG AA
[ ] Icons have labels
[ ] Color not sole information
[ ] Hindi rendering correct
