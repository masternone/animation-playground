---
name: Animation Playground
description: A loud, vibrant workshop for expressive browser-motion experiments.
colors:
  workshop-ink: "#172126"
  midnight-stage: "#121617"
  warm-paper: "#fffaf2"
  stage-paper: "#f1ede3"
  deep-teal: "#243c3f"
  gift-orange: "#f08b44"
  ribbon-teal: "#43b7a9"
  confetti-pink: "#e6426f"
  confetti-cyan: "#2aa5b8"
  confetti-yellow: "#ffc43d"
  confetti-violet: "#6d5dfc"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 10vw, 8.5rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "0"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 6.5rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "0"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1rem, 2vw, 1.3rem)"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.12em"
rounded:
  confetti: "4px"
  control: "6px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "24px"
  page-gutter: "clamp(20px, 7vw, 112px)"
  section: "clamp(72px, 9vw, 128px)"
  hero: "clamp(96px, 14vw, 180px)"
components:
  navigation:
    backgroundColor: "{colors.workshop-ink}"
    textColor: "{colors.warm-paper}"
    padding: "12px clamp(20px, 4vw, 64px)"
    height: "64px"
  navigation-link:
    textColor: "{colors.warm-paper}"
    padding: "0 8px"
    height: "44px"
  navigation-link-active:
    textColor: "{colors.warm-paper}"
    padding: "0 8px"
    height: "44px"
---

# Design System: Animation Playground

## 1. Overview

**Creative North Star: "The Motion Workshop"**

Animation Playground feels like a working studio where designers and frontend developers test bold motion ideas at full scale. The system is cheerful, confident, and loud: large type, decisive full-viewport compositions, saturated color, and generous spatial pacing give every experiment a clear stage. All interface and copy align to one shared left edge; only the animation artwork may center itself within the viewport.

The surrounding interface is intentionally direct. Navigation and explanatory copy use familiar structures so the animation can be strange without the experience becoming confusing. Muted corporate styling, generic SaaS landing pages, and dashboard-like interfaces are explicitly rejected.

**Key Characteristics:**

- Full-palette color with warm orange and teal as recurring anchors.
- Oversized sans-serif typography with tight, assertive line-height.
- One shared page gutter across navigation, heroes, and content sections.
- One dominant motion idea per viewport.
- Flat structural surfaces with depth reserved for illustrated objects.
- Clear semantic navigation, strong focus states, and reduced-motion support.

**The Experiment Leads Rule.** Interface chrome must frame the motion experiment, never compete with it.

**The Full-Volume Rule.** Use the palette decisively. A vibrant hue must carry a meaningful surface, object, or state rather than appearing as timid decoration.

## 2. Colors

The palette combines warm workshop materials with high-energy celebration accents. Orange and teal establish identity; pink, cyan, yellow, and violet signal bursts of motion and delight.

### Primary

- **Gift Orange** (`gift-orange`): Active navigation, gift surfaces, and confident focal moments.
- **Ribbon Teal** (`ribbon-teal`): Counterbalances orange across ribbons, dimensional illustration details, and motion anchors.

### Secondary

- **Confetti Pink** (`confetti-pink`): Short-lived celebratory emphasis.
- **Confetti Cyan** (`confetti-cyan`): Cool punctuation within animated fields.

### Tertiary

- **Confetti Yellow** (`confetti-yellow`): Bright directional shards and small flashes.
- **Confetti Violet** (`confetti-violet`): The sharpest accent, reserved for compact graphic marks.

### Neutral

- **Workshop Ink** (`workshop-ink`): Shared header, dark sections, and primary text on warm surfaces.
- **Midnight Stage** (`midnight-stage`): Deep page ground for cinematic comparisons.
- **Warm Paper** (`warm-paper`): Main light background and text on dark surfaces.
- **Stage Paper** (`stage-paper`): Slightly muted comparison surface.
- **Deep Teal** (`deep-teal`): Immersive dark-color stage with a cooler identity than ink.

**The Anchor-and-Burst Rule.** Orange and teal establish the composition. Pink, cyan, yellow, and violet appear in compact bursts, never as an evenly distributed rainbow.

**The Contrast Rule.** Every text and interactive pairing must meet WCAG AA. Loud color never excuses weak readability.

## 3. Typography

**Display Font:** Inter with the system sans-serif stack
**Body Font:** Inter with the system sans-serif stack
**Label Font:** Inter with the system sans-serif stack

**Character:** The current single-family system is blunt, sturdy, and highly legible. Personality comes from extreme scale, heavy weight, tight display leading, and contrast between huge headings and compact labels.

### Hierarchy

- **Display** (800, `display`, 0.92): Full-viewport experiment titles, capped near 11 characters per line.
- **Headline** (800, `headline`, 0.98): Comparison-stage and follow-up headings.
- **Title** (800, `clamp(2.5rem, 8vw, 7rem)`, 1): Large supporting page statements.
- **Body** (400, `body`, 1.55): Explanatory copy, capped around 65 characters or 42rem.
- **Label** (800, `label`, 0.12em, uppercase when used as a kicker): Short technical context and stage numbering only.

**The Scale Does the Talking Rule.** Do not add decorative type treatments. Establish hierarchy through size, weight, width, and spacing.

**The Rare Kicker Rule.** Uppercase tracked labels are reserved for genuine metadata such as “Browser motion study,” not repeated above every heading.

## 4. Elevation

The interface is flat by default. Section depth comes from full-surface tonal changes, strong color boundaries, and overlap within the animated artwork. Soft shadows belong to physical illustrated objects such as the Gift Box and its lid, where they clarify motion and dimensionality.

### Shadow Vocabulary

- **Gift Float** (`drop-shadow(0 34px 36px rgb(78 49 36 / 20%))`): Grounds the complete Gift Box above its stage.
- **Lifted Lid** (`drop-shadow(18px 24px 14px rgb(99 56 35 / 18%))`): Appears only after the lid separates from the box.

**The Illustrated Depth Rule.** Never apply ambient card shadows to navigation, text panels, or content sections. Shadows describe physical motion, not generic importance.

## 5. Components

### Navigation

Compact, confident, and quieter than the experiments it connects.

- **Structure:** Full-width shared header with a 72px desktop height and the shared `page-gutter`. When space allows, navigation follows the brand title instead of floating at the far edge.
- **Brand Link:** Heavy 0.875rem text in Warm Paper.
- **Links:** Conventional text navigation with 44px touch targets and generous horizontal breathing room.
- **Default:** Muted warm text on Workshop Ink.
- **Hover:** Full Warm Paper text without changing the header surface.
- **Active:** Full Warm Paper text with a 3px Gift Orange underline and `aria-current="page"`.
- **Focus:** A high-visibility 3px yellow outline offset by 3px.
- **Mobile:** Brand and navigation remain in a familiar single row with a tighter gap. The brand label shortens before the navigation is allowed to wrap.

### Motion Stages

Each stage is a single-purpose viewport rather than a card or framed container.

- **Shape:** Edge-to-edge, square, and intentionally uncontained.
- **Spacing:** Every stage uses the shared `page-gutter`; vertical pacing uses the fluid `hero` and `section` tokens.
- **Background:** A committed color field or image-like gradient, never a generic white card.
- **Content Width:** Display titles stay narrow; body copy remains within 36 to 42rem.

### Gift Box

The signature component is a dimensional SVG object centered in a responsive full-viewport stage.

- **Color:** Gift Orange surfaces with Ribbon Teal wrapping and warm shaded sides.
- **Depth:** Gift Float at rest; Lifted Lid only after opening.
- **Motion:** The lid opens once, confetti suspends, then falls as the hero leaves view.
- **Reduced Motion:** Transitions collapse to 1ms and looping animation is disabled.

### Confetti

Small geometric accents provide the loudest color without overwhelming the composition.

- **Shapes:** Pill ribbon, circle, angular shard, and compact plus.
- **Color:** One accent role per shape.
- **Motion:** Staggered burst, suspended drift, and scroll-triggered fall.
- **Constraint:** Confetti is decorative and always hidden from assistive technology.

## 6. Do's and Don'ts

### Do:

- **Do** let each motion experiment be the main event.
- **Do** use Gift Orange and Ribbon Teal as structural anchors, then deploy the other accents in concentrated bursts.
- **Do** use full-viewport color fields and large type to create confident pacing.
- **Do** preserve semantic landmarks, `aria-current`, visible keyboard focus, and reduced-motion behavior.
- **Do** maximize Lighthouse accessibility, performance, best-practices, and SEO scores.
- **Do** keep content copy within 65 characters or approximately 42rem.

### Don't:

- **Don't** imitate muted corporate sites.
- **Don't** use generic SaaS landing pages as a visual reference.
- **Don't** make the experience resemble dashboard-like interfaces.
- **Don't** distribute every bright color evenly across every screen; that turns energy into noise.
- **Don't** put content inside generic rounded cards when a full-stage composition communicates the idea.
- **Don't** use ambient shadows on structural interface surfaces.
- **Don't** use gradient text, decorative glassmorphism, colored side-stripe borders, or repeated tiny uppercase kickers.
- **Don't** add motion that ignores `prefers-reduced-motion`.
