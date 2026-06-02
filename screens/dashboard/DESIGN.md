---
name: Kinetic Precision
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
  on-surface-variant: '#c5c9ac'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8f9378'
  outline-variant: '#444932'
  surface-tint: '#b0d500'
  primary: '#ffffff'
  on-primary: '#2a3400'
  primary-container: '#caf300'
  on-primary-container: '#596c00'
  inverse-primary: '#536600'
  secondary: '#bcc7de'
  on-secondary: '#263143'
  secondary-container: '#3e495d'
  on-secondary-container: '#aeb9d0'
  tertiary: '#ffffff'
  on-tertiary: '#1b343d'
  tertiary-container: '#cde7f3'
  on-tertiary-container: '#506873'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#caf300'
  primary-fixed-dim: '#b0d500'
  on-primary-fixed: '#171e00'
  on-primary-fixed-variant: '#3e4c00'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#cde7f3'
  tertiary-fixed-dim: '#b1cad7'
  on-tertiary-fixed: '#041e28'
  on-tertiary-fixed-variant: '#324a54'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
  electric-lime: '#D4FF00'
  slate-900: '#0F172A'
  slate-800: '#1E293B'
  slate-400: '#94A3B8'
  surface-elevation-1: '#1C1C1C'
  surface-elevation-2: '#252525'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Sora
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Sora
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Sora
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Sora
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Sora
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1200px
  gutter: 20px
---

## Brand & Style

The design system is engineered for **TreinoX AI**, an elite fitness assistant. The brand personality is aggressive, high-performance, and technologically advanced, evoking the feeling of a premium high-tech gym environment.

The visual style is **Kinetic Precision**, a fusion of **Corporate Modern** structure and **Glassmorphism** depth, energized by **High-Contrast** accents. It focuses on movement and data clarity, utilizing a deep dark mode to reduce ocular strain during workouts while highlighting critical performance metrics with high-visibility electric tones.

## Colors

This design system utilizes a **Deep Dark Mode** foundation to create a high-end, "stealth" aesthetic.

- **Primary (Electric Lime):** Reserved exclusively for primary actions (CTAs), progress indicators, and critical data points. It provides maximum contrast against the dark background.
- **Secondary (Slate Blue/Gray):** Used for secondary buttons, subtle borders, and icon backgrounds to provide depth without competing with the primary action.
- **Neutral (Deep Carbon):** The base layer is `#131313`. Successive elevation layers use slightly lighter variants to create visual hierarchy.
- **Typography Colors:** Primary text should be high-white (`#FFFFFF`), with secondary labels in `slate-400`.

## Typography

The typography system uses **Sora**, a geometric sans-serif with a distinct industrial character that reinforces the fitness-tech theme.

- **Scale:** Use `display-lg` for heroic data points (e.g., heart rate, weights, timers).
- **Weight:** Leverage the Extra Bold (800) and Bold (700) weights for headlines to create a sense of strength.
- **Labels:** Use uppercase for `label-sm` to denote categories or overlines, enhancing the technical/analytical feel.
- **Readability:** Maintain generous line heights for body text to ensure legibility during physical activity.

## Layout & Spacing

The system follows a **strict 8px grid** to ensure mathematical precision and alignment.

- **Grid Model:** A 12-column fluid grid for desktop and a 4-column grid for mobile.
- **Margins:** Desktop margins are set to `xl` (64px) to create a premium, spacious feel. Mobile margins are `md` (24px).
- **Reflow:** On mobile, complex data tables should reflow into card stacks. Navigation transitions from a top bar to a persistent glassmorphic bottom navigation bar.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Glassmorphism**.

- **Surface Tiers:** Background is `#131313`. Cards and containers sit at `#1C1C1C`. Interactive elements (hover states) lift to `#252525`.
- **Glassmorphism:** Navigation bars and floating action menus utilize a `backdrop-blur(12px)` with a semi-transparent `slate-900` fill (60% opacity) and a 1px `white/10%` border to define the edge.
- **Shadows:** Use extremely soft, large-radius shadows (`0 20px 40px rgba(0,0,0,0.4)`) for floating elements like modals.
- **Borders:** Subtle 1px borders using `slate-800` are preferred over heavy shadows to maintain the "Precision" aesthetic.

## Shapes

The shape language is defined by **ROUND_EIGHT (0.5rem / 8px)**.

- **Standard Elements:** Buttons, input fields, and cards all utilize the base 8px radius.
- **Progress Bars:** These should use full-pill rounding (e.g., 999px) to contrast against the structural geometry of the containers.
- **Icons:** Use linear, 2px stroke icons with slightly rounded corners to match the typography's geometric nature.

## Components

- **Buttons:** 
    - **Primary:** Electric Lime background with black text (`#131313`). High impact, used for "Start Workout."
    - **Secondary:** Slate-800 background with white text. Used for "Edit" or "History."
- **Input Fields:** Dark backgrounds (`#1C1C1C`) with a 1px border. On focus, the border changes to Electric Lime with a subtle outer glow.
- **Cards:** Use a subtle gradient or solid `#1C1C1C` fill. Use Electric Lime strictly for "Active" states (e.g., the current set in a workout list).
- **Chips:** Small, high-contrast badges for "New Record" or "AI Suggestion" using a semi-transparent Electric Lime background with solid lime text.
- **Navigation Bar:** Fixed at the top (Desktop) or bottom (Mobile), using the glassmorphic blur effect to allow content to scroll behind it beautifully.
- **Data Visualizations:** Charts should use Electric Lime for primary trend lines, with Slate-400 for grid lines and secondary data.