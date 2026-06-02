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
  secondary: '#b9c7e0'
  on-secondary: '#233144'
  secondary-container: '#3c4a5e'
  on-secondary-container: '#abb9d2'
  tertiary: '#ffffff'
  on-tertiary: '#00363d'
  tertiary-container: '#9cf0ff'
  on-tertiary-container: '#006f7c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#caf300'
  primary-fixed-dim: '#b0d500'
  on-primary-fixed: '#171e00'
  on-primary-fixed-variant: '#3e4c00'
  secondary-fixed: '#d5e3fd'
  secondary-fixed-dim: '#b9c7e0'
  on-secondary-fixed: '#0d1c2f'
  on-secondary-fixed-variant: '#3a485c'
  tertiary-fixed: '#9cf0ff'
  tertiary-fixed-dim: '#00daf3'
  on-tertiary-fixed: '#001f24'
  on-tertiary-fixed-variant: '#004f58'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  stats-xl:
    fontFamily: Sora
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.04em
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
  md: 16px
  lg: 24px
  xl: 40px
  grid-margin: 20px
  grid-gutter: 16px
---

## Brand & Style

The design system is built for a high-performance fitness environment where AI-driven precision meets raw human energy. The aesthetic is **Corporate Modern** with a **Glassmorphic** overlay, creating a "technical cockpit" feel for the user’s fitness journey. 

The UI must feel urgent yet controlled—evoking the atmosphere of a premium, dark-lit high-tech gym. By utilizing high-contrast accents against deep, layered dark surfaces, we communicate both the reliability of AI and the intensity of a workout. The target audience is data-driven athletes who value professional-grade tools and immediate visual feedback.

## Colors

The palette is optimized for low-light environments (dark mode) to reduce eye strain during early morning or late-night sessions.

- **Primary (Electric Lime):** Used exclusively for primary actions, progress completion, and critical data points. It is the "energy" of the system.
- **Secondary (Slate):** Used for structural elements, inactive states, and secondary iconography.
- **Tertiary (Cyan):** Used for AI-specific features, such as "AI Insights" or "Smart Adjustments," to differentiate machine logic from physical activity.
- **Backgrounds:** The foundation is a deep charcoal (#121212), with elevated surfaces using slightly lighter variants to create depth without losing the "void" aesthetic.

## Typography

This design system utilizes **Sora** for headlines to provide a geometric, high-tech athletic feel. The wide apertures and bold weights make metrics and exercise names feel impactful and modern. **Inter** is used for all functional and instructional text, ensuring maximum legibility during intense physical activity where the user may only glance at the screen.

Statistical data (reps, sets, weight) should use the `stats-xl` style, prioritizing numerical clarity and visual weight.

## Layout & Spacing

The layout follows a **fluid grid** system designed for high-motion environments.
- **Mobile:** 4-column grid with 20px margins.
- **Desktop/Tablet:** 12-column grid with centered max-width of 1200px.

A 8px base unit drives the spacing scale. In workout-active views, padding is increased to `lg` (24px) or `xl` (40px) to provide "breathing room" for touch targets, ensuring users can interact with the UI even with sweaty or shaky hands. Content should be stacked vertically on mobile to prioritize the current exercise instruction.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** combined with **Glassmorphism**. 

1. **Base:** Deep Charcoal (#121212) - The canvas.
2. **Surface:** Slate (#1E293B at 40% opacity) - For secondary containers.
3. **Glass Overlay:** Semi-transparent surfaces with a 20px backdrop blur and a 1px low-contrast border (#FFFFFF10). This is used for cards containing active workout data to create a sense of focus and high-tech sophistication.

Shadows are avoided in favor of subtle inner glows and borders to maintain a crisp, digital-first appearance.

## Shapes

The shape language is consistently **Rounded** to contrast with the aggressive color palette and technical typography, making the professional tool feel accessible.

- **Standard Containers:** 16px (rounded-lg) corner radius.
- **Primary Buttons:** Fully rounded (pill-shaped) to distinguish them from data cards.
- **Inner Elements:** (Input fields, small chips) use 8px (base roundedness) to maintain nested harmony.

## Components

### Buttons
- **Primary:** Neon Electric Lime background with black text. No shadow; high-contrast is the only affordance.
- **Secondary:** Ghost style with a 1px Slate border and white text.
- **Active State:** Slight scale-down (0.98) on tap to provide tactile feedback.

### Cards
Cards use the glassmorphic style described in Elevation. They must never have a solid background; they rely on the backdrop blur to separate themselves from the deep charcoal base.

### Progress Indicators
Progress bars use a thick 8px track. The unfilled portion is #334155, and the filled portion is a gradient from Electric Lime to a slightly darker Citrine to imply movement and energy.

### Input Fields
Dark backgrounds (#1A1A1A) with 1px Slate borders. Upon focus, the border transitions to Electric Lime with a subtle outer glow of the same color.

### AI Insights (Specialty Component)
A container with a subtle Cyan (#00E5FF) left-border accent and an animated "pulse" icon to indicate active AI processing or real-time form correction.