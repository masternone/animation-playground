# Animation Playground

Animation Playground is a place for focused motion experiments that can be composed into an Astro page.

## Language

**Animated Hero**:
A first-screen visual composition whose motion is the primary experience.
_Avoid_: Banner, landing section

**Gift Box**:
The central box image that transitions from closed to open before releasing celebratory elements.
_Avoid_: Crate, package

**Confetti**:
Playful decorative elements that burst from the **Gift Box**, briefly hang, and then fall away as the page scrolls.
_Avoid_: Particles, debris

## Relationships

- An **Animated Hero** contains exactly one **Gift Box**
- A **Gift Box** releases many **Confetti** elements
- **Confetti** falls away when the **Animated Hero** leaves the viewport

## Example Dialogue

> **Dev:** "Should the **Confetti** fall after a timer?"
> **Domain expert:** "No, it should hang after the **Gift Box** opens, then fall once the **Animated Hero** scrolls away."

## Flagged Ambiguities

- "box" resolved to **Gift Box** for this animation.
- "fly out and hang" resolved to **Confetti** entering a suspended celebratory state until scroll progress changes it.
