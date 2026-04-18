# 🈯️ Stable Version Markers

This file tracks stable versions that can be used for rollback if needed.

---

## Stable Version: v1.0.0
**Date**: 10 December 2025, 11:26 PM PST
**Tag**: `stable-v1.0.0-2025-12-10`
**Commit**: `201d56f9`
**Branch**: `claude/December_2025_upgrades-01Q6WkhzSXdikZWEaD9Zpwqg`

### Features Included
- ✅ Public Profile System with custom URLs
- ✅ Astrology Widget (Western zodiac, Hourly zodiac, Rokuyo, Moon phase)
- ✅ Simplified log autosave animation (fast blink only)
- ✅ Time format without leading zeros (4:06 PM)
- ✅ Arial typography consistency
- ✅ Mobile text wrapping fixes
- ✅ Cache-busting CSS (`?v=20241210-001`)

### Rollback Instructions
If you need to rollback to this stable version:

```bash
# View the stable tag
git tag -l "stable-v1.0.0-2025-12-10" -n50

# Rollback to this version
git checkout stable-v1.0.0-2025-12-10

# Or create a new branch from this stable point
git checkout -b rollback-to-stable-v1.0.0 stable-v1.0.0-2025-12-10

# Or reset current branch to this point (careful!)
git reset --hard stable-v1.0.0-2025-12-10
```

### Testing Status
- ✅ Mobile tested and verified
- ✅ Desktop tested and verified
- ✅ PWA functionality confirmed
- ✅ Public profiles working
- ✅ Astrology widget displaying correctly
- ✅ Text wrapping fixed
- ✅ All animations smooth

### Production Status
**Status**: Ready for production deployment
**Deployed**: ✅ Yes
**Verified**: ✅ Stable

---

## Stable Version: v1.1.0
**Date**: 9 March 2026, PST
**Tag**: `stable-v1.1.0-2026-03-09`
**Commit**: `0d8e091`
**Branch**: `claude/quantum-engine-widgets-RgFfC`

### Features Included
- ✅ Fixed week number calculation (ceil(dayOfYear/7) instead of ISO week)
- ✅ Site loads without blank page issue
- ✅ All previous v1.0.0 features intact

### Rollback Instructions
```bash
git tag -l "stable-v1.1.0-2026-03-09" -n50
git checkout stable-v1.1.0-2026-03-09
```

### Testing Status
- ✅ Week number displays correctly as Week 10
- ✅ Site loads without blank/reload issues

### Production Status
**Status**: Ready for production deployment
**Verified**: ✅ Stable

---

## Stable Version: v1.2.0
**Date**: 3 April 2026, PST
**Tag**: `stable-v1.2.0-2026-04-03`
**Commit**: `102dfc7`
**Branch**: `claude/quantum-engine-widgets-RgFfC`

### Features Included
- ✅ Quantum Intention Engine with 10 recognized patterns and 7 signal sources
- ✅ 44 widgets fully wired with WidgetErrorBoundary crash isolation
- ✅ MicroGameWidget: 64×64 pixel monochromatic game screen (Tetris/Invaders/Snake)
- ✅ MicroCalculatorWidget: ASCII calculator at magical times
- ✅ CosmicUpdateWidget: Together AI image generation
- ✅ Evolution system with 7D state tracking and CSS variable injection
- ✅ Community Pulse atmosphere layer with convergence signals
- ✅ Pattern Recognition, Cohort Connect, and Chat Catalyst widgets
- ✅ Self-care cleanness module with QIE-driven visibility gating
- ✅ Signal persistence to localStorage + periodic server sync
- ✅ Responsive layout detection (Mobile/Tablet/Desktop)
- ✅ New layout with proper stack organization and spacing
- ✅ All previous v1.1.0 features intact

### Rollback Instructions
```bash
git tag -l "stable-v1.2.0-2026-04-03" -n50
git checkout stable-v1.2.0-2026-04-03
```

### Testing Status
- ✅ All 44 widgets wired and rendering correctly
- ✅ Quantum Intention Engine signal flow verified
- ✅ WidgetErrorBoundary isolation on all stacks
- ✅ Layout stacks properly organized (15 sections)
- ✅ Evolution sync and streak calculation working
- ✅ Recipe/Planner visibility gating verified

### Production Status
**Status**: Ready for production deployment
**Verified**: ✅ Stable

---

## How to Add New Stable Versions

When marking a new stable version, follow this pattern:

```bash
# Create a stable tag
git tag -a stable-v{VERSION}-{YYYY-MM-DD} -m "🈯️ STABLE VERSION - Rollback Point
Date: {Full Date and Time}
Version: {VERSION}

Brief description of what's included and why it's stable.
"

# Document it in this file with:
# - Date and time
# - Commit hash
# - Branch name
# - Feature list
# - Rollback instructions
# - Testing status
```

---

**Last Updated**: 3 April 2026
