# PERFORMANCE.md

## Targets
- APK size: under 10 MB
- Cold start: under 2 seconds
- Screen transition: under 200ms
- Add entry: under 100ms
- Search: instant (under 50ms)
- 100 customers: still smooth

## APK Size Strategy
- No frameworks (saves 500KB+)
- SVG icons only (tiny)
- No external fonts
- Compress any images
- Remove unused Capacitor plugins

## Runtime Performance
- Debounce search input (300ms)
- Cache DOM references
- Avoid inline event handlers (except simple)
- Lazy render customer lists (show 20, load more)
- Batch localStorage writes

## Storage Efficiency
- Store entries per customer as array
- Don't duplicate customer info in entries
- JSON is compact

## Battery
- No background services
- No continuous polling
- No GPS, camera, or sensors
- Target under 2% per hour

## Cold Start Optimization
- Inline critical CSS
- Defer non-critical JS
- Show splash immediately
- Load data async

## Memory
- Release DOM after page navigation
- Avoid long-lived intervals
- Clear event listeners on unload

## Measuring
- Chrome DevTools (Lighthouse)
- Android Profiler
- Manual timing with performance.now()

## Red Lines (must not cross)
- APK over 15 MB
- Cold start over 3 seconds
- Any visible lag on 100 customers
- Battery drain over 5% per hour

## Optimization Checklist
[ ] No unused CSS
[ ] No unused JS
[ ] No console.log in production
[ ] All images optimized
[ ] Minify CSS for release
[ ] Minify JS for release
