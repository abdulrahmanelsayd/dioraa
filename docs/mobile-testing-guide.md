# Mobile Responsiveness Testing Guide

## Overview
This document outlines the comprehensive testing strategy for DIORA's mobile responsiveness implementation.

## Device Testing Matrix

### Priority Devices (Must Test)
| Device | Viewport | OS | Priority |
|--------|----------|-----|----------|
| iPhone SE (3rd gen) | 375 × 667 | iOS 15+ | High |
| iPhone 12/13/14 | 390 × 844 | iOS 15+ | High |
| iPhone 14 Pro Max | 430 × 932 | iOS 16+ | High |
| Samsung Galaxy S21 | 360 × 800 | Android 12+ | High |
| Google Pixel 7 | 412 × 915 | Android 13+ | High |
| iPad Mini | 768 × 1024 | iPadOS 15+ | Medium |
| iPad Pro 12.9" | 1024 × 1366 | iPadOS 15+ | Medium |

### Desktop Breakpoints
| Breakpoint | Width | Usage |
|------------|-------|-------|
| xs | 375px | Small phones |
| sm | 640px | Large phones |
| md | 768px | Tablets portrait |
| lg | 1024px | Tablets landscape / Small laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large desktops |

## Testing Checklist

### Phase 1: Foundation & Design System
- [ ] Breakpoints render correctly at all viewport sizes
- [ ] Typography scales appropriately (fluid typography)
- [ ] Spacing scale is consistent across breakpoints
- [ ] Safe area insets work on notched devices
- [ ] Touch targets meet 44px minimum
- [ ] Focus states are visible and accessible

### Phase 2: Core Components
#### Navbar
- [ ] Mobile menu toggle is accessible
- [ ] Navigation links stack properly on mobile
- [ ] Search bar adapts to viewport
- [ ] Cart/Wishlist icons are tappable
- [ ] Safe area padding is applied

#### MobileBottomNav
- [ ] Navigation items are evenly spaced
- [ ] Icons are properly sized
- [ ] Badges display correctly
- [ ] Quick Menu button is accessible
- [ ] Hide/show on scroll works smoothly
- [ ] Glass morphism effect renders correctly

#### Footer
- [ ] Newsletter form is usable on mobile
- [ ] Trust badges scale appropriately
- [ ] Links are tappable and properly spaced
- [ ] Social icons meet touch target size
- [ ] Payment icons are visible

### Phase 3: Feature Components
#### ProductCard
- [ ] Image aspect ratio is maintained
- [ ] Badges are visible on not cut off
- [ ] Action buttons are tappable
- [ ] Mobile variant selector works
- [ ] Add to Bag button is accessible
- [ ] Price and title are readable

#### ProductGrid
- [ ] Grid adapts from 1 to 4 columns
- [ ] Category filter chips are tappable
- [ ] "View All" button is accessible
- [ ] Loading skeletons display correctly
- [ ] Animations are smooth (no jank)

### Phase 4: Product Detail Page
#### ProductGallery
- [ ] Thumbnails scroll horizontally on mobile
- [ ] Main image zoom works on desktop
- [ ] Lightbox opens/closes smoothly
- [ ] Navigation arrows are tappable
- [ ] Image counter is visible
- [ ] Swipe gestures work (if implemented)

### Phase 5: Cart & Checkout
#### CartDrawer
- [ ] Drawer slides in from right
- [ ] Close button is accessible
- [ ] Tab navigation works
- [ ] Free shipping progress bar displays
- [ ] Quantity controls are tappable
- [ ] Remove/Save buttons work
- [ ] Checkout button is prominent
- [ ] Safe area padding applied

### Phase 6: Performance & PWA
- [ ] PWA manifest is valid
- [ ] App is installable
- [ ] Icons display correctly
- [ ] Splash screen appears
- [ ] Offline page shows (if implemented)
- [ ] Images lazy load
- [ ] Animations respect reduced motion

### Phase 7: Touch & Gestures
- [ ] Swipe gestures work correctly
- [ ] Long press triggers actions
- [ ] Pull-to-refresh works (if implemented)
- [ ] Haptic feedback triggers (on supported devices)
- [ ] Touch ripple effect displays
- [ ] Pinch-to-zoom works (if implemented)

## Accessibility Testing

### WCAG 2.1 Level AA Compliance
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Color contrast meets 4.5:1 ratio
- [ ] Touch targets are minimum 44×44px
- [ ] Screen reader announces all content
- [ ] No horizontal scroll at 320px zoom
- [ ] Content reflows without horizontal scroll

### Screen Reader Testing
Test with:
- VoiceOver (iOS)
- TalkBack (Android)
- NVDA (Windows)
- JAWS (Windows)

## Performance Testing

### Core Web Vitals Targets
| Metric | Target | Measurement |
|--------|--------|--------------|
| LCP (Largest Contentful Paint) | < 2.5s | First meaningful paint |
| FID (First Input Delay) | < 100ms | Time to interactive |
| CLS (Cumulative Layout Shift) | < 0.1 | Visual stability |
| TTI (Time to Interactive) | < 3.8s | Full interactivity |
| TBT (Total Blocking Time) | < 200ms | Main thread blocking |

### Mobile-Specific Metrics
- [ ] First Contentful Paint < 1.8s
- [ ] Speed Index < 3.4s
- [ ] Time to Interactive < 3.8s on 3G
- [ ] Total page size < 1MB
- [ ] Number of requests < 50

### Testing Tools
- Chrome DevTools Device Mode
- Lighthouse (Mobile)
- WebPageTest (Mobile settings)
- PageSpeed Insights
- BrowserStack Live

## Browser Testing

### Mobile Browsers
- [ ] Safari iOS (latest 2 versions)
- [ ] Chrome Android (latest 2 versions)
- [ ] Samsung Internet (latest)
- [ ] Firefox Android (latest)
- [ ] UC Browser (if target market uses)

### Desktop Browsers (Responsive Mode)
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)

## Network Condition Testing

### Connection Speeds
Test under these network conditions:
- [ ] Fast 3G (1.6 Mbps)
- [ ] Slow 3G (400 Kbps)
- [ ] Offline
- [ ] 4G (9 Mbps)
- [ ] WiFi (typical)

### Adaptive Loading
- [ ] Images load at appropriate quality
- [ ] Animations disable on slow connections
- [ ] Critical content loads first
- [ ] Progressive enhancement works

## Regression Testing

### After Each Change
1. Test on iPhone SE (smallest viewport)
2. Test on iPhone 14 Pro Max (largest phone)
3. Test on iPad (tablet breakpoint)
4. Test on Desktop (all breakpoints)
5. Run Lighthouse audit
6. Check for console errors
7. Verify touch interactions

## Bug Reporting Template

When reporting mobile responsiveness bugs, include:

```markdown
## Bug Description
[Clear description of the issue]

## Device Information
- Device: [e.g., iPhone 13]
- OS: [e.g., iOS 16.4]
- Browser: [e.g., Safari 16.4]
- Viewport: [e.g., 390 × 844]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Screenshots
[Attach screenshots showing the issue]

## Severity
- [ ] Critical (blocks user flow)
- [ ] High (significant UX impact)
- [ ] Medium (minor UX issue)
- [ ] Low (cosmetic issue)
```

## Automated Testing

### Playwright Tests (Recommended)
```typescript
// Example responsive test
import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test('ProductCard displays correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const productCard = page.locator('[data-testid="product-card"]').first();
    await expect(productCard).toBeVisible();
    
    // Check touch target size
    const addToBag = productCard.locator('button:has-text("Add to Bag")');
    const box = await addToBag.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });
});
```

### Visual Regression Testing
Consider using:
- Percy
- Applitools
- BackstopJS
- Playwright snapshots

## Sign-off Checklist

Before considering mobile responsiveness complete:

- [ ] All devices in priority matrix tested
- [ ] All phases 1-8 verified
- [ ] Accessibility audit passed
- [ ] Performance targets met
- [ ] No critical or high severity bugs
- [ ] Cross-browser testing complete
- [ ] Network condition testing done
- [ ] PWA installation tested
- [ ] Stakeholder approval received

---

**Last Updated**: 2026-03-31
**Version**: 1.0.0
**Maintained By**: DIORA Development Team
