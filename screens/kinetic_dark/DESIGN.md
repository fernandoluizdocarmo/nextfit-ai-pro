---
name: Kinetic Dark
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c6c9ab'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#909378'
  outline-variant: '#454932'
  surface-tint: '#b8d300'
  primary: '#ffffff'
  on-primary: '#2c3400'
  primary-container: '#d2f000'
  on-primary-container: '#5d6b00'
  inverse-primary: '#576500'
  secondary: '#adc6ff'
  on-secondary: '#002e69'
  secondary-container: '#4b8eff'
  on-secondary-container: '#00285c'
  tertiary: '#ffffff'
  on-tertiary: '#690003'
  tertiary-container: '#ffdad5'
  on-tertiary-container: '#ca0a0f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d2f000'
  primary-fixed-dim: '#b8d300'
  on-primary-fixed: '#191e00'
  on-primary-fixed-variant: '#414c00'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a41'
  on-secondary-fixed-variant: '#004493'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4aa'
  on-tertiary-fixed: '#410001'
  on-tertiary-fixed-variant: '#930005'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  stats-xl:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '900'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 48px
---

## Brand & Style

The design system is engineered for a high-performance fitness environment. It targets active users who value efficiency, intensity, and clarity. The brand personality is **energetic, authoritative, and motivating**, utilizing a "Dark Mode First" philosophy to minimize eye strain in gym environments and maximize the pop of functional colors.

The style is a hybrid of **Modern Minimalism** and **High-Contrast Bold**. It relies on deep backgrounds to create a focused "void" where only the most essential data and action triggers reside. Motion and momentum are conveyed through italicized accents, sharp transitions, and vibrant luminosity.

## Colors

The palette is designed for maximum "glanceability" during intense physical activity.

- **Primary (Neon Lime - #DFFF00):** Used exclusively for primary actions, progress completion, and "Start" triggers. It signifies energy and go-signals.
- **Secondary (Electric Blue - #007AFF):** Used for informational accents, interactive states, and tracking data (e.g., heart rate graphs or distance).
- **Tertiary (Warning Red - #FF3B30):** Reserved for "Stop" actions, heart rate zones reaching maximum capacity, or error states.
- **Neutral (Deep Charcoal/Black):** The background is a true dark charcoal (#121212) rather than pure black to maintain soft depth, while surfaces utilize slightly lighter shades to establish hierarchy.

## Typography

Typography focuses on **athletic scale and urgency**. 

- **Headlines:** We use **Inter** with heavy weights (ExtraBold/Black) and tight letter spacing. For workout metrics (seconds, reps, kg), we employ an italicized "stats-xl" style to evoke a sense of speed and forward motion.
- **Labels:** We introduce **Space Mono** for technical data labels and timestamps to provide a precise, "equipment-gauge" aesthetic.
- **Readability:** Body text maintains generous line height (1.6) to ensure legibility while the user is in motion.

## Layout & Spacing

The layout follows a **Fluid Grid** model with high-density information centers.

- **Mobile:** A 4-column grid with 20px side margins. Elements are typically full-bleed or stacked to prioritize large touch targets.
- **Desktop/Tablet:** A 12-column grid. Dashboard views use "Masonry" style card layouts to surface multiple data streams simultaneously.
- **Rhythm:** An 8px linear scale is used for all internal component spacing, while 4px "micro-steps" are used for icon-to-label proximity.

## Elevation & Depth

In this dark-themed design system, depth is achieved through **Tonal Layering** and **High-Contrast Outlines** rather than traditional shadows.

1.  **Level 0 (Base):** #121212 (The background).
2.  **Level 1 (Cards):** #1E1E1E. These surfaces feature a subtle 1px border (#2C2C2C) to define edges against the base.
3.  **Level 2 (Modals/Popovers):** #252525 with a soft 10% primary-tinted glow (Neon Lime) to indicate they are "active" or "hovering" over the interface.
4.  **Interactive Elements:** Buttons do not use shadows; they use solid, high-contrast fills. When a user interacts, the element shifts from a fill to a thick 2px stroke.

## Shapes

The shape language balances **aggression with accessibility**. 

- **Standard Containers:** Cards and input fields use a **16px (rounded-lg)** radius to feel modern and premium.
- **Action Elements:** Primary "Start" buttons and "Complete" chips use a **full-pill (rounded-xl)** radius. This distinct shape shift signals a change from "content" to "action."
- **Data Visuals:** Progress bars and charts use rounded caps to maintain the friendly yet high-tech aesthetic.

## Components

### Buttons
- **Primary:** Neon Lime background, black text, Bold Inter, All-caps. Large padding (20px vertical).
- **Secondary:** Transparent background, 2px Electric Blue stroke, Blue text.
- **Tertiary/Ghost:** White text, no background, underline on hover.

### Cards
- Cards are the primary vessel for workouts and stats. They feature a #1E1E1E background and high-contrast headlines. Use 16px internal padding. Secondary data points inside cards should use the Space Mono label style.

### Progress Bars
- Background track: #2C2C2C.
- Fill: Linear gradient from Electric Blue to Neon Lime to show "momentum" and "energy building."

### Input Fields
- Dark grey fills with Neon Lime bottom-borders that animate to 2px thickness on focus. Labels sit above the field in Space Mono.

### Performance Chips
- Small, pill-shaped tags used for workout difficulty (e.g., "ADVANCED"). Use secondary color fills with low opacity (15%) and solid text for a "glass" appearance without the blur.